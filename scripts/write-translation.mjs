// Writes translated lessons from a spec. Scripture is copied from drbo.org in the Latin Vulgate (Clementine), never typed.
// Usage: node scripts/write-translation.mjs es|la scripts/lesson-specs/<file>.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { globSync } from 'node:fs';
import YAML from 'yaml';

const lang = process.argv[2];
const HEAD = {
  es: { short: 'Lo esencial', teach: 'Lo que enseña la Iglesia', scripture: 'La Escritura', fathers: 'Los Padres y los santos', today: 'Por qué importa hoy', stake: 'Qué está en juego', live: 'Cómo vivirlo', deeper: 'Para profundizar', vg: 'Vulgata Clementina, en latín' },
  la: { short: 'Summa brevis', teach: 'Quid Ecclesia doceat', scripture: 'Scriptura', fathers: 'Patres et sancti', today: 'Cur hodie momentum habeat', stake: 'Quid in discrimine sit', live: 'Quomodo vivatur', deeper: 'Altius penetra', vg: 'Vulgata Clementina' },
}[lang];
if (!HEAD) throw new Error('language must be es or la');
const BOOKS = { 'Genesis': 1, 'Exodus': 2, 'Leviticus': 3, 'Numbers': 4, 'Deuteronomy': 5, 'Josue': 6, 'Judges': 7, 'Ruth': 8, '1 Kings': 9, '2 Kings': 10, '3 Kings': 11, '4 Kings': 12, 'Tobias': 17, 'Judith': 18, 'Esther': 19, 'Job': 20, 'Psalms': 21, 'Proverbs': 22, 'Ecclesiastes': 23, 'Canticle of Canticles': 24, 'Wisdom': 25, 'Ecclesiasticus': 26, 'Isaiah': 27, 'Jeremias': 28, 'Daniel': 32, 'Malachias': 44, 'Matthew': 47, 'Mark': 48, 'Luke': 49, 'John': 50, 'Acts': 51, 'Romans': 52, '1 Corinthians': 53, '2 Corinthians': 54, 'Galatians': 55, 'Ephesians': 56, 'Philippians': 57, 'Colossians': 58, '1 Thessalonians': 59, '2 Thessalonians': 60, '1 Timothy': 61, '2 Timothy': 62, 'Titus': 63, 'Philemon': 64, 'Hebrews': 65, 'James': 66, '1 Peter': 67, '2 Peter': 68, '1 John': 69, 'Jude': 72, 'Apocalypse': 73 };
const NAMES = {
  es: { 'Genesis': 'Génesis', 'Exodus': 'Éxodo', 'Psalms': 'Salmos', 'Proverbs': 'Proverbios', 'Wisdom': 'Sabiduría', 'Isaiah': 'Isaías', 'Matthew': 'Mateo', 'Mark': 'Marcos', 'Luke': 'Lucas', 'John': 'Juan', 'Acts': 'Hechos', 'Romans': 'Romanos', '1 Corinthians': '1 Corintios', '2 Corinthians': '2 Corintios', 'Galatians': 'Gálatas', 'Ephesians': 'Efesios', 'Philippians': 'Filipenses', 'Colossians': 'Colosenses', 'Hebrews': 'Hebreos', 'James': 'Santiago', '1 Peter': '1 Pedro', '1 John': '1 Juan', 'Apocalypse': 'Apocalipsis', 'Ecclesiastes': 'Eclesiastés', 'Ecclesiasticus': 'Eclesiástico', 'Malachias': 'Malaquías', 'Deuteronomy': 'Deuteronomio', 'Numbers': 'Números', '1 Timothy': '1 Timoteo', '2 Timothy': '2 Timoteo', '1 Thessalonians': '1 Tesalonicenses', 'Job': 'Job', 'Daniel': 'Daniel', 'Ruth': 'Rut', 'Titus': 'Tito', 'Jude': 'Judas', 'Leviticus': 'Levítico', '1 Kings': '1 Samuel', '2 Kings': '2 Samuel', '3 Kings': '1 Reyes', '4 Kings': '2 Reyes', 'Jeremias': 'Jeremías', 'Canticle of Canticles': 'Cantar de los Cantares', 'Tobias': 'Tobías' },
  la: { 'Genesis': 'Genesis', 'Exodus': 'Exodus', 'Psalms': 'Psalmi', 'Proverbs': 'Proverbia', 'Wisdom': 'Sapientia', 'Isaiah': 'Isaias', 'Matthew': 'Matthaeus', 'Mark': 'Marcus', 'Luke': 'Lucas', 'John': 'Ioannes', 'Acts': 'Actus', 'Romans': 'Ad Romanos', '1 Corinthians': '1 ad Corinthios', '2 Corinthians': '2 ad Corinthios', 'Galatians': 'Ad Galatas', 'Ephesians': 'Ad Ephesios', 'Philippians': 'Ad Philippenses', 'Colossians': 'Ad Colossenses', 'Hebrews': 'Ad Hebraeos', 'James': 'Iacobus', '1 Peter': '1 Petri', '1 John': '1 Ioannis', 'Apocalypse': 'Apocalypsis', 'Ecclesiastes': 'Ecclesiastes', 'Ecclesiasticus': 'Ecclesiasticus', 'Deuteronomy': 'Deuteronomium', 'Job': 'Iob', 'Daniel': 'Daniel', 'Ruth': 'Ruth', 'Leviticus': 'Leviticus', 'Numbers': 'Numeri', 'Canticle of Canticles': 'Canticum Canticorum', 'Tobias': 'Tobias', 'Malachias': 'Malachias', 'Jeremias': 'Hieremias', '1 Timothy': '1 ad Timotheum', '2 Timothy': '2 ad Timotheum', '1 Thessalonians': '1 ad Thessalonicenses' },
}[lang];
const cache = new URL('../.cache-drbo/', import.meta.url).pathname;
mkdirSync(cache, { recursive: true });

