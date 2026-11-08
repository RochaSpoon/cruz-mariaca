// Loaded only for visitors who already have a saved session.
import { supabase } from './supabase';
import { applyLang, getLang } from './lang';

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
  const list = document.querySelector('.side-nav');
  if (profile?.is_admin && list && !list.querySelector('[data-admin]')) {
    const a = document.createElement('a');
    a.setAttribute('data-admin', '');
    a.href = '/admin/';
    a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 8h24v5H4zm0 8h24v5H4zm0 8h24v4H4z" fill="currentColor"/></svg><span data-t>Members</span>';
    list.appendChild(a);
    applyLang(getLang());
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
