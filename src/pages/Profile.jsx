import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Flag from '../components/Flag';
import { motion } from 'framer-motion';
import { Shield, Hash, Users } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'CSE', label: 'Computer Science (CSE)' },
  { value: 'ECE', label: 'Electronics & Communication (ECE)' },
  { value: 'EEE', label: 'Electrical & Electronics (EEE)' },
  { value: 'MECH', label: 'Mechanical (MECH)' },
  { value: 'CIVIL', label: 'Civil (CIVIL)' },
  { value: 'AI', label: 'AI & Data Science' },
  { value: 'CYBER', label: 'Cyber Security' },
  { value: 'CS', label: 'Computer Science & Business Systems' },
  { value: 'BIOMEDICAL', label: 'Biomedical Engineering' },
  { value: 'FOOD_TECH', label: 'Food Technology' },
  { value: 'AGRI', label: 'Agricultural Engineering' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MCA', label: 'MCA' },
];

export default function Profile({ profile }) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    department: profile?.department || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  });
  
  const [saved, setSaved] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    async function fetchTeamInfo() {
      if (profile?.team_id) {
        // Fetch Team Name
        const { data: team } = await supabase
          .from('teams')
          .select('*')
          .eq('id', profile.team_id)
          .single();
        
        if (team) setTeamData(team);

        // Fetch Teammates
        const { data: members } = await supabase
          .from('participants')
          .select('id, full_name, avatar_url, department')
          .eq('team_id', profile.team_id);
          
        if (members) setTeamMembers(members);
      }
    }
    
    fetchTeamInfo();
  }, [profile?.team_id]);

  const handleUpdate = async () => {
    await supabase.from('participants').update(formData).eq('id', profile.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = formData.full_name
    ? formData.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <div className="max-w-xl mx-auto pb-12">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-green uppercase mb-2">Player Profile</p>
      <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-8">Your Squad Card</h1>

      {/* ID card */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-gray-800/60 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#00B140' }} />
        <div className="flex items-center gap-4 relative">
          {formData.avatar_url ? (
            <img src={formData.avatar_url} alt="avatar" className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-gray-700" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fifa-cyan to-fifa-purple flex items-center justify-center text-black font-display font-black text-xl shrink-0">
              {initials}
            </div>
          )}
          <div>
            <div className="text-white font-display font-bold text-lg leading-tight">{formData.full_name || 'Unnamed Player'}</div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield size={12} /> {formData.department || '—'}</span>
              <span className="flex items-center gap-1"><Hash size={12} /> {profile?.apjaktu_reg_number || '—'}</span>
            </div>
          </div>
          <div className="ml-auto text-3xl"><Flag nation={profile?.adopted_nation} /></div>
        </div>
      </motion.div>

      {/* Editable fields */}
      <div className="bg-[#0a0a0c] border border-gray-800/60 rounded-2xl p-6 md:p-8 mb-6">
        <div className="mb-6">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Display Name</label>
          <input
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Department</label>
          <select
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none appearance-none cursor-pointer"
          >
            {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.value}</option>)}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Avatar Image URL</label>
          <input
            value={formData.avatar_url}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            placeholder="Paste an image link"
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none"
          />
        </div>
        
        <div className="mb-6">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            maxLength={140}
            placeholder="One line about yourself"
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none resize-none"
          />
        </div>
        
        <button
          onClick={handleUpdate}
          className="w-full bg-white text-black py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors"
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Squad Overview Section */}
      {teamData && (
        <div className="bg-[#0a0a0c] border border-gray-800/60 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Users size={16} className="text-fifa-cyan" />
            <h2 className="text-[10px] text-gray-500 uppercase tracking-widest">Active Squad Overview</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1">Squad Name</p>
            <p className="text-xl font-display font-bold text-white">{teamData.team_name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-3">Members ({teamMembers.length}/3)</p>
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.full_name} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                      {member.full_name ? member.full_name.substring(0, 2).toUpperCase() : '??'}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">
                      {member.full_name || 'Unnamed Player'}
                      {member.id === profile.id && <span className="ml-2 text-[10px] font-normal text-fifa-cyan bg-fifa-cyan/10 px-1.5 py-0.5 rounded">You</span>}
                    </p>
                    <p className="text-[10px] text-gray-500">{member.department || 'Unknown Dept'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}