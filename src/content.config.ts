import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const AUTHORITY = ['dogma', 'definitive', 'authoritative', 'discipline', 'opinion'] as const;

const source = z.object({
  type: z.enum(['scripture', 'ccc', 'council', 'papal', 'father', 'tradition_doc', 'scholarship', 'other']),
  ref: z.string().min(1),
  url: z.string().url().optional(),
  note: z.string().optional(),
  // Set to true only after the primary text has been read and the reference confirmed.
  verified: z.boolean().default(false),
});

// The build fails when sources is empty.
const base = {
  title: z.string().min(1),
  summary: z.string().min(1),
  authority_level: z.enum(AUTHORITY),
  reviewed: z.boolean(),
  sources: z.array(source).min(1, 'sources[] must not be empty'),
};

const myths = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/myths' }),
  schema: z.object({
    ...base,
    claim: z.string().min(1),
    theme: z.string().min(1),
    // Quoted phrases in the body that have been compared with the original text.
    checked_quotes: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  // Site pages explain the site itself. They are not teachings, so a label is optional here.
  schema: z.object({
    ...base,
    authority_level: base.authority_level.optional(),
    // Glossary entries (glossary page only).
    terms: z.array(z.object({ id: z.string(), term: z.string(), definition: z.string(), ccc: z.string().optional() })).optional(),
    // Parts of the Mass (mass page only).
    parts: z.array(z.object({
      title: z.string(), what: z.string(), why: z.string(),
      roots: z.string(), early: z.string().optional(), posture: z.string().optional(),
    })).optional(),
  }),
});

// One reading a day. The text is Douay-Rheims, copied from drbo.org.
const daily = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily' }),
  schema: z.object({
    ...base,
    authority_level: base.authority_level.optional(),
    day: z.number().int().min(1).max(30),
    reading_ref: z.string(),
    reading_text: z.string().min(1),
    reflection: z.string().min(1),
    question: z.string().min(1),
    minutes: z.number(),
    deeper_label: z.string(),
    deeper_href: z.string().url(),
  }),
});

export const collections = { myths, pages, daily };
