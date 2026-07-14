import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Users, Copy, Check, LogOut } from 'lucide-react';

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ManageSquadModal({ profile, onClose, onUpdated }) {
  const [mode, setMode] = useState('choose'); // choose | create | join | created | joined
  const [teamName, setTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [resultTeam, setResultTeam] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch current team if the user is already in one
  useEffect(() => {
    async function fetchCurrentTeam() {
      if (profile?.team_id) {
        const { data } = await supabase
          .from('teams')
          .select('*')
          .eq('id', profile.team_id)
          .single();
        if (data) setCurrentTeam(data);
      }
    }
    fetchCurrentTeam();
  }, [profile?.team_id]);

  const handleCreate = async () => {
    if (!teamName.trim()) return setError('Enter a squad name');
    setLoading(true);
    setError('');
    const code = genCode();
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .insert([{ team_name: teamName.trim(), join_code: code }])
      .select().single();

    if (teamErr) { setError(teamErr.message); setLoading(false); return; }

    const { error: linkErr } = await supabase
      .from('participants').update({ team_id: team.id }).eq('id', profile.id);

    if (linkErr) { setError(linkErr.message); setLoading(false); return; }

    setResultTeam(team);
    setLoading(false);
    setMode('created');
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return setError('Enter a join code');
    setLoading(true);
    setError('');
    const { data: team, error: findErr } = await supabase
      .from('teams').select('*').eq('join_code', joinCode.trim().toUpperCase()).maybeSingle();

    if (findErr || !team) { setError('No squad found with that code'); setLoading(false); return; }

    const { error: linkErr } = await supabase
      .from('participants').update({ team_id: team.id }).eq('id', profile.id);

    if (linkErr) { setError(linkErr.message); setLoading(false); return; }

    setResultTeam(team);
    setLoading(false);
    setMode('joined');
  };

  const handleLeave = async () => {
    setLoading(true);
    setError('');
    const { error: leaveErr } = await supabase
      .from('participants')
      .update({ team_id: null })
      .eq('id', profile.id);

    if (leaveErr) {
      setError(leaveErr.message);
      setLoading(false);
      return;
    }

    setCurrentTeam(null);
    setLoading(false);
    onUpdated(); // Refresh parent state
  };

  const copyCode = (codeToCopy) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
          <div className="space-y-4">
            {currentTeam ? (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-5 text-center mb-6">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Currently On</p>
                <p className="text-2xl font-display font-bold text-white mb-4">{currentTeam.team_name}</p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-xs text-gray-400">Code: </span>
                  <button onClick={() => copyCode(currentTeam.join_code)} className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 transition-colors">
                    <span className="text-sm font-mono text-fifa-cyan">{currentTeam.join_code}</span>
                    {copied ? <Check size={14} className="text-fifa-lime" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                </div>

                <button onClick={handleLeave} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                  <LogOut size={16} />
                  {loading ? 'Leaving...' : 'Leave Squad'}
                </button>
              </div>
            ) : (
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
          </div>
        )}

        {mode === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Squad Name</label>
              <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. Byte Strikers"
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none" />
            </div>
            <p className="text-[10px] text-gray-600">A join code gets generated automatically — you'll share it with your 1-2 teammates after this.</p>
            <button onClick={handleCreate} disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors">
              {loading ? 'Creating...' : 'Create Squad'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 text-xs uppercase tracking-widest">Back</button>
          </div>
        )}

        {mode === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Join Code</label>
              <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="e.g. AB12CD"
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm uppercase focus:border-fifa-purple outline-none" />
            </div>
            <p className="text-[10px] text-gray-600">Ask your squad's creator for their code — it's shown on their screen after they create the squad.</p>
            <button onClick={handleJoin} disabled={loading}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-purple transition-colors">
              {loading ? 'Joining...' : 'Join Squad'}
            </button>
            <button onClick={() => setMode('choose')} className="w-full text-gray-500 text-xs uppercase tracking-widest">Back</button>
          </div>
        )}

        {mode === 'created' && resultTeam && (
          <div className="text-center space-y-5">
            <div className="text-4xl">🎉</div>
            <div>
              <p className="text-white font-display font-bold text-lg mb-1">{resultTeam.team_name} is live</p>
              <p className="text-xs text-gray-500">Share this code with 1-2 teammates so they can join you</p>
            </div>
            <button onClick={() => copyCode(resultTeam.join_code)}
              className="w-full bg-fifa-cyan/10 border-2 border-dashed border-fifa-cyan/50 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-fifa-cyan/20 transition-colors">
              <span className="font-display font-black text-2xl text-fifa-cyan tracking-[0.3em]">{resultTeam.join_code}</span>
              {copied ? <Check size={18} className="text-fifa-lime" /> : <Copy size={16} className="text-fifa-cyan" />}
            </button>
            <button onClick={() => { onUpdated(); onClose(); }}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors">
              Done
            </button>
          </div>
        )}

        {mode === 'joined' && resultTeam && (
          <div className="text-center space-y-5">
            <div className="text-4xl">✅</div>
            <div>
              <p className="text-white font-display font-bold text-lg mb-1">You're on {resultTeam.team_name}</p>
              <p className="text-xs text-gray-500">Your points now also count toward this squad's total</p>
            </div>
            <button onClick={() => { onUpdated(); onClose(); }}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}