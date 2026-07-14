import React from 'react';
import { LayoutDashboard, Trophy, MonitorPlay, LogOut, User, Code } from 'lucide-react';
import Flag from './Flag';

export default function Layout({ children, activeTab, setActiveTab, profile, handleLogout }) {
  const navItems = [
    { id: 'home', label: 'Briefing', icon: LayoutDashboard, color: '#00E5FF' },
    { id: 'arena', label: 'Arena', icon: Code, color: '#E6332A' },
    { id: 'predictions', label: 'Predictions', icon: MonitorPlay, color: '#6B2B8E' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: '#C4D600' },
    { id: 'profile', label: 'Profile', icon: User, color: '#00B140' },
  ];

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '??';

  return (
    <div className="flex h-screen w-full bg-[#030304] text-gray-400 font-body overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full blur-[120px] opacity-[0.08]" style={{ background: '#6B2B8E' }} />
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-[0.07]" style={{ background: '#00E5FF' }} />
      </div>

      <aside className="w-64 border-r border-gray-800/40 bg-[#060608]/80 backdrop-blur-xl flex-col justify-between hidden md:flex z-20 relative">
        <div className="p-6">
          <h1 className="font-display font-bold text-base uppercase tracking-widest text-white mb-1">
            Match<span className="text-fifa-cyan">.compile()</span>
          </h1>
          <div className="flex items-center gap-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-fifa-lime animate-pulse" />
            <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Live · Day 1 of 6</span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative"
                  style={{ backgroundColor: isActive ? `${item.color}12` : 'transparent', color: isActive ? item.color : '#6b7280' }}>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r" style={{ background: item.color }} />}
                  <item.icon size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800/40">
          <button onClick={() => setActiveTab('profile')}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#0d0d10] border border-gray-800/60 hover:border-fifa-cyan/40 transition-colors mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fifa-cyan to-fifa-purple flex items-center justify-center text-black font-display font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="text-left overflow-hidden flex-1">
              <div className="text-xs font-bold text-white truncate">{profile?.full_name || 'Player'}</div>
              <div className="text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <span>{profile?.department || '—'}</span>
                <span>·</span>
                <Flag nation={profile?.adopted_nation} className="w-4 h-3" />
              </div>
            </div>
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest text-gray-600 hover:text-fifa-red transition-colors py-2">
            <LogOut size={12} /> Disconnect
          </button>
        </div>
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-10 relative z-10">
        {children}
      </main>
    </div>
  );
}