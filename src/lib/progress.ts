// Progress lives in this browser. If someone signs in, completed lessons are also saved to their account.
const KEY = 'cm-progress';
export interface Store { v: 1; done: Record<string, { at: string; xp: number }>; days: string[]; picks: Record<string, string> }

export const isoLocal = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const empty = (): Store => ({ v: 1, done: {}, days: [], picks: {} });

export function load(): Store {
  try { const s = JSON.parse(localStorage.getItem(KEY) ?? 'null'); if (s?.v === 1) return s; } catch {}
  return empty();
}
export function save(s: Store) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }

export const totalXP = (s: Store) => Object.values(s.done).reduce((n, d) => n + d.xp, 0);
export const doneToday = (s: Store) => s.days.includes(isoLocal());

// Consecutive days with a finished lesson, counted back from today, or from yesterday if today is not done yet.
export function streak(s: Store) {
  const set = new Set(s.days); const d = new Date(); let n = 0;
  if (!set.has(isoLocal(d))) d.setDate(d.getDate() - 1);
  while (set.has(isoLocal(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

export function complete(slug: string, xp: number, pick?: string) {
  const s = load(); const today = isoLocal();
  s.done[slug] = { at: new Date().toISOString(), xp: Math.max(xp, s.done[slug]?.xp ?? 0) };
  if (!s.days.includes(today)) s.days.push(today);
  if (pick) s.picks[slug] = pick;
  save(s); void syncUp(slug); return s;
}

async function client() {
  try { if (!localStorage.getItem('cm-auth')) return null; } catch { return null; }
  const { supabase } = await import('./supabase');
  const { data } = await supabase.auth.getSession();
  return data.session ? { supabase, uid: data.session.user.id } : null;
}
export async function syncUp(slug: string) {
  const c = await client(); if (!c) return;
  await c.supabase.from('progress').upsert({ user_id: c.uid, slug: `lesson-${slug}` }, { onConflict: 'user_id,slug', ignoreDuplicates: true });
}
// Lessons finished on another device show up here too.
export async function syncDown() {
  const c = await client(); if (!c) return;
  const { data } = await c.supabase.from('progress').select('slug, read_at').eq('user_id', c.uid).like('slug', 'lesson-%');
  if (!data?.length) return;
  const s = load(); let changed = false;
  for (const r of data) { const slug = r.slug.slice(7); if (!s.done[slug]) { s.done[slug] = { at: r.read_at, xp: 20 }; const day = isoLocal(new Date(r.read_at)); if (!s.days.includes(day)) s.days.push(day); changed = true; } }
  if (changed) save(s);
}
