// Lists which lessons exist in which language, so the path can link to the right page.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const out = {};
const titles = { es: {}, la: {} };
for (const lang of ['es', 'la']) {
  const dir = `src/content/lessons-${lang}`;
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.mdx')); } catch { /* no folder */ }
  for (const f of files) {
    const slug = f.replace(/\.mdx$/, '');
    (out[slug] ??= []).push(lang);
    const m = readFileSync(`${dir}/${f}`, 'utf8').match(/^title: (.+)$/m);
    if (m) titles[lang][slug] = m[1].replace(/^['"]|['"]$/g, '');
  }
}
writeFileSync('src/data/translated.json', JSON.stringify(out, null, 1) + '\n');
console.log(`Translated index: ${Object.keys(out).length} lessons.`);
writeFileSync('src/data/titles.es.json', JSON.stringify(titles.es, null, 1) + '\n');
writeFileSync('src/data/titles.la.json', JSON.stringify(titles.la, null, 1) + '\n');
