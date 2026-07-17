import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

// Same fixed scenario set for every player — Community Verdict only makes sense
// if everyone is judging the exact same 8 cases, so this is NOT randomized.
const SCENARIOS = [
  {
    description: "A striker is through on goal. As she shoots, the ball clips her hand — but her arm was tucked close to her body and didn't make her body bigger.",
    correct: 'CONFIRM',
    rule: "Handball is only an offense if the arm makes the body unnaturally bigger, or the player deliberately uses it. An arm tucked in close to the body isn't an offense — the goal stands.",
  },
  {
    description: "A defender is the last player back. She makes a strong but fair sliding tackle, winning the ball cleanly, but the attacker trips over her leg afterward and goes down.",
    correct: 'CONFIRM',
    rule: "If the tackle wins the ball cleanly first, it's not a foul — the contact afterward is incidental. Play continues, no card.",
  },
  {
    description: "A forward is standing level with the second-last defender when the pass is played to him — not ahead of the defender, exactly level.",
    correct: 'CONFIRM',
    rule: "Being level with the second-last defender is NOT offside — you need to be genuinely ahead of them, even by a fraction, for it to be an offside offense.",
  },
  {
    description: "A goalkeeper claims a cross with both hands. In the same motion, an attacker who was already turning away is caught by the goalkeeper's elbow, and goes down clutching her face.",
    correct: 'OVERTURN',
    rule: "Excessive or careless use of the arm/elbow while jumping for the ball, even accidental, can still be a foul (or even a red card if reckless) when it makes contact with the head — this is one of the most contested real-world VAR calls.",
  },
  {
    description: "A player scores a stunning goal, then removes her shirt in celebration and slides on her knees in front of the fans, shirt in hand.",
    correct: 'OVERTURN',
    rule: "The goal itself always stands — but removing the shirt during celebration is a mandatory yellow card under the Laws of the Game. The referee should show a card, though the goal is not disallowed.",
  },
  {
    description: "In the build-up to a goal, a teammate of the scorer was standing in an offside position several phases earlier, but was not interfered with and the ball was reset with a new passage of play before the goal.",
    correct: 'CONFIRM',
    rule: "Once there's a clear new passage of play (like a defensive header, save, or reset), an earlier offside position doesn't carry forward. The goal stands.",
  },
  {
    description: "A defender inside her own box, with her back to the ball, is struck on the arm by a powerfully struck shot from close range. Her arm was down by her side.",
    correct: 'CONFIRM',
    rule: "A ball struck from very close range, with the arm in a natural position, is generally not considered enough time to react — no penalty.",
  },
  {
    description: "Two defenders and a lone attacker are the only players near the halfway line when the attacker is fouled just outside the box, denying an obvious goal-scoring chance.",
    correct: 'OVERTURN',
    rule: "Denying an obvious goal-scoring opportunity (DOGSO) through a foul is a straight red card, regardless of where the foul happens on the pitch, if the attacker had a clear run at goal.",
  },
];

const POINTS_PER_CORRECT = 10; // 8 questions × 10 = 80 max

