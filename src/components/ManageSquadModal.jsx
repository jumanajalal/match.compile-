import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Users } from 'lucide-react';

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ManageSquadModal({ profile, onClose, onUpdated }) {
  const [mode, setMode] = useState('choose'); // choose | create | join
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) return setError('Enter a squad name');
    setLoading(true);
    setError('');
    const code = genCode();
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .insert([{ team_name: teamName.trim(), join_code: code }])
      .select()
      .single();

    if (teamErr) { setError(teamErr.message); setLoading(false); return; }

    const { error: linkErr } = await supabase
      .from('participants')
      .update({ team_id: team.id })
      .eq('id', profile.id);

    if (linkErr) { setError(linkErr.message); setLoading(false); return; }
    setLoading(false);
    onUpdated();
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return setError('Enter a join code');
    setLoading(true);
    setError('');
    const { data: team, error: findErr } = await supabase
      .from('teams')
      .select('*')
      .eq('join_code', joinCode.trim().toUpperCase())
      .maybeSingle();

    if (findErr || !team) { setError('No squad found with that code'); setLoading(false); return; }

    const { error: linkErr } = await supabase
      .from('participants')
      .update({ team_id: team.id })
      .eq('id', profile.id);

    if (linkErr) { setError(linkErr.message); setLoading(false); return; }
    setLoading(false);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d10] border border-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={18} />
        </button>
        <h2 className="flex items-center gap-2 font-display font-bold text-lg uppercase text-white tracking-wide mb-6">
          <Users size={18} className="text-fifa-red" /> Manage Squad
        </h2>

        {error && <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-xs p-3 rounded-md mb-4">{error}</div>}

        {mode === 'choose' && (
          <div className="space-y-3">
            <button onClick={() => setMode('create')}
              className="w-full bg-fifa-cyan/10 border border-fifa-cyan/40 text-fifa-cyan py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan/20 transition-colors">
              Create a Squad
            </button>
            <button onClick={() => setMode('join')}
              className="w-full bg-fifa-purple/10 border border-fifa-purple/40 text-fifa-purple py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-purple/20 transition-colors">
              Join with Code
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Squad name"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none" />
            <button onClick={handleCreate} disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors">
              {loading ? 'Creating...' : 'Create Squad'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 text-xs uppercase tracking-widest">Back</button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="e.g. AB12CD"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm uppercase focus:border-fifa-purple outline-none" />
            <button onClick={handleJoin} disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-purple transition-colors">
              {loading ? 'Joining...' : 'Join Squad'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 text-xs uppercase tracking-widest">Back</button>
          </div>
        )}

        {profile?.team_id && mode === 'choose' && (
          <p className="text-[10px] text-gray-500 text-center mt-4">You're already on a squad — joining/creating a new one replaces it.</p>
        )}
      </div>
    </div>
  );
}