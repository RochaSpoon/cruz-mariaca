# Catholic Lessons Library

Lesson content for the inquirer site. Every file is MDX with YAML frontmatter, matching the content schema from the build prompt (title, summary, sources[], authority_level, reviewed).

## What's here

- `lessons/<category>/<slug>.mdx`: one file per lesson
  - `type: full`: written in depth (Church teaching, Scripture, Fathers and saints, today, what's at stake, how to fight it)
  - `type: outline`: title, summary, and key sources, with `[TO WRITE]` placeholders for each section
- `catalog.json`: every lesson in one file, for search, menus, and the Start Here quiz
- `image-credits.csv`: artwork for each full lesson with a Wikimedia Commons search link
- `REVIEW.md`: quotes and statistics to check against the primary source before publishing

## Importing into Astro

1. Copy `lessons/` into `src/content/lessons/`.
2. Add a content collection in `src/content/config.ts`. `sources` should be `z.array(z.string()).min(1)` so the build fails if a lesson has no sources.
3. Render `image.credit` under every image. Fill in `image.file_url` once you've picked a file on Commons.
4. Filter out `reviewed: false` lessons in production until a priest or catechist signs off.

## Writing outline lessons

Copy the structure of any `type: full` lesson. Rules:
- Every quote needs author, work, and section number. If you can't find the primary source, don't use the quote.
- Scripture from the Douay-Rheims (public domain), or link to bible.usccb.org.
- Mark anything uncertain with `[VERIFY]` so it shows up in review.
- No em dashes.
