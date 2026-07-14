import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Flag from '../components/Flag';

const MATCH = { round: 'sf1_prediction', teamA: 'Argentina', teamB: 'Switzerland' };

export default function Predictions({ profile }) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: mine } = await supabase
        .from('predictions').select('*')
        .eq('participant_id', profile.id).eq('round_name', MATCH.round).maybeSingle();
      if (mine) {
        setLocked(true);
        setScoreA(mine.predicted_score_a);
        setScoreB(mine.predicted_score_b);
      }
      const { count } = await supabase
        .from('predictions').select('*', { count: 'exact', head: true })
        .eq('round_name', MATCH.round);
      setLockedCount(count || 0);
      setChecking(false);
    }
    if (profile?.id) init();
  }, [profile]);

  const handleLock = async () => {
    const { error } = await supabase.from('predictions').insert([{
      participant_id: profile.id,
      round_name: MATCH.round,
      team_a: MATCH.teamA,
      team_b: MATCH.teamB,
      predicted_score_a: scoreA,
      predicted_score_b: scoreB,
    }]);
    if (!error) {
      setLocked(true);
      setLockedCount(c => c + 1);
    }
  };

  if (checking) return <div className="max-w-2xl mx-auto text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-purple uppercase mb-2">Round 02 // Prediction</p>
      <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-8">SF1 Match Call</h1>

      <div className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-fifa-purple/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-10" style={{ background: '#6B2B8E' }} />
        <div className="flex justify-between items-center relative">
          <div className="text-center">
            <Flag nation={MATCH.teamA} className="w-14 h-10 mx-auto mb-2 rounded-md shadow-lg" />
            <div className="text-white font-display font-bold text-sm uppercase tracking-widest">{MATCH.teamA}</div>
          </div>
          <div className="flex gap-3 items-center">
            {[[scoreA, setScoreA, 'fifa-cyan'], [scoreB, setScoreB, 'fifa-red']].map(([val, setter, color], i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <button disabled={locked} onClick={() => setter(s => s + 1)} className={`w-8 h-6 rounded-t-md bg-[#1a1a1a] border border-${color}/40 text-${color} text-xs disabled:opacity-30`}>▲</button>
                <div className={`w-16 h-16 bg-black border-2 border-${color}/40 text-center text-white text-2xl font-display font-black rounded-xl flex items-center justify-center`}>
                  {val}
                </div>
                <button disabled={locked} onClick={() => setter(s => Math.max(0, s - 1))} className={`w-8 h-6 rounded-b-md bg-[#1a1a1a] border border-${color}/40 text-${color} text-xs disabled:opacity-30`}>▼</button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Flag nation={MATCH.teamB} className="w-14 h-10 mx-auto mb-2 rounded-md shadow-lg" />
            <div className="text-white font-display font-bold text-sm uppercase tracking-widest">{MATCH.teamB}</div>
          </div>
        </div>
        <button
          onClick={handleLock}
          disabled={locked}
          className="w-full mt-8 bg-white text-black py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-fifa-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {locked ? '✓ Prediction Locked' : 'Lock Prediction'}
        </button>
      </div>

      <div className="bg-[#08080a] border border-gray-800 rounded-2xl p-6 text-center">
        <p className="text-2xl font-display font-black text-fifa-purple mb-1">{lockedCount}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Predictions locked in so far</p>
        <p className="text-[10px] text-gray-600 mt-2">Points get calculated and added to the leaderboard once the match result is in.</p>
      </div>
    </div>
  );
}