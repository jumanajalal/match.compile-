import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const RAPID_FIRE = [
  { q: "Who scored Argentina's dramatic stoppage-time winner against England in the semifinal?", options: ["Julián Álvarez", "Lautaro Martínez", "Enzo Fernández", "Ángel Di María"], answer: 1 },
  { q: "What was the final score of the Spain vs France semifinal?", options: ["1-0 France", "2-0 Spain", "2-1 Argentina", "3-1 Spain"], answer: 1 },
  { q: "France lost the third-place match in a wild finish. What was the final score?", options: ["England 6-4 France", "France 6-4 England", "England 3-1 France", "France 3-2 England"], answer: 0 },
  { q: "Who are the two finalists meeting tonight?", options: ["France vs England", "Argentina vs Spain", "Spain vs England", "Argentina vs France"], answer: 1 },
  { q: "Messi and Mbappé are tied for the Golden Boot race with 8 goals each. Who currently leads on the tiebreaker?", options: ["Mbappé, more assists", "Messi, more assists", "Neither, exactly tied", "Golden Boot has no tiebreaker"], answer: 1 },
  { q: "Argentina are the defending champions coming into tonight's Final. True or false?", options: ["True", "False"], answer: 0 },
  { q: "If tonight's Final is level after 90 minutes, what happens next?", options: ["Straight to penalties", "30 minutes of extra time, then penalties if still level", "Match replayed another day", "Golden goal, sudden death immediately"], answer: 1 },
  { q: "Which round on this site awarded the 'Chief VAR' badge?", options: ["Puzzle Break", "VAR Check", "Kickoff Trivia", "Transfer Market"], answer: 1 },
  { q: "When does your Adopt-a-Nation multiplier get finalized?", options: ["Day 1 sign-up", "After every match", "Once tonight's Final ends", "It never changes"], answer: 2 },
  { q: "Would you rather debug a merge conflict at 2 AM, or take a penalty in a World Cup Final shootout?", options: ["Merge conflict", "Penalty shootout"], answer: null },
  { q: "Final score bragging rights — which scoreline feels most likely tonight?", options: ["1-0", "2-1", "2-2 → penalties", "3-1"], answer: null },
];

const POINTS_PER_CORRECT = 15;

export default function FinalWhistleRound({ profile, onComplete, onOpenBuildSpecs }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState(Array(RAPID_FIRE.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function init() {
      let { data: existing } = await supabase
        .from('quiz_attempts').select('*')
        .eq('participant_id', profile.id).eq('round_name', 'final_whistle').maybeSingle();

      if (!existing) {
        const { data: created, error } = await supabase
          .from('quiz_attempts')
          .insert([{ participant_id: profile.id, round_name: 'final_whistle', question_set: RAPID_FIRE }])
          .select().single();
        if (error) {
          const { data: retry } = await supabase
            .from('quiz_attempts').select('*')
            .eq('participant_id', profile.id).eq('round_name', 'final_whistle').maybeSingle();
          existing = retry;
        } else {
          existing = created;
        }
      }
      setAttempt(existing);
      if (existing?.submitted_at) setResult({ score: existing.score_value });
      setLoading(false);
    }
    if (profile?.id) init();
  }, [profile]);

  async function handleSubmit() {
    // Only questions with a defined `answer` are auto-scored — opinion questions always count as participation.
    const scoredCount = RAPID_FIRE.filter(q => q.answer !== null).length;
    const correct = answers.filter((a, i) => RAPID_FIRE[i].answer !== null && a === RAPID_FIRE[i].answer).length;
    const opinionParticipation = RAPID_FIRE.filter((q, i) => q.answer === null && answers[i] !== null).length * 10;
    const points = correct * POINTS_PER_CORRECT + opinionParticipation;

    await supabase.from('quiz_attempts').update({
      submitted_at: new Date().toISOString(),
      score_value: points,
    }).eq('id', attempt.id);

    await supabase.from('scores').upsert(
      [{ participant_id: profile.id, team_id: profile.team_id || null, round_name: 'final_whistle', score_value: points }],
      { onConflict: 'participant_id,round_name', ignoreDuplicates: true }
    );

    setResult({ score: points });
    onComplete && onComplete();
  }

  if (loading) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading round...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-lime uppercase mb-2">Round 06 // Final Whistle</p>
      <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-2">Last Call</h1>
      <p className="text-xs text-gray-500 mb-6">Tonight's the Final — Argentina vs Spain. Here's the last stretch.</p>

      {/* Build Round deadline banner */}
      <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a0c] border border-fifa-red/30 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <p className="text-white font-display font-bold text-sm uppercase tracking-widest mb-1">⏰ Build Round closes tonight</p>
          <p className="text-xs text-gray-400">Submit your model or flowchart before the Final kicks off — no extensions after tonight.</p>
        </div>
        <button onClick={onOpenBuildSpecs} className="bg-white text-black px-5 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-fifa-red hover:text-white transition-colors shrink-0">
          View Submission Info
        </button>
      </div>

      {result ? (
        <div className="bg-[#08080a] border border-gray-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">🏁</div>
          <p className="text-white font-display font-bold text-lg mb-1">You're all set — {result.score} points</p>
          <p className="text-xs text-gray-500">The final leaderboard locks after tonight's Final. Good luck to your department.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {RAPID_FIRE.map((item, qi) => (
            <div key={qi} className="bg-[#0a0a0c] border border-gray-800/60 rounded-xl p-5">
              <p className="text-white text-sm font-medium mb-4">{qi + 1}. {item.q}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers(a => a.map((v, i) => i === qi ? oi : v))}
                    className={`text-left text-xs px-4 py-2.5 rounded-lg border transition-all ${
                      answers[qi] === oi ? 'bg-fifa-lime/15 border-fifa-lime text-white' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit} disabled={answers.includes(null)}
            className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fifa-lime transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Submit & Lock In
          </button>
        </div>
      )}
    </div>
  );
}