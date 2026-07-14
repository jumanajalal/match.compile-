// Single source of truth for unlock times — both Home and Dashboard read from this,
// so there's no way for one page to unlock a round the other still shows as locked.
export const ROUND_UNLOCK = {
  1: { unlock: '2026-07-14T18:00:00+05:30', title: 'Kickoff Trivia' },
  2: { unlock: '2026-07-15T09:00:00+05:30', title: 'Prediction (SF2)' },
  3: { unlock: '2026-07-16T09:00:00+05:30', title: 'Transfer Market' },
  4: { unlock: '2026-07-17T09:00:00+05:30', title: 'VAR Check' },
  5: { unlock: '2026-07-18T09:00:00+05:30', title: 'Memes & Moments' },
  6: { unlock: '2026-07-19T09:00:00+05:30', title: 'Final Whistle' },
};

export function isRoundUnlocked(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg) return false;
  return new Date() >= new Date(cfg.unlock);
}

export function unlockTimeLabel(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg) return '';
  return new Date(cfg.unlock).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}