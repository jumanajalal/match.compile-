import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import TriviaRound from './pages/TriviaRound';
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ManageSquadModal from './components/ManageSquadModal';
import BuildSpecsModal from './components/BuildSpecsModal';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showManageSquad, setShowManageSquad] = useState(false);
  const [showBuildSpecs, setShowBuildSpecs] = useState(false);

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

  useEffect(() => { refreshProfile(); }, [session]);

  if (!session) return <Login />;

  return (
    <>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} profile={profile} handleLogout={() => supabase.auth.signOut()}>
        {activeTab === 'home' && (
          <Home
            onPlayToday={() => setActiveTab('trivia')}
            onViewBuildSpecs={() => setShowBuildSpecs(true)}
          />
        )}
        {activeTab === 'arena' && (
          <Dashboard
            onOpenRound={(day) => day === 1 && setActiveTab('trivia')}
            onManageSquad={() => setShowManageSquad(true)}
          />
        )}
        {activeTab === 'trivia' && <TriviaRound profile={profile} />}
        {activeTab === 'predictions' && <Predictions />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'profile' && <Profile profile={profile} />}
      </Layout>

      {showManageSquad && (
        <ManageSquadModal
          profile={profile}
          onClose={() => setShowManageSquad(false)}
          onUpdated={() => { refreshProfile(); setShowManageSquad(false); }}
        />
      )}
      {showBuildSpecs && <BuildSpecsModal onClose={() => setShowBuildSpecs(false)} />}
    </>
  );
}