FROM node:22.22.0-alpine3.23 AS build

ARG COMMIT_SHA=dev
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

RUN corepack enable && corepack prepare pnpm@latest --activate

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

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=build /app/sites/hq-kevinryan-io/.next ./sites/hq-kevinryan-io/.next
COPY --from=build /app/sites/hq-kevinryan-io/public ./sites/hq-kevinryan-io/public
COPY --from=build /app/sites/hq-kevinryan-io/package.json ./sites/hq-kevinryan-io/package.json
COPY --from=build /app/sites/hq-kevinryan-io/node_modules ./sites/hq-kevinryan-io/node_modules
COPY pnpm-workspace.yaml ./

WORKDIR /app/sites/hq-kevinryan-io

EXPOSE 3000

CMD ["pnpm", "start"]