function chapter(book, ch) {
  const id = `${String(BOOKS[book]).padStart(2, '0')}${String(ch).padStart(3, '0')}`;
  const p = `${cache}lvb-${id}.html`;
  if (!existsSync(p)) {
    for (let i = 0; i < 25; i++) {
      try { execFileSync('curl', ['-s', '--max-time', '25', '-f', `https://www.drbo.org/lvb/chapter/${id}.htm`, '-o', p + '.tmp']); execFileSync('mv', [p + '.tmp', p]); break; }
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
  return { ref: `${NAMES[book] ?? book} ${ch}:${a}${b > a ? '-' + b : ''}`, text: parts.join(' ') };
}

const specs = (await import(new URL(process.argv[3], 'file://' + process.cwd() + '/').href)).default;
const en = globSync('src/content/lessons/*/*.mdx');
const outDir = `src/content/lessons-${lang}`;
mkdirSync(outDir, { recursive: true });
let written = 0;
for (const s of specs) {
  const base = en.find((f) => f.endsWith(`/${s.slug}.mdx`));
  if (!base) throw new Error('no English lesson for ' + s.slug);
  const fm = YAML.parse(readFileSync(base, 'utf8').match(/^---\n([\s\S]*?)\n---\n/)[1]);
  const body = [];
  const sec = (t) => body.push(`## ${t}`, '');
  sec(HEAD.short); body.push(s.short, '');
  sec(HEAD.teach); for (const p of s.teach) body.push(p, '');
  if (s.verses?.length) {
    sec(HEAD.scripture);
    for (const v of s.verses) { const q = quote(v); body.push(`> "${q.text}"`, `*${q.ref} (${HEAD.vg})*`, ''); }
    if (s.scriptureNote) body.push(s.scriptureNote, '');
  }
  if (s.fathers?.length) { sec(HEAD.fathers); for (const p of s.fathers) body.push(p, ''); }
  sec(HEAD.today); for (const p of s.today) body.push(p, '');
  sec(HEAD.stake); body.push(s.stakes, '');
  sec(s.liveTitle ?? HEAD.live); for (const l of s.live) body.push(`- ${l}`); body.push('');
  sec(HEAD.deeper); for (const d of s.deeper) body.push(`- ${d}`); body.push('');
  const text = body.join('\n');
  if (text.includes('—')) throw new Error(s.slug + ': em dash');
  const out = { ...fm, title: s.title, summary: s.summary, category: s.category ?? fm.category, sources: [...new Set([...(fm.sources ?? []), ...(s.sources ?? [])])] };
  out.verify_flags = 0; out.reviewed = false; out.type = 'full';
  writeFileSync(`${outDir}/${s.slug}.mdx`, `---\n${YAML.stringify(out, { lineWidth: 0 })}---\n\n${text}`);
  written++;
}
console.log(`Wrote ${written} ${lang} lessons.`);
