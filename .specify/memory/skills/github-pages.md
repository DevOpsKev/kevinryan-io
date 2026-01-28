# Skill: GitHub Pages Deployment

> Applies to: CI/CD and deployment workflows

## Deployment Model

```
Push to main → GitHub Actions → Build static site → Deploy to GitHub Pages
```

No manual deployment steps. Every merge to `main` triggers production deployment.

## Workflow Location

```
.github/workflows/nextjs.yml
```

## Build Requirements

Before any code merges to `main`:

```bash
pnpm build    # Must complete without errors
pnpm lint     # Must pass with zero warnings
```

The GitHub Actions workflow enforces these gates automatically.

## Static Export Verification

The build produces a static `out/` directory:

```
out/
├── index.html
├── _next/
│   └── static/
│       ├── chunks/
│       └── css/
├── 404.html
└── [other pages].html
```

Verify locally before pushing:

```bash
pnpm build
npx serve out    # Test the static output
```

## GitHub Pages Configuration

### Repository Settings
- Source: GitHub Actions
- Custom domain: (if configured in repo settings)

### Required Workflow Permissions
- `pages: write`
- `id-token: write`

## Workflow Structure

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:  # Manual trigger option

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Common Issues

### Build Fails: Image Optimization
```
Error: Image Optimization using Next.js default loader is not compatible with `output: export`
```

**Fix:** Ensure `next.config.ts` has:
```ts
images: {
  unoptimized: true,
}
```

### Build Fails: Dynamic Routes
```
Error: Page "/blog/[slug]" is missing "generateStaticParams()"
```

**Fix:** Either:
1. Add `generateStaticParams()` to enumerate all paths
2. Remove the dynamic route if not needed

### 404 on Direct URL Access
GitHub Pages doesn't handle client-side routing by default.

**Fix:** Ensure `trailingSlash: true` in config:
```ts
trailingSlash: true,
```

### Caching Issues After Deploy
GitHub Pages caches aggressively.

**Fix:**
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Wait 5-10 minutes for CDN propagation
- Check Actions tab to confirm deployment completed

## Pre-Push Checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm build` completes
- [ ] Tested locally with `npx serve out`
- [ ] No console errors in browser
- [ ] All images have `alt` attributes
- [ ] No server-side dependencies added

## Monitoring Deployments

1. Go to repository → Actions tab
2. Watch "Deploy Next.js site to Pages" workflow
3. Green checkmark = successful deployment
4. Click deployment URL to verify live site

## Rollback Procedure

If a bad deployment goes out:

1. Go to Actions tab
2. Find last successful workflow run
3. Click "Re-run all jobs"

Or revert the commit:
```bash
git revert HEAD
git push origin main
```
