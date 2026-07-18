import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Flag as FlagIcon, ThumbsUp } from 'lucide-react';
import Flag from '../components/Flag';

const QUIZ = [
  { q: "Who scored Argentina's dramatic stoppage-time winner against England?", options: ["Julián Álvarez", "Lautaro Martínez", "Enzo Fernández", "Ángel Di María"], answer: 1 },
  { q: "What was the final score in the Spain vs France semifinal?", options: ["1-0 France", "2-0 Spain", "2-1 Argentina", "3-1 Spain"], answer: 1 },
  { q: "Who set up both of Argentina's goals in their comeback against England?", options: ["Lionel Messi", "Julián Álvarez", "Rodrigo De Paul", "Nicolás Otamendi"], answer: 0 },
  { q: "Who scored England's opening goal in the semifinal?", options: ["Harry Kane", "Anthony Gordon", "Jude Bellingham", "Marcus Rashford"], answer: 1 },
  { q: "Who scored Argentina's 85th-minute equalizer with a strike from distance?", options: ["Enzo Fernández", "Lautaro Martínez", "Julián Álvarez", "Alexis Mac Allister"], answer: 0 },
  { q: "Which two teams meet in the World Cup Final on July 19?", options: ["France vs England", "Argentina vs Spain", "Spain vs England", "Argentina vs France"], answer: 1 },
];

const POINTS_PER_CORRECT = 15; // 6 × 15 = 90 max

