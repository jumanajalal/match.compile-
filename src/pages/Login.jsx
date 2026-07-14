import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [adoptedNation, setAdoptedNation] = useState('Argentina');

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

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (isSignUp) {
      const { data: existingUser } = await supabase
        .from('participants')
        .select('apjaktu_reg_number')
        .eq('apjaktu_reg_number', regNumber.trim())
        .maybeSingle();

      if (existingUser) {
        setErrorMsg('This APJAKTU registration number is already registered.');
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        setErrorMsg(authError.message);
        setLoading(false);
        return;
      }

      if (authData?.user) {
        const { error: profileError } = await supabase.from('participants').insert([{
          id: authData.user.id,
          full_name: fullName,
          apjaktu_reg_number: regNumber.trim(),
          department,
          adopted_nation: adoptedNation,
        }]);
        if (profileError) setErrorMsg(profileError.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorMsg(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-gray-300 flex flex-col font-body">

      {/* HEADER — in normal document flow, not floating */}
      <header className="w-full border-b border-gray-800/50 bg-[#080808]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-black font-display font-bold text-[9px]">
              IEEE
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-sm tracking-widest text-white uppercase">IEEE ICET SB</span>
              <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase mt-0.5">Match.compile()</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase">
            <span className="text-amber-400">July 14 – 19</span>
            <span>2026</span>
          </div>
        </div>
      </header>

      {/* CENTERED LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center relative py-12 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-[#111111] border border-gray-800/80 border-t-amber-500/40 p-8 md:p-10 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10"
        >
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-wide text-white mb-2">
              Match<span className="text-amber-400">.compile()</span>
            </h1>
            <h2 className="font-bold text-[10px] text-gray-400 uppercase tracking-[0.25em]">
              {isSignUp ? 'Create your player profile' : 'Sign in to continue'}
            </h2>
          </div>

          {errorMsg && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 text-xs p-3 rounded-md mb-6 font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-5 overflow-hidden">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Full Name</label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-gray-600" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">APJAKTU Reg Number</label>
                  <input type="text" required value={regNumber} onChange={e => setRegNumber(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all uppercase placeholder-gray-600" placeholder="e.g., KTE22CS001" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Department</label>
                    <select value={department} onChange={e => setDepartment(e.target.value)} className="...">
  {DEPARTMENTS.map(d => <option key={d.value} value={d.value}>{d.value}</option>)}
</select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Adopt a Nation</label>
                    <select value={adoptedNation} onChange={e => setAdoptedNation(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-amber-400 outline-none appearance-none cursor-pointer">
                      <option value="Argentina">🇦🇷 Argentina</option><option value="France">🇫🇷 France</option>
                      <option value="Spain">🇪🇸 Spain</option><option value="England">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all placeholder-gray-600" placeholder="you@domain.com" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">Password</label>
                {!isSignUp && <a href="#" className="text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-amber-400 transition-colors">Forgot?</a>}
              </div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-sm text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 text-black font-bold text-sm py-3.5 rounded-lg uppercase tracking-widest hover:bg-amber-300 transition-colors duration-300 mt-6 flex justify-center items-center gap-2">
              {loading ? <span className="opacity-70 animate-pulse">Processing...</span> : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-800/50">
            <p className="text-xs text-gray-500 font-medium">
              {isSignUp ? 'Already registered?' : "New here?"}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-amber-400 hover:text-amber-300 transition-colors ml-1 font-bold uppercase tracking-wider text-[10px]">
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}