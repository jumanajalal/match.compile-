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
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">The task</h3>
            <p>Build a simple system that predicts who wins tonight's Final — Argentina vs Spain. That's it. Doesn't need to be fancy.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Don't know how to code this? Vibe-code it.</h3>
            <p className="mb-2">Open Claude (or any AI assistant) and just ask for help directly. Something like:</p>
            <div className="bg-black/40 border border-gray-800 rounded-lg p-3 text-xs text-gray-300 italic">
              "Help me build a simple ML prediction system to predict who wins the World Cup Final between Argentina and Spain, using their past match results and stats."
            </div>
            <p className="mt-2">You don't need to understand every line — describe what you want, iterate on the output, and submit what you end up with.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Still stuck? No-code path is completely fine.</h3>
            <p>Can't get code working at all? Just write up your reasoning — why you think Argentina or Spain wins, based on form, key players, past results, whatever logic you want to use. Take a photo or screenshot of your write-up and submit that image. This is scored too, just weighted a bit lower than a working coded solution.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">Deadline</h3>
            <p>Submit before tonight's Final kicks off — no extensions after that.</p>
          </div>
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">How to submit</h3>
            <p>GitHub repo link, a shared doc, or a photo of your written prediction — whatever fits what you built. Submission form/link goes here — check back or ask an organizer if it's not live yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}