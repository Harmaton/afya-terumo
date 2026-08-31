# syntax=docker/dockerfile:1

FROM oven/bun:1 AS base
WORKDIR /usr/src/app
d -p 
# ---- install deps into a temp dir (cached layer) ----
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# ---- build the Next.js app ----
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
COPY .env .env

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---- minimal runtime image ----
FROM node:20-alpine AS release
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# requires output: 'standalone' in next.config.js
COPY --from=prerelease /usr/src/app/public ./public
COPY --from=prerelease --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=prerelease --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]