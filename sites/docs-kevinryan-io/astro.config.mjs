import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: 'https://docs.kevinryan.io',
  integrations: [
    mermaid(),
    starlight({
      title: 'Kevin Ryan — Docs',
      favicon: '/favicon-dark.ico',
      head: [
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://analytics.kevinryan.io/script.js',
            'data-website-id': '7982fbc0-012b-4c04-8ec3-a9de42462351',
          },
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/DevOpsKev/kevin-ryan-platform',
        },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Footer: './src/components/Footer.astro',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'SDD',
          collapsed: true,
          items: [
            {
              label: 'Specifications',
              collapsed: true,
              autogenerate: { directory: 'specs', collapsed: true },
            },
            {
              label: 'Provenance',
              collapsed: true,
              autogenerate: { directory: 'provenance', collapsed: true },
            },
          ],
        },
        {
          label: 'Architecture Decisions',
          collapsed: true,
          autogenerate: { directory: 'adr', collapsed: true },
        },
        { label: 'K3s Architecture', link: '/k3s/' },
        { label: 'Terraform Infrastructure', link: '/terraform/' },
        { label: 'Cloudflare DNS & CDN', link: '/cloudflare/' },
        { label: 'Traefik Ingress', link: '/traefik/' },
        { label: 'Flux CD Deployment', link: '/flux-cd/' },
        { label: 'GitHub Actions Workflows', link: '/ci-cd/' },
        { label: 'Docker Builds', link: '/docker-builds/' },
        { label: 'Observability', link: '/observability/' },
        { label: 'Umami Analytics', link: '/umami/' },
        { label: 'Forgejo Git Hosting', link: '/forgejo/' },
        {
          label: 'Site Architectures',
          collapsed: true,
          items: [
            { label: 'kevinryan.io', link: '/sites/kevinryan-io/' },
            { label: 'docs.kevinryan.io', link: '/sites/docs-kevinryan-io/' },
            { label: 'brand.kevinryan.io', link: '/sites/brand-kevinryan-io/' },
            { label: 'aiimmigrants.com', link: '/sites/aiimmigrants-com/' },
            { label: 'specmcp.ai', link: '/sites/specmcp-ai/' },
            { label: 'sddbook.com', link: '/sites/sddbook-com/' },
            { label: 'distributedequity.org', link: '/sites/distributedequity-org/' },
          ],
        },
      ],
    }),
  ],
});
