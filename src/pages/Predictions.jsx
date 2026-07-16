import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Flag from '../components/Flag';

const MATCH = { round: '3rd_place_prediction', teamA: 'England', teamB: 'France' };

// Add a new entry here every time a match wraps — this drives the "Past Matches" section below.
// Add the previous match here so it appears in the "Past Matches" section
const PAST_MATCHES = [
  {
    round: 'sf1_prediction',
    date: 'July 14',
    teamA: 'Spain',
    teamB: 'France', // Example actual teams
    actualScoreA: 2,
    actualScoreB: 0,
  },
  {
    round: 'sf2_prediction',
    date: 'July 15',
    teamA: 'England',
    teamB: 'Argentina', 
    actualScoreA: 1,
    actualScoreB: 2,
  },
];

const medal = { 1: '🥇', 2: '🥈', 3: '🥉' };

function PastMatchCard({ match }) {
  const [rows, setRows] = useState([]);
  const [totalPredictors, setTotalPredictors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: scores } = await supabase
        .from('scores')
        .select('participant_id, score_value, participants(full_name)')
        .eq('round_name', match.round)
        .order('score_value', { ascending: false })
        .limit(5);

      const { data: predictions } = await supabase
        .from('predictions')
        .select('participant_id, predicted_score_a, predicted_score_b')
        .eq('round_name', match.round);

      const predMap = {};
      (predictions || []).forEach(p => { predMap[p.participant_id] = p; });

      const merged = (scores || []).map((s, i) => ({
        rank: i + 1,
        name: s.participants?.full_name || 'Unknown',
        points: s.score_value,
        predicted: predMap[s.participant_id]
          ? `${predMap[s.participant_id].predicted_score_a}-${predMap[s.participant_id].predicted_score_b}`
          : '—',
      }));

      setRows(merged);
      setTotalPredictors((predictions || []).length);
      setLoading(false);
    }
    load();
  }, [match.round]);

  return (
    <div className="bg-[#08080a] border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">{match.date} · Final Result</p>
        <span className="text-[9px] text-gray-600 uppercase tracking-widest">{totalPredictors} predictions made</span>
      </div>

      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="text-center">
          <Flag nation={match.teamA} className="w-10 h-7 mx-auto mb-1 rounded-md" />
          <div className="text-white text-xs font-bold uppercase tracking-widest">{match.teamA}</div>
        </div>
        <div className="text-2xl font-display font-black text-white">
          {match.actualScoreA} – {match.actualScoreB}
        </div>
        <div className="text-center">
          <Flag nation={match.teamB} className="w-10 h-7 mx-auto mb-1 rounded-md" />
          <div className="text-white text-xs font-bold uppercase tracking-widest">{match.teamB}</div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 text-xs">Loading top predictors...</p>
      ) : rows.length === 0 ? (
        <p className="text-center text-gray-600 text-xs">No scored predictions yet for this match.</p>
      ) : (
        <div className="border-t border-gray-800/60 pt-4">
          <div className="grid grid-cols-3 text-[9px] uppercase tracking-widest text-gray-600 mb-2 px-2">
            <div>Predictor</div>
            <div className="text-center">Called</div>
            <div className="text-right">Points</div>
          </div>
          {rows.map(r => (
            <div key={r.name} className="grid grid-cols-3 items-center text-xs text-gray-300 py-2 px-2 border-t border-gray-800/30">
              <div className="flex items-center gap-2">
                <span>{medal[r.rank] || `0${r.rank}`}</span> {r.name}
              </div>
              <div className="text-center text-gray-500">{r.predicted}</div>
              <div className="text-right font-bold text-white">{r.points > 0 ? `+${r.points}` : r.points}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
      // Change these lines inside the return block
<p className="text-[10px] font-bold tracking-[0.3em] text-fifa-purple uppercase mb-2">
  Third Place Playoff // Prediction
</p>
<h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-8">
  3rd Place Match Call
</h1>

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

      <div className="bg-[#08080a] border border-gray-800 rounded-2xl p-6 text-center mb-10">
        <p className="text-2xl font-display font-black text-fifa-purple mb-1">{lockedCount}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Predictions locked in so far</p>
        <p className="text-[10px] text-gray-600 mt-2">Points get calculated and added to the leaderboard once the match result is in.</p>
      </div>

      {PAST_MATCHES.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] text-gray-600 uppercase mb-4">Past Matches</p>
          {PAST_MATCHES.map(m => <PastMatchCard key={m.round} match={m} />)}
        </div>
      )}
    </div>
  );
}