export default function VARRound({ profile, onComplete }) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [lastDecision, setLastDecision] = useState(null);
  const [communityPct, setCommunityPct] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [resultsGrid, setResultsGrid] = useState([]);

  useEffect(() => {
    async function init() {
      let { data: existing } = await supabase
        .from('quiz_attempts').select('*')
        .eq('participant_id', profile.id).eq('round_name', 'var_check').maybeSingle();

      if (!existing) {
        const { data: created, error } = await supabase
          .from('quiz_attempts')
          .insert([{ participant_id: profile.id, round_name: 'var_check', question_set: SCENARIOS }])
          .select().single();

        if (error) {
          const { data: retry } = await supabase
            .from('quiz_attempts').select('*')
            .eq('participant_id', profile.id).eq('round_name', 'var_check').maybeSingle();
          existing = retry;
        } else {
          existing = created;
        }
      }

      setAttempt(existing);
      if (existing?.submitted_at) {
        setResult({ score: existing.score_value, duration: existing.duration_seconds });
      }
      setLoading(false);
    }
    if (profile?.id) init();
  }, [profile]);

  useEffect(() => {
    if (!attempt || attempt.submitted_at) return;
    const start = new Date(attempt.started_at).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [attempt]);

  async function handleDecision(decision) {
    if (revealing) return;
    const scenario = SCENARIOS[index];
    const isCorrect = decision === scenario.correct;

    await supabase.from('var_responses').insert([{
      participant_id: profile.id,
      question_index: index,
      decision,
    }]);

    const { data: allResponses } = await supabase
      .from('var_responses').select('decision')
      .eq('question_index', index);

    const total = (allResponses || []).length;
    const matching = (allResponses || []).filter(r => r.decision === decision).length;
    const pct = total > 0 ? Math.round((matching / total) * 100) : 100;

    setLastDecision({ decision, isCorrect });
    setCommunityPct(pct);
    if (isCorrect) setCorrectCount(c => c + 1);
    setRevealing(true);
    setResultsGrid(g => [...g, isCorrect]);
  }

  async function handleNext() {
    if (index === SCENARIOS.length - 1) {
      const finalCorrect = correctCount + (lastDecision?.isCorrect ? 0 : 0); // correctCount already includes current
      const points = correctCount * POINTS_PER_CORRECT;
      const duration = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000);

      await supabase.from('quiz_attempts').update({
        submitted_at: new Date().toISOString(),
        duration_seconds: duration,
        score_value: points,
      }).eq('id', attempt.id);

      await supabase.from('scores').upsert(
        [{
          participant_id: profile.id,
          team_id: profile.team_id || null,
          round_name: 'var_check',
          score_value: points,
          duration_seconds: duration,
        }],
        { onConflict: 'participant_id,round_name', ignoreDuplicates: true }
      );

      setResult({ score: points, duration });
      onComplete && onComplete();
      return;
    }
    setIndex(i => i + 1);
    setRevealing(false);
    setLastDecision(null);
    setCommunityPct(null);
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading round...</div>;

  if (result) {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-4">📺</div>
      <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Review Complete</h2>
      <p className="text-gray-400 text-sm mb-1">
        You got <span className="text-fifa-lime font-bold">{correctCount}/8 calls right</span> — {result.score} points
      </p>
      <p className="text-gray-600 text-xs mb-6">Finished in {fmt(result.duration)}</p>

      {/* Shareable report card — screenshot this. No case descriptions or rules shown, so it's safe to share before others play. */}
      <div id="var-report-card" className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-fifa-green/30 rounded-2xl p-6 mx-auto">
        <p className="font-display font-black text-white text-sm uppercase tracking-widest mb-1">Match.Compile() — VAR Check</p>
        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-4">{profile?.full_name || 'Player'} · {correctCount}/8</p>
        <div className="grid grid-cols-8 gap-1.5 justify-center mb-2">
          {resultsGrid.map((isCorrect, i) => (
            <div key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${isCorrect ? 'bg-fifa-green/20 text-fifa-green' : 'bg-fifa-red/20 text-fifa-red'}`}>
              {isCorrect ? '✓' : '✗'}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-gray-600 mt-4">Screenshot the card above to share — no spoilers, safe to post before others play.</p>
    </div>
  );
}

  const scenario = SCENARIOS[index];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-green uppercase mb-2">Round 04 // The Review Room</p>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white">VAR Check</h1>
        </div>
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-2 text-center">
          <div className="text-fifa-cyan font-display font-black text-lg">{fmt(elapsed)}</div>
          <div className="text-[8px] text-gray-600 uppercase tracking-widest">Elapsed</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-6">Case {index + 1} of {SCENARIOS.length} — make the call.</p>

      <AnimatePresence mode="wait">
        {!revealing ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleDecision('CONFIRM');
              else if (info.offset.x < -100) handleDecision('OVERTURN');
            }}
            className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-fifa-green/20 rounded-2xl p-8 mb-6 cursor-grab active:cursor-grabbing"
          >
            <div className="text-4xl mb-4 text-center">🖥️</div>
            <p className="text-white text-sm leading-relaxed text-center mb-6">{scenario.description}</p>
            <p className="text-[9px] text-gray-600 uppercase tracking-widest text-center mb-6">Swipe or tap to decide</p>
            <div className="flex gap-4">
              <button onClick={() => handleDecision('OVERTURN')}
                className="flex-1 bg-fifa-red/10 border-2 border-fifa-red text-fifa-red py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-fifa-red/20 transition-colors">
                ✕ Overturn
              </button>
              <button onClick={() => handleDecision('CONFIRM')}
                className="flex-1 bg-fifa-green/10 border-2 border-fifa-green text-fifa-green py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-fifa-green/20 transition-colors">
                ✓ Confirm
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`reveal-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#08080a] border border-gray-800 rounded-2xl p-8 mb-6"
          >
            <div className="text-center mb-5">
              <div className="text-3xl mb-2">{lastDecision.isCorrect ? '✅' : '❌'}</div>
              <p className="text-white font-display font-bold text-lg">
                {lastDecision.isCorrect ? 'Correct Call' : `Wrong — it was ${scenario.correct}`}
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6 text-center">{scenario.rule}</p>
            <div className="bg-black/40 border border-gray-800 rounded-xl p-4 text-center mb-6">
              <p className="text-2xl font-display font-black text-fifa-cyan">{communityPct}%</p>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">of players also said {lastDecision.decision}</p>
            </div>
            <button onClick={handleNext}
              className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fifa-green hover:text-white transition-colors">
              {index === SCENARIOS.length - 1 ? 'Finish Review' : 'Next Case →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}