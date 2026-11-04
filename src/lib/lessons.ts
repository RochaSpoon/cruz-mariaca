import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';

export type Lesson = CollectionEntry<'lessons'>;

// Units in teaching order. Units with no written lessons yet are not shown on the path.
export const UNITS: { name: string; blurb: string }[] = [
  { name: 'The Creed and Catholic Teaching', blurb: 'What the Church believes about God, Christ, the Church and Mary, and why.' },
  { name: 'The Sacraments and the Mass', blurb: 'What Catholics do, and why: the seven sacraments and the Mass.' },
  { name: 'Prayer and the Spiritual Life', blurb: 'How to pray, and what to do when it feels like nothing is happening.' },
  { name: 'Foundations of Sin and Grace', blurb: 'What sin is, what grace does, and why hope is the point.' },
  { name: 'Virtues', blurb: 'The habits that make a good life possible.' },
  { name: 'The Seven Deadly Sins', blurb: 'Seven habits the tradition names as the roots of the rest.' },
  { name: 'The Tongue', blurb: 'Words, truth, and the harm a sentence can do.' },
  { name: 'Neighbor and Relationships', blurb: 'Parents, grudges and forgiveness.' },
  { name: 'Money and Justice', blurb: 'Work, wages, giving, and what we owe each other.' },
  { name: 'Body and Temperance', blurb: 'Appetite, drink and self-command.' },
  { name: 'Chastity and Sexuality', blurb: 'Desire, the body, and what the Church asks of both.' },
  { name: 'Life and Bioethics', blurb: 'Birth, death, and what the Church says about each.' },
  { name: 'Digital Life', blurb: 'Screens, scrolling and attention.' },
  { name: 'Faith and Worship', blurb: 'What belongs to God, and how to show up at Mass.' },
  { name: 'Catholic Life and Culture', blurb: 'Feasts, saints, the Church year and everyday Catholic life.' },
];

// Lessons on hard subjects get a short note up front, so no one is surprised.
export const HEAVY = new Set(['hell', 'despair-and-hope', 'pornography', 'masturbation', 'abortion', 'euthanasia', 'same-sex-attraction', 'gender-identity', 'contraception', 'fornication-and-cohabitation']);

export interface Unit { key: string; name: string; blurb: string; n: number; lessons: (Lesson & { num: number })[]; coming: Lesson[] }

export async function getUnits(): Promise<Unit[]> {
  const all = await getCollection('lessons');
  let num = 0;
  return UNITS.map((u, i) => {
    const inUnit = all.filter((l) => l.data.category === u.name).sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
    const full = inUnit.filter((l) => l.data.type === 'full').map((l) => Object.assign(l, { num: ++num }));
    return { key: u.name.toLowerCase().replace(/[^a-z]+/g, '-'), name: u.name, blurb: u.blurb, n: i + 1, lessons: full, coming: inUnit.filter((l) => l.data.type === 'outline') };
  }).filter((u) => u.lessons.length > 0).map((u, i) => ({ ...u, n: i + 1 }));
}

export type Card =
  | { kind: 'intro'; title: string; unit: string; minutes: number; heavy: boolean; crisis: boolean; verify: number }
  | { kind: 'big' | 'teach' | 'today' | 'stakes'; label: string; html: string }
  | { kind: 'scripture'; label: string; html: string; cite: string }
  | { kind: 'list'; label: string; items: string[] }
  | { kind: 'actions'; label: string; items: string[] }
  | { kind: 'check'; q: string; hint: string; options: { t: string; ok: boolean }[]; xp: number }
  | { kind: 'sources'; label: string; items: string[] };

