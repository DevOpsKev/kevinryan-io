FROM node:22.22.0-alpine3.23 AS build

ARG COMMIT_SHA=dev
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

# Pin pnpm 10.x: pnpm 11 turns ignored build scripts (esbuild/sharp) into a hard
# ERR_PNPM_IGNORED_BUILDS error, which breaks this pruned workspace install.
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY sites/hq-kevinryan-io/package.json ./sites/hq-kevinryan-io/

WORKDIR /app/sites/hq-kevinryan-io
RUN pnpm install --frozen-lockfile

WORKDIR /app
COPY sites/hq-kevinryan-io/ ./sites/hq-kevinryan-io/

WORKDIR /app/sites/hq-kevinryan-io
RUN pnpm build

FROM node:22.22.0-alpine3.23

LABEL org.opencontainers.image.source="https://github.com/DevOpsKev/kevin-ryan-platform"

# Pin pnpm 10.x to match the build stage (see above).
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY --from=build /app/sites/hq-kevinryan-io/.next ./sites/hq-kevinryan-io/.next
COPY --from=build /app/sites/hq-kevinryan-io/public ./sites/hq-kevinryan-io/public
COPY --from=build /app/sites/hq-kevinryan-io/package.json ./sites/hq-kevinryan-io/package.json
COPY --from=build /app/sites/hq-kevinryan-io/node_modules ./sites/hq-kevinryan-io/node_modules
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/sites/hq-kevinryan-io/config ./sites/hq-kevinryan-io/config
COPY pnpm-workspace.yaml ./

WORKDIR /app/sites/hq-kevinryan-io

EXPOSE 3000

CMD ["pnpm", "start"]
