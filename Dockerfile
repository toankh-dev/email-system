# --- Stage 1: base (install pnpm)
FROM node:lts-alpine3.22 AS base

ENV ROOT_DIR=/usr/src/app
ENV CI=true

WORKDIR $ROOT_DIR

# Update packages and install pnpm in one layer, clean cache
RUN apk update && apk upgrade --no-cache \
  && npm install -g pnpm@10.9.0 \
  && npm cache clean --force \
  && rm -rf /var/cache/apk/* /tmp/* /root/.npm

# ---------- Install production deps ----------
FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
  --mount=type=secret,id=env,target=/run/secrets/.env \
  pnpm fetch --prod --frozen-lockfile --store-dir=/root/.pnpm-store \
  && pnpm install --prod --store-dir=/root/.pnpm-store \
  && rm -rf /tmp/* /root/.cache

# ---------- Build (dev + devDeps) ----------
FROM base AS builder

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
  pnpm fetch --frozen-lockfile --store-dir=/root/.pnpm-store \
  && pnpm install --store-dir=/root/.pnpm-store \
  && rm -rf /tmp/* /root/.cache

COPY . .
RUN --mount=type=cache,target=.next/cache \
  --mount=type=secret,id=env,target=.env \
  pnpm build:prod \
  && rm -rf /tmp/* /root/.cache .env*

# ---------- Final image ----------
FROM node:lts-alpine3.22 AS runner

# Metadata
LABEL maintainer="your-email@example.com"
LABEL org.opencontainers.image.title="Email System"
LABEL org.opencontainers.image.description="Production-ready email system application"
LABEL org.opencontainers.image.vendor="Your Company"
LABEL org.opencontainers.image.licenses="MIT"

ENV ROOT_DIR=/usr/src/app \
    NODE_ENV=production \
    PORT=3000

WORKDIR $ROOT_DIR

# Install security updates and create non-root user
RUN apk update && apk upgrade --no-cache \
  && addgroup -g 1001 -S email-system \
  && adduser -D -u 1001 -G email-system -s /sbin/nologin -h /home/admin admin \
  && rm -rf /var/cache/apk/* /tmp/* /root/.npm /usr/share/man/* /usr/share/doc/*

# Note: standalone already includes necessary node_modules
COPY --chown=admin:email-system --from=builder $ROOT_DIR/.next/standalone/ ./
COPY --chown=admin:email-system --from=builder $ROOT_DIR/.next/static/ ./.next/static/
COPY --chown=admin:email-system --from=builder $ROOT_DIR/public/ ./public/

# Set read-only filesystem (except specific directories)
RUN chmod -R 555 /usr/src/app \
  && mkdir -p /tmp/.next/cache \
  && chown -R admin:email-system /tmp/.next

USER admin

EXPOSE 3000

# Add healthcheck directly in Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Use exec form to ensure proper signal handling
CMD ["node", "server.js"]
   