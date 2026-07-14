import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Code, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ onOpenRound, onManageSquad }) {
  // 1. Get the current time
  const now = new Date();
  
  // 2. Set your exact kickoff time (Year, Month index (0-11), Day, Hour, Minute)
  // Note: Months are 0-indexed in JS! 6 = July. 
  // Below is set for July 14, 2026, at 18:00 (6:00 PM)
  const kickoffTime = new Date(2026, 6, 14, 18, 0, 0); 

  // 3. If we have passed kickoff time, set day to 1. Otherwise, keep it at 0.
  const currentDay = now >= kickoffTime ? 1 : 0;

  const rounds = [
    { day: 1, title: "Kickoff Trivia", tag: "🟢 Anyone can join", hex: "#E6332A" },
    { day: 2, title: "Prediction (SF2)", tag: "🟢 Anyone can join", hex: "#6B2B8E" },
    { day: 3, title: "Transfer Market", tag: "🟡 Some tech helps", hex: "#1E3A8A" },
    { day: 4, title: "VAR Check", tag: "🟢 Anyone can join", hex: "#00B140" },
    { day: 5, title: "Memes & Moments", tag: "🟢 Anyone can join", hex: "#00E5FF" },
    { day: 6, title: "Final Whistle", tag: "🔴 Build skills help", hex: "#C4D600" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-red uppercase mb-3">The Arena // Daily Drops</p>
        <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white leading-none">Match Days</h1>
      </div>

      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-full bg-gradient-to-r from-[#0d0d10] to-[#08080a] border border-gray-800/60 rounded-xl p-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-fifa-cyan/10 rounded-lg border border-fifa-cyan/30">
            <Code size={16} className="text-fifa-cyan" />
          </div>
          <div>
            <h2 className="font-display text-sm uppercase text-white tracking-widest leading-none mb-1">The Build Round</h2>
            <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Open Day 1–6 · Logic or ML accepted</p>
          </div>
        </div>
        <button onClick={onManageSquad} className="bg-white text-black px-6 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors">
          Manage Squad
        </button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {rounds.map((round) => {
          const isUnlocked = round.day <= currentDay;
          const isActive = round.day === currentDay;
          return (
            <motion.div
              key={round.day}
              onClick={() => isUnlocked && onOpenRound && onOpenRound(round.day)}
              whileHover={isUnlocked ? { y: -4 } : {}}
              style={{
                borderColor: isUnlocked ? `${round.hex}60` : '#1a1a1f',
                background: isUnlocked
                  ? `linear-gradient(135deg, ${round.hex}14 0%, #08080a 75%)`
                  : '#08080a',
                boxShadow: isActive ? `0 0 40px -12px ${round.hex}80` : 'none',
              }}
              className={`relative rounded-2xl p-6 h-36 flex flex-col justify-between cursor-pointer transition-all duration-300 border
                ${!isUnlocked && 'opacity-40 grayscale cursor-not-allowed pointer-events-none'}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-display text-3xl leading-none" style={{ color: isUnlocked ? round.hex : '#374151' }}>
                  0{round.day}
                </span>
                {isUnlocked ? <Unlock size={14} style={{ color: round.hex }} /> : <Lock size={14} className="text-gray-700" />}
              </div>
              <div>
                <h3 className={`font-display text-base uppercase tracking-wide leading-tight mb-1 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                  {round.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-500 font-medium">{isUnlocked ? round.tag : `Unlocks Day ${round.day}`}</span>
                  {isActive && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest animate-pulse"
                      style={{ color: round.hex, backgroundColor: `${round.hex}15` }}>Active</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}