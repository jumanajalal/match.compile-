import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import TriviaRound from './pages/TriviaRound';
import PuzzleRound from './pages/PuzzleRound';
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { isRoundUnlocked, unlockTimeLabel } from './lib/roundSchedule';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ManageSquadModal from './components/ManageSquadModal';
import BuildSpecsModal from './components/BuildSpecsModal';
import TransferMarket from './pages/TransferMarket';
import VARRound from './pages/VARRound';
import MomentsRound from './pages/MomentsRound';
import FinalWhistleRound from './pages/FinalWhistleRound';

const ROUND_NAME_MAP = { 1: 'kickoff_trivia', 2: 'puzzle_break', 3: 'transfer_market',  4: 'var_check', 5: 'moments_quiz' , 6: 'final_whistle' };

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showManageSquad, setShowManageSquad] = useState(false);
  const [showBuildSpecs, setShowBuildSpecs] = useState(false);
  const [completedRounds, setCompletedRounds] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = () => {
    if (!session?.user?.id) return;
    supabase.from('participants').select('*').eq('id', session.user.id).single()
      .then(({ data, error }) => { if (!error) setProfile(data); });
  };

  const refreshCompletedRounds = async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase.from('scores').select('round_name').eq('participant_id', session.user.id);
    const done = (data || []).map(r => r.round_name);
    const days = Object.entries(ROUND_NAME_MAP).filter(([, name]) => done.includes(name)).map(([day]) => Number(day));
    setCompletedRounds(days);
  };

  useEffect(() => { refreshProfile(); refreshCompletedRounds(); }, [session]);

  if (!session) return <Login />;

  const handleOpenRound = (day) => {
    if (day === 1) setActiveTab('trivia');
    if (day === 2) setActiveTab('puzzle');
    if (day === 3) setActiveTab('transfer_market');
    if (day === 4) setActiveTab('var');
    if (day === 5) setActiveTab('moments');
    if (day === 6) setActiveTab('final');
    // add more mappings here as Rounds 3-6 go live
  };

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} handleLogout={() => supabase.auth.signOut()}>
        {activeTab === 'home' && <Home onPlayToday={() => setActiveTab('trivia')} onViewBuildSpecs={() => setShowBuildSpecs(true)} />}
        {activeTab === 'arena' && <Dashboard onOpenRound={handleOpenRound} onManageSquad={() => setShowManageSquad(true)} completedRounds={completedRounds} />}

        {activeTab === 'trivia' && (
          isRoundUnlocked(1) ? (
            <TriviaRound profile={profile} onComplete={refreshCompletedRounds} />
          ) : (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
              <p className="text-gray-400 text-sm">Kickoff Trivia unlocks at {unlockTimeLabel(1)} today.</p>
            </div>
          )
        )}

        {activeTab === 'puzzle' && (
          isRoundUnlocked(2) ? (
            <PuzzleRound profile={profile} onComplete={refreshCompletedRounds} />
          ) : (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
              <p className="text-gray-400 text-sm">Puzzle Break unlocks at {unlockTimeLabel(2)} today.</p>
            </div>
          )
        )}

        {activeTab === 'transfer_market' && (
          isRoundUnlocked(3) ? (
            <TransferMarket profile={profile} onComplete={refreshCompletedRounds} />
          ) : (
            <div className="max-w-2xl mx-auto text-center py-20">
              <div className="text-5xl mb-4">🔒</div>
              <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
              <p className="text-gray-400 text-sm">Transfer Market unlocks at {unlockTimeLabel(3)} today.</p>
            </div>
          )
        )}

        {activeTab === 'var' && (
  isRoundUnlocked(4) ? (
    <VARRound profile={profile} onComplete={refreshCompletedRounds} />
  ) : (
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
      <p className="text-gray-400 text-sm">VAR Check unlocks at {unlockTimeLabel(4)} today.</p>
    </div>
  )
)}
        {activeTab === 'moments' && (
  isRoundUnlocked(5) ? (
    <MomentsRound profile={profile} onComplete={refreshCompletedRounds} />
  ) : ( <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
      <p className="text-gray-400 text-sm">Memes & Moments unlocks at {unlockTimeLabel(5)} today.</p>
    </div>
    )
)}
{activeTab === 'final' && (
  isRoundUnlocked(6) ? (
    <FinalWhistleRound profile={profile} onComplete={refreshCompletedRounds} onOpenBuildSpecs={() => setShowBuildSpecs(true)} />
  ) : ( <div className="max-w-2xl mx-auto text-center py-20">
      <div className="text-5xl mb-4">🔒</div>
      <h2 className="font-display font-black text-2xl uppercase text-white mb-2">Not Yet</h2>
      <p className="text-gray-400 text-sm">Final Round unlocks at {unlockTimeLabel(5)} today.</p>
    </div> )
)}

        {activeTab === 'predictions' && <Predictions profile={profile} />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'profile' && <Profile profile={profile} />}
      </Layout>

      {showManageSquad && <ManageSquadModal profile={profile} onClose={() => setShowManageSquad(false)} onUpdated={() => { refreshProfile(); setShowManageSquad(false); }} />}
      {showBuildSpecs && <BuildSpecsModal onClose={() => setShowBuildSpecs(false)} />}
    </>
  );
}