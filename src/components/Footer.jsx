import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800/50 bg-[#060608] py-6 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-gray-600 uppercase tracking-widest">
        <span>© 2026 IEEE ICET Student Branch</span>
        <div className="flex gap-6">
          <span className="text-gray-500">Match<span className="text-fifa-cyan">.compile()</span></span>
          <span>July 14 – 19</span>
        </div>
      </div>
    </footer>
  );
}