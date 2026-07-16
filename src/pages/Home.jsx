import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Info } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Home({ onPlayToday, onViewBuildSpecs }) {
  const [topDepts, setTopDepts] = useState([]);

  useEffect(() => {
    async function getTopDepts() {
      const { data } = await supabase
        .from('department_leaderboard')
        .select('department, total_dept_score')
        .order('total_dept_score', { ascending: false })
        .limit(3);
      if (data) setTopDepts(data);
    }
    getTopDepts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 px-4 space-y-8">
      {/* HERO SECTION */}
<motion.div 
  initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
  className="relative mb-10 rounded-3xl overflow-hidden border border-gray-800/60 p-8 md:p-16 bg-gradient-to-br from-[#0f0a14] to-[#08080a]"
>
  <h1 className="font-display font-black text-5xl md:text-7xl uppercase leading-[0.9] text-white mb-6">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fifa-cyan to-fifa-purple">ARENA</span> IS OPEN
  </h1>
  <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
    Challenges are live and predictions are open. 
    <br/><br/>
    Please go to the <strong>Arena tab</strong> to participate in challenges and the <strong>Prediction tab</strong> to submit your predictions for the upcoming playoffs.
  </p>
</motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard Preview */}
        <div className="lg:col-span-2 bg-[#0a0a0c] border border-gray-800 rounded-2xl p-6">
          <h2 className="flex items-center gap-2 font-bold uppercase text-white mb-6"><Trophy size={18} className="text-fifa-lime"/> Top Departments</h2>
          {topDepts.map((d, i) => (
            <div key={i} className="flex justify-between p-4 bg-black/40 mb-2 rounded-lg border border-gray-800">
              <span className="font-bold text-white">{d.department}</span>
              <span className="text-fifa-cyan font-bold">{d.total_dept_score} PTS</span>
            </div>
          ))}
        </div>

        {/* Sidebar Rules */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0c] border border-gray-800 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-bold text-white mb-4"><Info size={16}/> How You Win</h3>
            <ul className="text-xs text-gray-400 space-y-3 leading-relaxed">
              <li>• <strong>Lane System:</strong> Paths for coders & non-coders.</li>
              <li>• <strong>Build Round:</strong> Open Day 1–6. Ship an ML model or flowchart.</li>
              <li>• <strong>Dept Points:</strong> Every point fuels the department total.</li>
            </ul>
          </div>
          
          <button onClick={onViewBuildSpecs} className="w-full bg-gray-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800">
            View Build Specs
          </button>
        </div>
      </div>
    </div>
  );
}