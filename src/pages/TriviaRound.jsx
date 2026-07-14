import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { buildQuizForPlayer } from './questionBank';

export default function TriviaRound({ profile }) {
  const questions = useMemo(() => buildQuizForPlayer(profile?.adopted_nation), [profile?.id]);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [score, setScore] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkExisting() {
      const { data } = await supabase
        .from('scores').select('score_value')
        .eq('participant_id', profile.id).eq('round_name', 'kickoff_trivia').maybeSingle();
      if (data) { setAlreadyDone(true); setScore(data.score_value); }
      setChecking(false);
    }
    if (profile?.id) checkExisting();
  }, [profile]);

  const handleSubmit = async () => {
    const correct = answers.filter((a, i) => a === questions[i].answer).length;
    const points = correct * 10;
    setScore(points);
    await supabase.from('scores').insert([{
      participant_id: profile.id,
      team_id: profile.team_id || null,
      round_name: 'kickoff_trivia',
      score_value: points,
    }]);
    setSubmitted(true);
  };

  if (checking) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading round...</div>;

  if (alreadyDone || submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Round Complete</h2>
        <p className="text-gray-400 text-sm">You scored <span className="text-fifa-lime font-bold">{score} points</span> on Kickoff Trivia.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-red uppercase mb-2">Round 01 // Kickoff Trivia</p>
      <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-2">Warm It Up</h1>
      <p className="text-xs text-gray-500 mb-8">You're seeing a random set of {questions.length} — everyone gets a different mix.</p>

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