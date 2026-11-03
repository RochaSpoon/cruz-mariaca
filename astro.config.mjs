import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://catholic.cruzmariaca.com',
  output: 'static',
  integrations: [mdx()],
  markdown: { smartypants: true },
});
