# Cruz-Mariaca

Static Astro site. All content is Markdown/MDX with frontmatter in `src/content/`.

```bash
npm install
npm run dev        # local preview
npm run build      # runs content checks, then builds
```

## Add a myth entry

Create `src/content/myths/your-slug.mdx`. Copy `worship-mary-and-saints.mdx` as a template.

Required frontmatter: `title`, `summary`, `claim`, `theme`, `authority_level`
(`dogma | definitive | authoritative | discipline | opinion`), `reviewed` (`true | false`), and `sources` (at least one).
Each source is `{ type, ref, url?, note?, verified }`. Leave `verified: false` until you have read the original text.

The body has exactly these seven `##` headings, in this order (the eighth section, Sources, is built from frontmatter):
The claim, Why people believe it, What the Church teaches, Scripture, Magisterium, Historical record, The strongest remaining objection.

Components available in the body: `<Teaching level="dogma" refs="...">`, `<Scripture cite="Luke 1:48">` (Douay-Rheims only; add `checked` once compared with a source).

If you cannot verify something, write `[NEEDS SOURCE]` in place. It will appear in `REVIEW.md`.

## What fails the build

Empty `sources`, a missing required field, an em dash, a banned word, wrong myth headings, or `reviewed: true` while
unchecked sources, unchecked Scripture quotes or `[NEEDS SOURCE]` markers remain. `REVIEW.md` is regenerated on every build.

Timeline events and daily readings arrive in later phases and will be documented here.

## Other content you can edit

- **Daily Bread:** `src/content/daily/day-NN.md`, 30 files. The Bible text in `reading_text` is Douay-Rheims copied from drbo.org. The thought and question are written for the site. The cycle starts on the date set in `src/lib/daily.ts`.
- **The Mass:** the steps are the `parts:` list in `src/content/pages/mass.mdx`.
- **Glossary:** the terms are the `terms:` list in `src/content/pages/glossary.mdx`. Use one in an entry with `<Term id="infallibility">infallibility</Term>`.
- **Start Here paths:** `src/lib/paths.ts`.

## Accounts and the members page

Accounts use Supabase Auth, with a sign-up Edge Function named `signup` and two tables, `profiles` and `progress`, protected by row-level security. The members page at `/admin/` is gated by an `is_admin` flag in `profiles`, set in the Supabase dashboard. Passwords are reset in the dashboard under Authentication.

Copy `.env.example` to `.env` and fill in the two public Supabase values to run the site locally with accounts.

## Deploying

The site deploys to Vercel. Once this repository is linked to the Vercel project, every push to `main` deploys to production and every other branch gets a preview. The Vercel project needs these environment variables: `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Lessons and the path

The home page is a lesson path. Lessons live in `src/content/lessons/<category>/<slug>.mdx` (imported from the Catholic Lessons Library; its own README and review notes are in `docs/lessons-library/`).

- `type: full` lessons are playable. They are split into one-idea screens at build time by `src/lib/lessons.ts`, using the `##` headings as section labels.
- `type: outline` lessons are placeholders. They are never playable. They show under their unit as "being written".
- To publish a new lesson, write the full text (copy any full lesson), set `type: full`, and remove every `[TO WRITE]`. The build fails if a full lesson still has one.
- Units are the categories listed in `UNITS` in `src/lib/lessons.ts`. A unit shows on the path once it has one full lesson.
- Hard-topic lessons get a note on the first screen. Add a slug to `HEAVY` in the same file to give another lesson one.
- Quick checks are generated from the site's own lessons, so the right answer is always in the text. Wrong answers are never taken from hard-topic lessons.
- Progress (XP, streak, finished lessons) is kept in the browser. Signed-in members also save finished lessons to their account as `lesson-<slug>`, and the members page shows them.
