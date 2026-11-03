// Turns lesson specs into full lessons. Bible quotations are copied from drbo.org (Douay-Rheims), never typed.
// Usage: node scripts/write-lessons.mjs scripts/lesson-specs/<unit>.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';
import YAML from 'yaml';

const BOOKS = { Genesis: 1, Exodus: 2, Isaiah: 27, Malachi: 44, Matthew: 47, Mark: 48, Luke: 49, John: 50, Acts: 51, Romans: 52, '1 Corinthians': 53, '2 Corinthians': 54, Galatians: 55, Ephesians: 56, Colossians: 58, '1 Timothy': 61, '2 Timothy': 62, Titus: 63, Hebrews: 65, James: 66, '1 Peter': 67, '1 John': 69, Apocalypse: 73 };
const cache = new URL('../.cache-drbo/', import.meta.url).pathname;
mkdirSync(cache, { recursive: true });

function chapter(book, ch) {
  const id = `${String(BOOKS[book]).padStart(2, '0')}${String(ch).padStart(3, '0')}`;
  const p = `${cache}${id}.html`;
  if (!existsSync(p)) {
    for (let i = 0; i < 25; i++) {
      try { execFileSync('curl', ['-s', '--max-time', '25', '-f', `https://www.drbo.org/chapter/${id}.htm`, '-o', p + '.tmp']); execFileSync('mv', [p + '.tmp', p]); break; }
      catch { execFileSync('sleep', ['6']); }
    }
  }
  const html = readFileSync(p, 'latin1').replace(/<p class=note>[\s\S]*?<\/p>/g, '');
  const verses = {};
  for (const m of html.matchAll(/<a class=vn[^>]*>&nbsp;(\d+)&nbsp;<\/a>([\s\S]*?)(?=<a class=vn|<\/p>)/g)) {
    verses[+m[1]] = m[2].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
  }
  return verses;
}
function quote([book, ch, a, b]) {
  const v = chapter(book, ch);
  const parts = []; for (let n = a; n <= b; n++) { if (!v[n]) throw new Error(`${book} ${ch}:${n} not found`); parts.push(v[n]); }
  const ref = `${book} ${ch}:${a}${b > a ? '-' + b : ''}`;
  return { ref, text: parts.join(' ') };
}

const specFile = process.argv[2];
const specs = (await import(new URL(specFile, 'file://' + process.cwd() + '/').href)).default;
const files = globSync('src/content/lessons/*/*.mdx');
let written = 0;
for (const s of specs) {
  const file = files.find((f) => f.endsWith(`/${s.slug}.mdx`));
  if (!file) throw new Error('no outline for ' + s.slug);
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  const fm = YAML.parse(m[1]);
  const body = [];
  const sec = (t) => body.push(`## ${t}`, '');
  sec('The short version'); body.push(s.short, '');
  sec('What the Church teaches'); for (const p of s.teach) body.push(p, '');
  if (s.verses?.length) {
    sec('Scripture');
    for (const v of s.verses) { const q = quote(v); body.push(`> "${q.text}"`, `*${q.ref} (Douay-Rheims)*`, ''); }
    if (s.scriptureNote) body.push(s.scriptureNote, '');
  }
  if (s.fathers?.length) { sec('The Fathers and saints'); for (const p of s.fathers) body.push(p, ''); }
  sec('Why this matters today'); for (const p of s.today) body.push(p, '');
  sec("What's at stake"); body.push(s.stakes, '');
  sec(s.liveTitle ?? 'How to live it'); for (const l of s.live) body.push(`- ${l}`); body.push('');
  sec('Go deeper'); for (const d of s.deeper) body.push(`- ${d}`); body.push('');
  const text = body.join('\n');
  if (text.includes('—')) throw new Error(s.slug + ': em dash');
  const verify = (text.match(/\[VERIFY/g) ?? []).length;
  const scriptureRefs = (s.verses ?? []).map((v) => quote(v).ref);
  const sources = [...new Set([...(fm.sources ?? []), ...(s.sources ?? []), ...scriptureRefs.map((r) => `${r} (DR)`)])];
  Object.assign(fm, { type: 'full', authority_level: s.level, sources, verify_flags: verify, reviewed: false });
  writeFileSync(file, `---\n${YAML.stringify(fm, { lineWidth: 0 })}---\n\n${text}`);
  written++;
}
console.log(`Wrote ${written} lessons.`);
