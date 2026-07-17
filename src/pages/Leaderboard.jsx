import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building, User, Users, Shield } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Flag from '../components/Flag';

const medal = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('team');
  const [rows, setRows] = useState({ individual: [], team: [], department: [], nation: [] });
  const [loading, setLoading] = useState(true);
  const [chiefRef, setChiefRef] = useState(null);
  const [bestTactician, setBestTactician] = useState(null);

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

      const { data: varTop } = await supabase
        .from('scores')
        .select('participant_id, score_value, participants(full_name)')
        .eq('round_name', 'var_check')
        .order('score_value', { ascending: false })
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

      const byPerson = {};
      (individuals || []).forEach(r => {
        const name = r.participants?.full_name || 'Unknown';
        byPerson[name] = (byPerson[name] || 0) + r.score_value;
      });
      const individualRows = Object.entries(byPerson)
        .sort((a, b) => b[1] - a[1])
        .map(([name, score], i) => ({ rank: i + 1, name, score }));

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
                <tr key={r.name} className="border-b border-gray-800/50 hover:bg-fifa-cyan/[0.03] transition-colors">
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
                  </td>
                  <td className="p-4 text-right font-bold">{r.score.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}