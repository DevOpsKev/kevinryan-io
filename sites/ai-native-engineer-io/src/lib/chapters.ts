import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

/** All chapters, ordered by their frontmatter number (00 → 12). */
export async function chapters(): Promise<Chapter[]> {
  return (await getCollection('chapters')).sort((a, b) =>
    a.data.n.localeCompare(b.data.n),
  );
}

export type ChapterStatus = 'live' | 'draft' | 'plan';

export const STATUS_LABEL: Record<ChapterStatus, string> = {
  live: 'Published',
  draft: 'Drafting',
  plan: 'Outlined',
};

/** Index of the chapter with the given collection id, or undefined. */
export function findChapter(list: Chapter[], slug: string): Chapter | undefined {
  return list.find((c) => c.id === slug);
}

/** Slugs for the chapters neighbouring the given one, for the pager. */
export function neighbours(
  list: Chapter[],
  slug: string,
): { prev?: Chapter; next?: Chapter } {
  const i = list.findIndex((c) => c.id === slug);
  if (i === -1) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}
