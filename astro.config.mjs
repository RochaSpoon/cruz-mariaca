import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://catholic.cruzmariaca.com',
  output: 'static',
  integrations: [mdx(), sitemap({ filter: (page) => !/\/(admin|account|learn)\//.test(page) })],
  markdown: { smartypants: true },
});
