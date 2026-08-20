import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A chapter is one markdown file. The frontmatter is the contract the
// layout reads: the status pill (B20 — exactly three), the reading
// time, and — for chapters not yet written — the outline that fills
// the empty state (B19 — the only dashed border in the system).
//
// Per THEME-SPEC O4: chapter status lives in the content frontmatter,
// not a separate manifest, so a chapter remains one file.
const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    n: z.string(),
    title: z.string(),
    status: z.enum(['live', 'draft', 'plan']),
    mins: z.number().int().positive(),
    outline: z.array(z.string()).default([]),
  }),
});

export const collections = { chapters };
