# Stage 1 — Build
FROM node:22.22.0-alpine3.23 AS build

ARG COMMIT_SHA=dev
ARG COMMIT_DATE=dev
ENV PUBLIC_COMMIT_SHA=${COMMIT_SHA}
ENV PUBLIC_COMMIT_DATE=${COMMIT_DATE}

# Pin pnpm 10.x: pnpm 11 turns ignored build scripts (esbuild/sharp) into a
# hard ERR_PNPM_IGNORED_BUILDS error, which breaks this pruned workspace install.
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY sites/ai-native-engineer-io/package.json ./sites/ai-native-engineer-io/

WORKDIR /app/sites/ai-native-engineer-io
RUN pnpm install --frozen-lockfile

WORKDIR /app
COPY sites/ai-native-engineer-io/ ./sites/ai-native-engineer-io/

WORKDIR /app/sites/ai-native-engineer-io
RUN pnpm build

# Stage 2 — Serve
FROM nginx:1.28.2-alpine

LABEL org.opencontainers.image.source="https://github.com/DevOpsKev/kevin-ryan-platform"

COPY --from=build /app/sites/ai-native-engineer-io/dist /usr/share/nginx/html
COPY sites/ai-native-engineer-io/nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /run/nginx.pid && \
    chown nginx:nginx /run/nginx.pid

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
