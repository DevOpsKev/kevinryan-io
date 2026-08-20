// Commit provenance, baked at build time. The Dockerfile injects these
// as PUBLIC_* env args before `astro build` (mirroring docs-kevinryan-io),
// so the cover carries the exact commit the site was built from — the
// "commit hash at the top of the page" promise from the preface.
const env = import.meta.env as Record<string, string | undefined>;

export const COMMIT_SHA: string = env.PUBLIC_COMMIT_SHA ?? 'dev';
export const COMMIT_DATE: string = env.PUBLIC_COMMIT_DATE ?? 'dev';