function QuizPart({ profile, onDone }) {
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState(Array(QUIZ.length).fill(null));
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function init() {
      let { data: existing } = await supabase
        .from('quiz_attempts').select('*')
        .eq('participant_id', profile.id).eq('round_name', 'moments_quiz').maybeSingle();

      if (!existing) {
        const { data: created, error } = await supabase
          .from('quiz_attempts')
          .insert([{ participant_id: profile.id, round_name: 'moments_quiz', question_set: QUIZ }])
          .select().single();
        if (error) {
          const { data: retry } = await supabase
            .from('quiz_attempts').select('*')
            .eq('participant_id', profile.id).eq('round_name', 'moments_quiz').maybeSingle();
          existing = retry;
        } else {
          existing = created;
        }
      }
      setAttempt(existing);
      if (existing?.submitted_at) setResult({ score: existing.score_value });
      setLoading(false);
    }
    if (profile?.id) init();
  }, [profile]);

  async function handleSubmit() {
    const correct = answers.filter((a, i) => a === QUIZ[i].answer).length;
    const points = correct * POINTS_PER_CORRECT;

    await supabase.from('quiz_attempts').update({
      submitted_at: new Date().toISOString(),
      score_value: points,
    }).eq('id', attempt.id);

    await supabase.from('scores').upsert(
      [{
        participant_id: profile.id,
        team_id: profile.team_id || null,
        round_name: 'moments_quiz',
        score_value: points,
      }],
      { onConflict: 'participant_id,round_name', ignoreDuplicates: true }
    );

    setResult({ score: points });
    onDone && onDone();
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>;

  if (result) {
    return (
      <div className="bg-[#08080a] border border-gray-800 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🏆</div>
        <p className="text-white font-display font-bold text-lg mb-1">Quiz done — {result.score} points</p>
        <p className="text-xs text-gray-500">Scroll down to check out (and vote on) the memes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {QUIZ.map((item, qi) => (
        <div key={qi} className="bg-[#0a0a0c] border border-gray-800/60 rounded-xl p-5">
          <p className="text-white text-sm font-medium mb-4">{qi + 1}. {item.q}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {item.options.map((opt, oi) => (
              <button key={oi} onClick={() => setAnswers(a => a.map((v, i) => i === qi ? oi : v))}
                className={`text-left text-xs px-4 py-2.5 rounded-lg border transition-all ${
                  answers[qi] === oi ? 'bg-fifa-cyan/15 border-fifa-cyan text-white' : 'bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600'
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} disabled={answers.includes(null)}
        className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-fifa-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Submit Quiz
      </button>
    </div>
  );
}

const MEME_PARTICIPATION_POINTS = 10;

function MemesPart({ profile }) {
  const [memes, setMemes] = useState([]);
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alreadyPosted, setAlreadyPosted] = useState(false);
  const [myVotes, setMyVotes] = useState(new Set());
  const [myReports, setMyReports] = useState(new Set());
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data: allMemes } = await supabase
      .from('memes').select('id, caption, image_url, created_at, participant_id, participants(full_name)')
      .order('created_at', { ascending: false });

    const { data: voteCounts } = await supabase.from('meme_votes').select('meme_id');
    const counts = {};
    (voteCounts || []).forEach(v => { counts[v.meme_id] = (counts[v.meme_id] || 0) + 1; });

    const { data: reportRows } = await supabase.from('meme_reports').select('meme_id');
    const reportCounts = {};
    (reportRows || []).forEach(r => { reportCounts[r.meme_id] = (reportCounts[r.meme_id] || 0) + 1; });

    const { data: mine } = await supabase.from('meme_votes').select('meme_id').eq('participant_id', profile.id);
    setMyVotes(new Set((mine || []).map(v => v.meme_id)));

    const { data: myReportRows } = await supabase.from('meme_reports').select('meme_id').eq('participant_id', profile.id);
    setMyReports(new Set((myReportRows || []).map(r => r.meme_id)));

    const merged = (allMemes || [])
      .filter(m => (reportCounts[m.id] || 0) < 2) // hidden once 2+ distinct people report it
      .map(m => ({ ...m, votes: counts[m.id] || 0 }))
      .sort((a, b) => b.votes - a.votes);

    setMemes(merged);
    setAlreadyPosted((allMemes || []).some(m => m.participant_id === profile.id));
    setLoading(false);
  }

  useEffect(() => { if (profile?.id) load(); }, [profile]);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setImageUrl('');
  }

  async function handlePost() {
    if (!caption.trim()) return;
    setUploading(true);
    let finalImageUrl = imageUrl.trim() || null;

    if (file) {
      const ext = file.name.split('.').pop();
      const path = `${profile.id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('memes').upload(path, file);
      if (uploadError) {
        alert('Image upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('memes').getPublicUrl(path);
      finalImageUrl = publicUrlData.publicUrl;
    }

    await supabase.from('memes').insert([{
      participant_id: profile.id,
      caption: caption.trim(),
      image_url: finalImageUrl,
    }]);
    await supabase.from('scores').upsert(
      [{ participant_id: profile.id, team_id: profile.team_id || null, round_name: 'meme_post', score_value: MEME_PARTICIPATION_POINTS }],
      { onConflict: 'participant_id,round_name', ignoreDuplicates: true }
    );

    setCaption(''); setImageUrl(''); setFile(null); setPreview(null);
    setUploading(false);
    load();
  }

  async function toggleVote(memeId) {
    if (myVotes.has(memeId)) {
      await supabase.from('meme_votes').delete().eq('meme_id', memeId).eq('participant_id', profile.id);
    } else {
      await supabase.from('meme_votes').insert([{ meme_id: memeId, participant_id: profile.id }]);
    }
    load();
  }

  async function reportMeme(memeId) {
    if (myReports.has(memeId)) return;
    await supabase.from('meme_reports').insert([{ meme_id: memeId, participant_id: profile.id }]);
    load();
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading memes...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#0a0a0c] border border-gray-800/60 rounded-xl p-5">
        <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-3">
          Keep it about the plays and reactions — nothing about players' personal lives, nationality, injuries, or mocking a team. One meme per person.
        </p>
        {alreadyPosted ? (
          <p className="text-xs text-fifa-lime">✓ You've already posted your meme for this round.</p>
        ) : (
          <div className="space-y-3">
            <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={2} maxLength={200}
              placeholder="Caption your meme (e.g. Lautaro's 92nd-minute winner, Messi's double assist, Spain's 2-0...)"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none resize-none" />

            <div>
              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1.5">Upload an image</label>
              <input type="file" accept="image/*" onChange={handleFileChange}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-fifa-cyan/10 file:text-fifa-cyan file:text-[10px] file:font-bold file:uppercase file:tracking-widest" />
              {preview && <img src={preview} alt="preview" className="mt-2 max-h-40 rounded-lg" />}
            </div>

            <p className="text-[9px] text-gray-600 text-center">— or —</p>
            <input value={imageUrl} onChange={e => { setImageUrl(e.target.value); setFile(null); setPreview(null); }}
              placeholder="Paste an image link instead"
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white text-sm focus:border-fifa-cyan outline-none" />

            <button onClick={handlePost} disabled={!caption.trim() || uploading}
              className="w-full bg-white text-black py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-fifa-cyan transition-colors disabled:opacity-40">
              {uploading ? 'Posting...' : `Post Meme (+${MEME_PARTICIPATION_POINTS} pts)`}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Gallery — top voted first</p>
        {memes.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-8">No memes yet — be the first.</p>
        ) : memes.map(m => (
          <div key={m.id} className="bg-[#08080a] border border-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] text-gray-500">{m.participants?.full_name || 'Anonymous'}</p>
              <button onClick={() => reportMeme(m.id)} disabled={myReports.has(m.id)}
                className={`${myReports.has(m.id) ? 'text-fifa-red' : 'text-gray-700 hover:text-fifa-red'}`}
                title={myReports.has(m.id) ? 'Reported' : 'Report'}>
                <FlagIcon size={12} />
              </button>
            </div>
            {m.image_url && <img src={m.image_url} alt="meme" className="w-full rounded-lg mb-2 max-h-64 object-cover" />}
            <p className="text-white text-sm mb-3">{m.caption}</p>
            <button onClick={() => toggleVote(m.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                myVotes.has(m.id) ? 'bg-fifa-cyan/15 text-fifa-cyan' : 'bg-gray-900 text-gray-500 hover:text-gray-300'
              }`}>
              <ThumbsUp size={12} /> {m.votes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MomentsRound({ profile }) {
  const [tab, setTab] = useState('quiz');

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-[10px] font-bold tracking-[0.3em] text-fifa-cyan uppercase mb-2">Round 05 // Moments & Memes</p>
      <h1 className="font-display font-black text-3xl uppercase tracking-wide text-white mb-2">Relive the Semis</h1>
      <p className="text-xs text-gray-500 mb-6">
        Argentina beat England 2-1 in stoppage time. Spain beat France 2-0. Final: Argentina vs Spain, July 19.
      </p>

      <div className="flex gap-2 mb-6 bg-[#0a0a0c] p-1.5 rounded-xl border border-gray-800 w-fit">
        {['quiz', 'memes'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              tab === t ? 'bg-fifa-cyan/15 text-fifa-cyan' : 'text-gray-500 hover:text-gray-300'
            }`}>
            {t === 'quiz' ? 'Spot the Moment' : 'Meme It'}
          </button>
        ))}
      </div>

      {tab === 'quiz' ? <QuizPart profile={profile} onDone={() => setTab('memes')} /> : <MemesPart profile={profile} />}
    </div>
  );
}