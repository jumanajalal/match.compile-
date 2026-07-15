import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Code, CheckCircle2, XCircle } from 'lucide-react';
import { isRoundUnlocked, isRoundClosed, unlockTimeLabel, ROUND_UNLOCK } from '../lib/roundSchedule';

const ROUND_META = {
  1: { title: "Kickoff Trivia", tag: "🟢 Anyone can join", hex: "#E6332A" },
  2: { title: "Puzzle Break", tag: "🟢 Anyone can join", hex: "#1E3A8A" },
  3: { title: "Transfer Market", tag: "🟡 Some tech helps", hex: "#6B2B8E" },
  4: { title: "VAR Check", tag: "🟢 Anyone can join", hex: "#00B140" },
  5: { title: "Memes & Moments", tag: "🟢 Anyone can join", hex: "#00E5FF" },
  6: { title: "Final Whistle", tag: "🔴 Build skills help", hex: "#C4D600" },
};

function closeTimeLabel(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg?.close) return null;
  return new Date(cfg.close).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export default function Dashboard({ onOpenRound, onManageSquad, completedRounds = [] }) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick(t => t + 1), 30000); // re-check unlock/close times every 30s
    return () => clearInterval(id);
  }, []);

  const rounds = Object.entries(ROUND_META).map(([day, meta]) => ({ day: Number(day), ...meta }));

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
          const unlocked = isRoundUnlocked(round.day);
          const closed = isRoundClosed(round.day);
          const isComplete = completedRounds.includes(round.day);
          const clickable = unlocked && !closed;

          return (
            <motion.div
              key={round.day}
              onClick={() => clickable && onOpenRound && onOpenRound(round.day)}
              whileHover={clickable ? { y: -4 } : {}}
              style={{
                borderColor: clickable ? `${round.hex}60` : '#1a1a1f',
                background: clickable ? `linear-gradient(135deg, ${round.hex}14 0%, #08080a 75%)` : '#08080a',
                boxShadow: clickable && !isComplete ? `0 0 40px -12px ${round.hex}80` : 'none',
              }}
              className={`relative rounded-2xl p-6 h-36 flex flex-col justify-between cursor-pointer transition-all duration-300 border
                ${!clickable && 'opacity-40 grayscale cursor-not-allowed pointer-events-none'}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-display text-3xl leading-none" style={{ color: clickable ? round.hex : '#374151' }}>
                  0{round.day}
                </span>
                {closed ? <XCircle size={14} className="text-gray-700" />
                  : isComplete ? <CheckCircle2 size={16} className="text-fifa-lime" />
                  : unlocked ? <Unlock size={14} style={{ color: round.hex }} />
                  : <Lock size={14} className="text-gray-700" />}
              </div>
              <div>
                <h3 className={`font-display text-base uppercase tracking-wide leading-tight mb-1 ${clickable ? 'text-white' : 'text-gray-600'}`}>
                  {round.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-500 font-medium">
                    {closed ? '⏹ Round closed' : isComplete ? '✓ Completed' : unlocked ? round.tag : `Unlocks ${unlockTimeLabel(round.day)}`}
                  </span>
                  {clickable && !isComplete && (
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest animate-pulse"
                      style={{ color: round.hex, backgroundColor: `${round.hex}15` }}>Active</span>
                  )}
                </div>
                {clickable && closeTimeLabel(round.day) && (
                  <p className="text-[8px] text-gray-600 mt-1.5">Closes {closeTimeLabel(round.day)} today</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}