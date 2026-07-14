import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Calendar, Code, Flame } from 'lucide-react';
import { isRoundUnlocked, unlockTimeLabel } from '../lib/roundSchedule';

const TIMELINE = [
  { date: "July 14", tag: "SF1", title: "Kickoff Trivia", hex: "#E6332A" },
  { date: "July 15", tag: "SF2", title: "Prediction Focus", hex: "#6B2B8E" },
  { date: "July 16", tag: "Gap Day", title: "Transfer Market Algo", hex: "#1E3A8A" },
  { date: "July 17", tag: "Gap Day", title: "VAR Logic Check", hex: "#00B140" },
  { date: "July 18", tag: "3rd Place", title: "Memes & Moments", hex: "#00E5FF" },
  { date: "July 19", tag: "Final", title: "Final Whistle + Build Drop", hex: "#C4D600" },
];

export default function Home({ onPlayToday, onViewBuildSpecs }) {
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="relative mb-10 rounded-3xl overflow-hidden border border-gray-800/60 p-8 md:p-12 bg-gradient-to-br from-[#0f0a14] via-[#0a0a0c] to-[#08080a]"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-20" style={{ background: '#E6332A' }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-[100px] opacity-15" style={{ background: '#00E5FF' }} />

        <div className="relative flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-fifa-lime animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-fifa-lime uppercase">Day 1 of 6 · Live Now</span>
        </div>

        <h1 className="relative font-display font-black text-4xl md:text-6xl uppercase leading-[0.95] text-white mb-4">
          6 days.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fifa-cyan to-fifa-purple">1 leaderboard.</span><br />
          Every department's on the line.
        </h1>

        <p className="relative text-sm md:text-base text-gray-400 max-w-xl mb-6 leading-relaxed">
          No football knowledge needed. No coding background needed. Just show up, rack up points,
          and see if CSE, ECE, EEE, MECH, FOOD_TECH, AGRI, MBA, MCA, CS, AI or CIVIL walks away with the crown when the Final whistle blows.
        </p>

        <div className="relative flex flex-wrap items-center gap-3">
          {isRoundUnlocked(1) ? (
            <button onClick={onPlayToday} className="bg-white text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-fifa-cyan transition-colors">
              Play Today's Round →
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-800 text-gray-500 text-xs font-bold uppercase tracking-widest">
              🔒 Unlocks at {unlockTimeLabel(1)}
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
            <Flame size={14} className="text-fifa-red" /> Kickoff Trivia closes tonight
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#0d0d10] to-[#08080a] border border-gray-800/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#00E5FF' }} />
            <h2 className="flex items-center gap-3 font-display font-bold text-lg uppercase text-white tracking-wide mb-6 relative">
              <Scale className="text-fifa-cyan" size={20} /> How You Win
            </h2>
            <ul className="space-y-5 text-sm text-gray-400 relative">
              {[
                { n: '01', b: 'Everyone has a lane', d: 'Zero football knowledge? Zero coding skills? There\'s a path to points either way — every round has an easy layer.' },
                { n: '02', b: 'The Build Round never stops', d: 'Open Day 1 to Day 6, running quietly in the background. Ship an ML model or a no-code flowchart — both count, code scores higher.' },
                { n: '03', b: 'Your points aren\'t just yours', d: 'Every point feeds your department\'s total. One squad takes the crown.' },
              ].map(r => (
                <li key={r.n} className="flex gap-4">
                  <span className="font-display font-black text-2xl text-fifa-cyan/30 leading-none">{r.n}</span>
                  <p><strong className="text-white block mb-0.5">{r.b}</strong>{r.d}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#12081a] to-[#08080a] border border-fifa-purple/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: '#6B2B8E' }} />
            <h2 className="flex items-center gap-3 font-display font-bold text-lg uppercase text-white tracking-wide mb-4">
              <Shield className="text-fifa-purple" size={20} /> Your Fantasy Anchor
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              You adopted a semifinalist — Argentina, France, Spain, or England. Every real win they get bumps your multiplier.
              Win it all, and you get a baseline injection before the final board locks.
            </p>
            <div className="bg-black/40 border border-fifa-purple/30 rounded-xl p-4 text-xs text-gray-300">
              <span className="text-fifa-purple font-bold uppercase tracking-wide">Right now → </span>
              Your nation is still alive. Check back after tonight's match.
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-[#0a0a0c] border border-gray-800/60 rounded-2xl p-6">
            <h2 className="flex items-center gap-3 font-display font-bold text-base uppercase text-white tracking-wide mb-6">
              <Calendar className="text-fifa-lime" size={18} /> This Week
            </h2>
            <div className="space-y-4">
              {TIMELINE.map((t, i) => (
                <div key={i} className="pl-4 py-1" style={{ borderLeft: `2px solid ${t.hex}` }}>
                  <div className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: t.hex }}>
                    {t.date} ({t.tag})
                  </div>
                  <div className={`text-sm font-medium ${i === TIMELINE.length - 1 ? 'text-white' : 'text-gray-300'}`}>
                    {t.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#12121a] to-[#0a0a0c] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="flex items-center gap-3 font-display font-bold text-base uppercase text-white tracking-wide mb-2">
              <Code className="text-fifa-cyan" size={18} /> Build Round
            </h2>
            <p className="text-xs text-gray-400 mb-4">Six days to ship something. Start whenever, submit by the Final.</p>
            <button onClick={onViewBuildSpecs} className="w-full bg-white text-black text-[10px] font-bold tracking-widest uppercase py-3 rounded-lg hover:bg-fifa-cyan transition-colors">
              View Build Specs
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}