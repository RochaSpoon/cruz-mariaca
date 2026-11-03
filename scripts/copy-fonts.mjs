// Copies the self-hosted EB Garamond files from the npm package into src/assets/fonts.
import { mkdirSync, copyFileSync } from 'node:fs';
const from = new URL('../node_modules/@fontsource/eb-garamond/files/', import.meta.url);
const to = new URL('../src/assets/fonts/', import.meta.url);
mkdirSync(to, { recursive: true });
for (const f of ['400-normal', '400-italic', '500-normal', '600-normal']) {
  const name = `eb-garamond-latin-${f}.woff2`;
  copyFileSync(new URL(name, from), new URL(name, to));
}
console.log('Fonts copied.');
