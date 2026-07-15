import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const PUZZLES = [
  {
    prompt: "Four semifinalists — France, Spain, England, Argentina — each won their quarterfinal by a different margin: 2-0, 2-1, 2-1 (extra time), and 3-1 (extra time). France won by the biggest margin WITHOUT extra time. Argentina's match went to extra time and they won by 2 goals. Spain's match did NOT go to extra time. What was Spain's scoreline?",
    options: ["2-0", "2-1", "3-1", "1-0"],
    answerIndex: 1,
  },
  {
    prompt: "A club has ₹100 lakh to spend and wants the strongest possible pair of new signings. Player A costs ₹40L and adds a rating of 85. Player B costs ₹60L and adds a rating of 90. Player C costs ₹35L and adds a rating of 70. Which combination gives the highest total rating while staying within ₹100L?",
    options: ["A + C (₹75L, rating 155)", "B alone (₹60L, rating 90)", "A + B (₹100L, rating 175)", "C alone (₹35L, rating 70)"],
    answerIndex: 2,
  },
  {
    prompt: "In a 5-team mini league, every team plays every other team exactly once. How many total matches are played?",
    options: ["10", "15", "20", "5"],
    answerIndex: 0,
  },
  {
    prompt: "A striker's shot conversion rate this tournament is 1 goal for every 4 shots on target. If she's had 6 shots on target so far, what's her most likely goal count, rounded down?",
    options: ["1", "2", "3", "4"],
    answerIndex: 0,
  },
  {
    prompt: "Three friends split World Cup final tickets 2:3:5 by how much each paid, totalling ₹10,000. How much did the person who paid the least contribute?",
    options: ["₹1,000", "₹2,000", "₹3,000", "₹5,000"],
    answerIndex: 1,
  },
];

const POINTS_PER_CORRECT = 16; // 5 questions × 16 = 80 max

export default function PuzzleRound({ profile, onComplete }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState(Array(PUZZLES.length).fill(null));
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const tabSwitches = useRef(0);

  useEffect(() => {
    async function init() {
      let { data: existing } = await supabase
        .from('quiz_attempts').select('*')
        .eq('participant_id', profile.id).eq('round_name', 'puzzle_break').maybeSingle();

      if (!existing) {
        const { data: created, error } = await supabase
          .from('quiz_attempts')
          .insert([{ participant_id: profile.id, round_name: 'puzzle_break', question_set: PUZZLES }])
          .select().single();

        if (error) {
          const { data: retry } = await supabase
            .from('quiz_attempts').select('*')
            .eq('participant_id', profile.id).eq('round_name', 'puzzle_break').maybeSingle();
          existing = retry;
        } else {
          existing = created;
        }
      }

      setAttempt(existing);
      if (existing?.submitted_at) setResult({ score: existing.score_value, duration: existing.duration_seconds });
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

  // Anti-cheat: count how many times they leave the tab while the round is active
  useEffect(() => {
    if (!attempt || attempt.submitted_at) return;
    const handleVisibility = () => {
      if (document.hidden) tabSwitches.current += 1;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [attempt]);

  const handleSubmit = async () => {
    const correct = answers.filter((a, i) => a === PUZZLES[i].answerIndex).length;
    const points = correct * POINTS_PER_CORRECT;
    const duration = Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000);

    await supabase.from('quiz_attempts').update({
      submitted_at: new Date().toISOString(),
      duration_seconds: duration,
      score_value: points,
      tab_switches: tabSwitches.current,
    }).eq('id', attempt.id);

    await supabase.from('scores').upsert(
      [{
        participant_id: profile.id,
        team_id: profile.team_id || null,
        round_name: 'puzzle_break',
        score_value: points,
        duration_seconds: duration,
      }],
      { onConflict: 'participant_id,round_name', ignoreDuplicates: true }
    );

    setResult({ score: points, duration });
    onComplete && onComplete();
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const allAnswered = answers.every(a => a !== null);

  if (loading) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading round...</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="text-5xl mb-4">🧩</div>
        <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Round Complete</h2>
        <p className="text-gray-400 text-sm mb-1">You scored <span className="text-fifa-lime font-bold">{result.score} / 80 points</span></p>
        <p className="text-gray-600 text-xs">Finished in {fmt(result.duration)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-blue uppercase mb-2">Round 03 // Puzzle Break</p>
          <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white">Think It Through</h1>
        </div>
        <div className="bg-[#0a0a0c] border border-gray-800 rounded-lg px-4 py-2 text-center">
          <div className="text-fifa-cyan font-display font-black text-lg">{fmt(elapsed)}</div>
          <div className="text-[8px] text-gray-600 uppercase tracking-widest">Elapsed</div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-6">No coding needed — just careful reading and logic. Take your time.</p>

      <div className="space-y-6">
        {PUZZLES.map((puzzle, pi) => (
          <div key={pi} className="bg-[#0a0a0c] border border-gray-800/60 rounded-xl p-5">
            <p className="text-white text-sm font-medium mb-4">{pi + 1}. {puzzle.prompt}</p>
            <div className="grid grid-cols-1 gap-2">
              {puzzle.options.map((opt, oi) => (
                <button key={oi}
                  onClick={() => setAnswers(a => a.map((v, i) => i === pi ? oi : v))}
                  className={`text-left text-xs px-4 py-2.5 rounded-lg border transition-all ${
                    answers[pi] === oi ? 'bg-fifa-blue/15 border-fifa-blue text-white' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!allAnswered}
        className="w-full mt-8 bg-white text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fifa-blue hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Submit Solutions
      </button>
    </div>
  );
}