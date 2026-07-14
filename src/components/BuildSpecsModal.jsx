import React from 'react';
import { X, Code } from 'lucide-react';

export default function BuildSpecsModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d10] border border-gray-800 rounded-2xl p-6 md:p-8 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={18} />
        </button>
        <h2 className="flex items-center gap-2 font-display font-bold text-xl uppercase text-white tracking-wide mb-6">
          <Code size={20} className="text-fifa-cyan" /> Build Round Specs
        </h2>
        <div className="space-y-5 text-sm text-gray-400">
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">What to build</h3>
            <p>Either a match-outcome predictor (basic ML/stats model) or a live scoreboard / stats dashboard app. Solo or squad — squad recommended.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">No-code path</h3>
            <p>Can't code? Submit a manually reasoned prediction with a logic flowchart instead. Scored, just weighted lower than a coded solution.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Timeline</h3>
            <p>Open now (Day 1) through the Final (Day 6). Submit anytime before the deadline — earlier is safer.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">How to submit</h3>
            <p>GitHub repo link or a shared doc/flowchart link. Submission form goes live here once judging criteria are finalized — check back.</p>
          </div>
        </div>
      </div>
    </div>
  );
}