import { STR, type Lang } from './strings';
export type { Lang };
const KEY = 'cm-lang';
export const LANGS: { code: Lang; label: string; name: string; tag: string }[] = [
  { code: 'en', label: 'EN', name: 'English', tag: 'en-US' },
  { code: 'es', label: 'ES', name: 'Español', tag: 'es' },
  { code: 'la', label: 'LA', name: 'Latina', tag: 'la' },
];
export function getLang(): Lang {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'es' || q === 'la') { localStorage.setItem(KEY, q); return q; }
    const v = localStorage.getItem(KEY);
    if (v === 'en' || v === 'es' || v === 'la') return v;
  } catch { /* storage unavailable */ }
  return 'en';
}
export function T(s: string, lang: Lang = getLang()): string {
  if (lang === 'en') return s;
  return STR[s]?.[lang] ?? s;
}
// Text nodes and attributes are marked in English (data-t, data-t-attr). The English is kept in data-en so it can be switched back.
export function applyLang(lang: Lang = getLang(), root: ParentNode = document) {
  document.documentElement.lang = lang;
  root.querySelectorAll<HTMLElement>('[data-t]').forEach((el) => {
    if (!el.dataset.en) el.dataset.en = (el.textContent ?? '').trim();
    el.textContent = T(el.dataset.en, lang);
  });
  root.querySelectorAll<HTMLElement>('[data-t-attr]').forEach((el) => {
    for (const a of (el.dataset.tAttr ?? '').split(',')) {
      const name = a.trim(); if (!name) continue;
      const k = `data-en-${name}`;
      if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(name) ?? '');
      el.setAttribute(name, T(el.getAttribute(k)!, lang));
    }
  });
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
}
export function setLang(lang: Lang) {
  try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  applyLang(lang);
  document.dispatchEvent(new CustomEvent('cm-lang', { detail: lang }));
}
export function dateTag(lang: Lang = getLang()) { return LANGS.find((l) => l.code === lang)?.tag ?? 'en-US'; }
