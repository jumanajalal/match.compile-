export const ROUND_UNLOCK = {
  1: { unlock: '2026-07-14T18:00:00+05:30', close: '2026-07-15T20:00:00+05:30', title: 'Kickoff Trivia' },
  2: { unlock: '2026-07-15T09:00:00+05:30', close: '2026-07-16T20:00:00+05:30', title: 'Puzzle Break' },
  3: { unlock: '2026-07-16T08:00:00+05:30', close: null, title: 'Transfer Market' },
  4: { unlock: '2026-07-17T08:00:00+05:30', close: null, title: 'VAR Check' },
  5: { unlock: '2026-07-18T09:00:00+05:30', close: null, title: 'Memes & Moments' },
  6: { unlock: '2026-07-19T09:00:00+05:30', close: null, title: 'Final Whistle' },
};

export function isRoundUnlocked(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg) return false;
  return new Date() >= new Date(cfg.unlock);
}

export function isRoundClosed(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg?.close) return false;
  return new Date() >= new Date(cfg.close);
}

export function unlockTimeLabel(day) {
  const cfg = ROUND_UNLOCK[day];
  if (!cfg) return '';
  return new Date(cfg.unlock).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}