const ABBR = /\b(St|Sts|Dr|vs|No|cf|ch|q|a|Mt|Jn|Fr|Bl|Pope|Mrs|Mr)\.\s/g;
// Typeset quotes and apostrophes in text only, never inside tags.
function smart(html: string) {
  return html.split(/(<[^>]+>)/).map((part) => part.startsWith('<') ? part : part.replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/(^|[\s(\[\u2014])"/g, '$1\u201c').replace(/"/g, '\u201d')
    .replace(/(^|[\s(\[\u2014\u201c])'/g, '$1\u2018').replace(/'/g, '\u2019')).join('');
}
const inline = (s: string) => smart((marked.parseInline(s) as string).replace(/\[VERIFY[^\]]*\]/g, '<span class="unchecked">unchecked</span>'));

function chunk(text: string, max = 34): string[] {
  const words = text.split(/\s+/).length;
  if (words <= max + 14) return [text];
  const guarded = text.replace(ABBR, (m) => m.replace(/\s$/, '\u00a0'));
  const sentences = guarded.split(/(?<=[.!?])\s+(?=[A-Z"“(*])/);
  const out: string[] = []; let cur = '';
  for (const s of sentences) {
    if (cur && (cur + ' ' + s).split(/\s+/).length > max) { out.push(cur); cur = s; } else cur = cur ? cur + ' ' + s : s;
  }
  if (cur) out.push(cur);
  return out.map((c) => c.replace(/\u00a0/g, ' '));
}

function sections(body: string) {
  const out: { title: string; md: string }[] = []; let cur: { title: string; md: string } | null = null;
  for (const line of body.split('\n')) {
    const m = line.match(/^## (.+)$/);
    if (m) { cur = { title: m[1].trim(), md: '' }; out.push(cur); } else if (cur) cur.md += line + '\n';
  }
  return out;
}

const kindOf = (t: string) =>
  /short version/i.test(t) ? 'big'
  : /go deeper/i.test(t) ? 'sources'
  : /fight|what to do|how to live|how to keep|the plan|how to forgive|how to respond|practical|how to go|if you.ve fallen|if you.re/i.test(t) ? 'actions'
  : /stake/i.test(t) ? 'stakes'
  : /hits hard|matters today|why this matters|why it matters/i.test(t) ? 'today'
  : /scripture/i.test(t) ? 'scripture' : 'teach';

// Small deterministic shuffle, so a lesson's quick checks are the same on every build.
function rng(seed: string) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => { h += 0x6d2b79f5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function shuffle<T>(a: T[], r: () => number) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

const firstSentence = (md: string) => {
  const t = md.replace(/\s+/g, ' ').trim().replace(ABBR, (m) => m.replace(/\s$/, '\u00a0'));
  return (t.split(/(?<=[.!?])\s/)[0] ?? t).replace(/\u00a0/g, ' ').replace(/[*_]/g, '');
};
const shortOf = (l: Lesson) => firstSentence(sections(l.body ?? '').find((s) => /short version/i.test(s.title))?.md ?? l.data.summary);

export function buildCards(lesson: Lesson, others: Lesson[]): Card[] {
  const d = lesson.data; const body = lesson.body ?? '';
  const secs = sections(body);
  const words = body.split(/\s+/).length;
  const cards: Card[] = [{ kind: 'intro', title: d.title, unit: d.category, minutes: Math.max(2, Math.round(words / 170)), heavy: HEAVY.has(d.slug), crisis: d.slug === 'despair-and-hope', verify: d.verify_flags }];
  const r = rng(d.slug);

  // Quick checks are built only from this site's own lessons, so the right answer is always in the text.
  // Wrong answers never come from the hard-topic lessons, so they cannot turn up where they do not belong.
  const pool = others.filter((o) => o.data.slug !== d.slug && o.data.type === 'full' && !HEAVY.has(o.data.slug));
  const check1: Card = (() => {
    const right = shortOf(lesson);
    const wrong = shuffle(pool, r).slice(0, 2).map((o) => shortOf(o));
    return { kind: 'check', q: 'Which line comes from this lesson?', hint: 'It was near the start of the lesson.', xp: 5, options: shuffle([{ t: right, ok: true }, ...wrong.map((t) => ({ t, ok: false }))], r) };
  })();
  const isCCC = (s: string) => /^CCC/.test(s);
  const wantCCC = d.sources.some(isCCC);
  const own = new Set(d.sources);
  const rightSrc = d.sources.find((s) => (wantCCC ? isCCC(s) : !isCCC(s))) ?? d.sources[0];
  const wrongSrc = shuffle([...new Set(pool.flatMap((o) => o.data.sources).filter((s) => (wantCCC ? isCCC(s) : !isCCC(s)) && !own.has(s)))], r).slice(0, 3);
  const check2: Card = { kind: 'check', q: wantCCC ? 'Which Catechism passage does this lesson cite?' : 'Which source does this lesson cite?', hint: 'You can find the sources at the end of the lesson.', xp: 5, options: shuffle([{ t: rightSrc, ok: true }, ...wrongSrc.map((t) => ({ t, ok: false }))], r) };

  let placed1 = false, placed2 = false;
  for (const s of secs) {
    const kind = kindOf(s.title);
    if (kind === 'actions' && !placed2) { cards.push(check2); placed2 = true; }
    const tokens = marked.lexer(s.md);
    const items: string[] = [];
    for (const t of tokens) {
      if (t.type === 'paragraph') {
        const text = (t as any).text as string;
        for (const c of chunk(text)) cards.push({ kind: (kind === 'sources' ? 'teach' : kind === 'actions' ? 'teach' : kind) as any, label: s.title, html: inline(c) } as Card);
      } else if (t.type === 'blockquote') {
        const inner = ((t as any).raw as string).replace(/^> ?/gm, '').trim().split('\n');
        const last = inner[inner.length - 1];
        const cite = /^\*.+\*$/.test(last) ? last.replace(/^\*|\*$/g, '') : '';
        const quote = (cite ? inner.slice(0, -1) : inner).join(' ').replace(/^"|"$/g, '');
        cards.push({ kind: 'scripture', label: s.title, html: inline(quote), cite });
      } else if (t.type === 'list') {
        for (const it of (t as any).items) items.push(inline(it.text.replace(/\n/g, ' ')));
      }
    }
    if (items.length) {
      if (kind === 'sources') cards.push({ kind: 'sources', label: s.title, items });
      else for (let i = 0; i < items.length; i += 5) cards.push({ kind: kind === 'actions' ? 'actions' : 'list', label: s.title, items: items.slice(i, i + 5) } as Card);
    }
    if (!placed1 && kind === 'teach' && /church teaches|what scripture|history|three different/i.test(s.title)) { cards.push(check1); placed1 = true; }
  }
  if (!placed1) cards.splice(Math.min(3, cards.length), 0, check1);
  if (!placed2) { const at = cards.findIndex((c) => c.kind === 'sources'); cards.splice(at < 0 ? cards.length : at, 0, check2); }
  return cards;
}
