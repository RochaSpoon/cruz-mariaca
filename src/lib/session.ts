// Loaded only for visitors who already have a saved session.
import { supabase } from './supabase';

export async function currentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function myProfile(userId: string) {
  const { data } = await supabase.from('profiles').select('username, full_name, is_admin').eq('id', userId).maybeSingle();
  return data;
}

// Runs on every page for signed-in members.
export async function init() {
  const session = await currentSession();
  if (!session) return;
  const profile = await myProfile(session.user.id);
  const list = document.querySelector('#nav-list');
  if (profile?.is_admin && list && !list.querySelector('[data-admin]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a data-admin href="/admin/">Members</a>';
    list.appendChild(li);
  }
  // Record a visit at most once an hour.
  try {
    const last = Number(localStorage.getItem('cm-seen') ?? 0);
    if (Date.now() - last > 3600_000) {
      await supabase.rpc('touch_seen');
      localStorage.setItem('cm-seen', String(Date.now()));
    }
  } catch { /* storage unavailable: skip */ }
}
