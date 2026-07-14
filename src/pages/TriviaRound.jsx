import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { buildQuizForPlayer } from './questionBank';

export default function TriviaRound({ profile, onComplete }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  // TriviaRound.jsx — replace the init() function inside useEffect
useEffect(() => {
  async function init() {
    let { data: existing } = await supabase
      .from('quiz_attempts').select('*')
      .eq('participant_id', profile.id).eq('round_name', 'kickoff_trivia').maybeSingle();

    if (!existing) {
      const questionSet = buildQuizForPlayer(profile.adopted_nation);
      const { data: created, error } = await supabase
        .from('quiz_attempts')
        .insert([{ participant_id: profile.id, round_name: 'kickoff_trivia', question_set: questionSet }])
        .select().single();

      if (error) {
        // Someone/something already created this row (e.g. StrictMode double-call) — fetch it instead of crashing
        const { data: retry } = await supabase
          .from('quiz_attempts').select('*')
          .eq('participant_id', profile.id).eq('round_name', 'kickoff_trivia').maybeSingle();
        existing = retry;
      } else {
        existing = created;
      }
    }

    setAttempt(existing);
    if (existing?.submitted_at) {
      setResult({ score: existing.score_value, duration: existing.duration_seconds });
    } else if (existing) {
      setAnswers(Array(existing.question_set.length).fill(null));
    }
    setLoading(false);
  }
  if (profile?.id) init();
}, [profile]);

  // live timer, ticks from the DB-recorded start time, not local state — can't be reset by refresh
  useEffect(() => {
    if (!attempt || attempt.submitted_at) return;
    const start = new Date(attempt.started_at).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [attempt]);

  const handleSubmit = async () => {
    const questions = attempt.question_set;
    const correct = answers.filter((a, i) => a === questions[i].answer).length;
    const points = correct * 10;
    const duration = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000);

    await supabase.from('quiz_attempts').update({
      submitted_at: new Date().toISOString(),
      duration_seconds: duration,
      score_value: points,
    }).eq('id', attempt.id);

    await supabase.from('scores').insert([{
      participant_id: profile.id,
      team_id: profile.team_id || null,
      round_name: 'kickoff_trivia',
      score_value: points,
      duration_seconds: duration,
    }]);

    setResult({ score: points, duration });
    onComplete && onComplete();
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (loading) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading round...</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Round Complete</h2>
        <p className="text-gray-400 text-sm mb-1">You scored <span className="text-fifa-lime font-bold">{result.score} points</span></p>
        <p className="text-gray-600 text-xs">Finished in {fmt(result.duration)} — faster times break ties on the leaderboard</p>
      </div>
    );
  }

  const questions = attempt.question_set;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-red uppercase mb-2">Round 01 // Kickoff Trivia</p>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white">Warm It Up</h1>
        </div>
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-2 text-center">
          <div className="text-fifa-cyan font-display font-black text-lg">{fmt(elapsed)}</div>
          <div className="text-[8px] text-gray-600 uppercase tracking-widest">Elapsed</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-8">Your questions were locked in when you started — refreshing won't reroll them.</p>

      <div className="space-y-6">
        {questions.map((item, qi) => (
          <div key={qi} className="bg-[#0a0a0c] border border-gray-800/60 rounded-xl p-5">
            <p className="text-white text-sm font-medium mb-4">{qi + 1}. {item.q}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.options.map((opt, oi) => (
                <button key={oi} onClick={() => setAnswers(a => a.map((v, i) => i === qi ? oi : v))}
                  className={`text-left text-xs px-4 py-2.5 rounded-lg border transition-all ${
                    answers[qi] === oi ? 'bg-fifa-red/15 border-fifa-red text-white' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={answers.includes(null)}
        className="w-full mt-8 bg-white text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fifa-red hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Submit Answers
      </button>
    </div>
  );
}