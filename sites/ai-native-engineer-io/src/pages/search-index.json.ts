import type { APIRoute } from 'astro';
import { chapters } from '../lib/chapters';

export const prerender = true;

type Entry = {
  slug: string;
  n: string;
  title: string;
  /** Plain-text body of the chapter, for substring search. */
  text: string;
};

/** Strip markdown and raw HTML down to searchable plain text. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const list = await chapters();
  const index: Entry[] = list
    .filter((c) => c.data.status === 'live' && c.body)
    .map((c) => ({
      slug: c.id,
      n: c.data.n,
      title: c.data.title,
      text: toPlainText(c.body ?? ''),
    }));

  return new Response(JSON.stringify(index), {
    headers: { 'content-type': 'application/json' },
  });
};
