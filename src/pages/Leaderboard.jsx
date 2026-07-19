import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Building, User, Users, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Flag from '../components/Flag';

const medal = { 1: '🥇', 2: '🥈', 3: '🥉' };

const ROUND_LABELS = {
  kickoff_trivia: 'Kickoff Trivia',
  puzzle_break: 'Puzzle Break',
  transfer_market: 'Transfer Market',
  var_check: 'VAR Check',
  moments_quiz: 'Moments Quiz',
  meme_post: 'Meme Post',
  meme_bonus: 'Meme Bonus',
  final_whistle: 'Final Whistle',
  sf1_prediction: 'SF1 Prediction',
  sf2_prediction: 'SF2 Prediction',
  third_place_prediction: '3rd Place Prediction',
  final_prediction: 'Final Prediction',
};

function PlayerBreakdownModal({ participantId, name, onClose }) {
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('scores')
        .select('round_name, score_value')
        .eq('participant_id', participantId)
        .order('score_value', { ascending: false });

      setBreakdown(data || []);
      setLoading(false);
    }

    load();
  }, [participantId]);

  const total = breakdown.reduce((sum, r) => sum + r.score_value, 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d10] border border-gray-800 rounded-2xl p-6 max-w-sm w-full relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X size={18}/>
        </button>

        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
          Points Breakdown
        </p>

        <h2 className="font-display font-black text-xl text-white mb-5">
          {name}
        </h2>

        {loading ? (
          <p className="text-gray-600 text-xs">Loading...</p>
        ) : breakdown.length === 0 ? (
          <p className="text-gray-600 text-xs">No scores yet.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {breakdown.map((r, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-black/40 border border-gray-800 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-gray-300">
                  {ROUND_LABELS[r.round_name] || r.round_name}
                </span>

                <span className="text-xs font-bold text-fifa-cyan">
                  +{r.score_value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between border-t border-gray-800 pt-4">
          <span className="text-xs uppercase tracking-widest text-gray-400">
            Total
          </span>

          <span className="text-lg font-display font-black text-white">
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('team');
  const [rows, setRows] = useState({ individual: [], team: [], department: [], nation: [] });
  const [loading, setLoading] = useState(true);
  const [chiefRef, setChiefRef] = useState(null);
  const [topMemer, setTopMemer] = useState(null);
  const [bestTactician, setBestTactician] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const tabs = [
    { id: 'individual', label: 'Players', icon: User },
    { id: 'team', label: 'Squads', icon: Users },
    { id: 'department', label: 'Departments', icon: Building },
    { id: 'nation', label: 'Nations', icon: Shield },
  ];

  useEffect(() => {
    async function fetchLeaderboards() {
      setLoading(true);

      const { data: individuals } = await supabase
        .from('scores')
        .select('participant_id, score_value, participants(full_name)');

      const { data: teams } = await supabase
        .from('team_leaderboard')
        .select('team_name, total_team_score')
        .order('total_team_score', { ascending: false });

      const { data: departments } = await supabase
        .from('department_leaderboard')
        .select('department, total_dept_score')
        .order('total_dept_score', { ascending: false });

      const { data: nations } = await supabase
        .from('country_leaderboard')
        .select('adopted_nation, total_nation_score')
        .order('total_nation_score', { ascending: false });

      // Leaderboard.jsx — replace the varTop query
const { data: varTop } = await supabase
  .from('scores')
  .select('participant_id, score_value, duration_seconds, participants(full_name)')
  .eq('round_name', 'var_check')
  .order('score_value', { ascending: false })
  .order('duration_seconds', { ascending: true, nullsFirst: false })
  .limit(1)
  .maybeSingle();
setChiefRef(varTop?.participants?.full_name || null);

      const { data: tacticianTop } = await supabase
        .from('scores')
        .select('participant_id, score_value, participants(full_name)')
        .eq('round_name', 'transfer_market')
        .order('score_value', { ascending: false })
        .limit(1)
        .maybeSingle();
      setBestTactician(tacticianTop?.participants?.full_name || null);

      const { data: allMemes } = await supabase.from('memes').select('id, participant_id, participants(full_name)');
const { data: allVotes } = await supabase.from('meme_votes').select('meme_id');
const voteCounts = {};
(allVotes || []).forEach(v => { voteCounts[v.meme_id] = (voteCounts[v.meme_id] || 0) + 1; });
const topMeme = (allMemes || []).sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0))[0];
setTopMemer(topMeme?.participants?.full_name || null);

      const byPerson = {};

(individuals || []).forEach(r => {
  const id = r.participant_id;
  const name = r.participants?.full_name || "Unknown";

  if (!byPerson[id]) {
    byPerson[id] = {
      id,
      name,
      score: 0,
    };
  }

  byPerson[id].score += r.score_value;
});

const individualRows = Object.values(byPerson)
  .sort((a, b) => b.score - a.score)
  .map((r, i) => ({
    rank: i + 1,
    id: r.id,
    name: r.name,
    score: r.score,
  }));

      setRows({
        individual: individualRows,
        team: (teams || []).map((r, i) => ({ rank: i + 1, name: r.team_name, score: r.total_team_score })),
        department: (departments || []).map((r, i) => ({ rank: i + 1, name: r.department, score: r.total_dept_score })),
        nation: (nations || []).map((r, i) => ({ rank: i + 1, name: r.adopted_nation, score: r.total_nation_score })),
      });
      setLoading(false);
    }
    fetchLeaderboards();

    const channel = supabase
      .channel('scores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchLeaderboards)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-lime uppercase mb-2">Live Standings</p>
      <h1 className="font-display font-black text-4xl uppercase tracking-wide text-white mb-6">Rankings</h1>

      {(chiefRef || bestTactician) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {chiefRef && (
            <div className="flex items-center gap-2 bg-fifa-green/10 border border-fifa-green/30 rounded-full px-4 py-2">
              <span className="text-sm">📺</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Chief VAR:</span>
              <span className="text-[10px] text-fifa-green font-bold uppercase tracking-widest">{chiefRef}</span>
            </div>
          )}
          {bestTactician && (
            <div className="flex items-center gap-2 bg-fifa-blue/10 border border-fifa-blue/30 rounded-full px-4 py-2">
              <span className="text-sm">🧠</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Best Tactician:</span>
              <span className="text-[10px] text-fifa-blue font-bold uppercase tracking-widest">{bestTactician}</span>
            </div>
          )}
          {topMemer && (
  <div className="flex items-center gap-2 bg-fifa-purple/10 border border-fifa-purple/30 rounded-full px-4 py-2">
    <span className="text-sm">😂</span>
    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Top Memer:</span>
    <span className="text-[10px] text-fifa-purple font-bold uppercase tracking-widest">{topMemer}</span>
  </div>
)}
        </div>
      )}

      <div className="flex gap-2 mb-8 bg-[#0a0a0c] p-1.5 rounded-xl border border-gray-800 w-fit flex-wrap">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-fifa-cyan/15 text-fifa-cyan' : 'text-gray-500 hover:text-gray-300'
            }`}>
            <tab.icon size={12} /> {tab.label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#08080a] border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-[11px] uppercase tracking-widest">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 bg-[#0d0d10]">
              <th className="p-4">Rank</th>
              <th className="p-4">{activeTab === 'nation' ? 'Nation' : activeTab === 'department' ? 'Department' : 'Name'}</th>
              <th className="p-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {loading ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-600">Loading...</td></tr>
            ) : rows[activeTab].length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center text-gray-600">No scores yet — check back after Round 1</td></tr>
            ) : (
              rows[activeTab].map((r) => (
                <tr
  key={r.id || r.name}
  onClick={() =>
    activeTab === "individual" &&
    setSelectedPlayer({
      id: r.id,
      name: r.name,
    })
  }
  className={`border-b border-gray-800/50 hover:bg-fifa-cyan/[0.03] transition-colors ${
    activeTab === "individual"
      ? "cursor-pointer"
      : ""
  }`}
>
                  <td className="p-4 font-bold" style={{ color: r.rank <= 3 ? '#C4D600' : '#6b7280' }}>
                    {medal[r.rank] || `0${r.rank}`}
                  </td>
                  <td className="p-4 font-medium text-white flex items-center gap-2 flex-wrap">
                    {activeTab === 'nation' && <Flag nation={r.name} className="w-5 h-3.5" />}
                    {r.name}
                    {activeTab === 'individual' && r.name === chiefRef && (
                      <span className="text-[8px] bg-fifa-green/15 text-fifa-green px-1.5 py-0.5 rounded uppercase tracking-widest">Chief VAR</span>
                    )}
                    {activeTab === 'individual' && r.name === bestTactician && (
                      <span className="text-[8px] bg-fifa-blue/15 text-fifa-blue px-1.5 py-0.5 rounded uppercase tracking-widest">Best Tactician</span>
                    )}
                    {activeTab === 'individual' && r.name === topMemer && (
  <span className="text-[8px] bg-fifa-purple/15 text-fifa-purple px-1.5 py-0.5 rounded uppercase tracking-widest">Top Memer</span>
)}
                  </td>
                  <td className="p-4 text-right font-bold">{r.score.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
      {selectedPlayer && (
  <PlayerBreakdownModal
    participantId={selectedPlayer.id}
    name={selectedPlayer.name}
    onClose={() => setSelectedPlayer(null)}
  />
)}
    </div>
  );
}