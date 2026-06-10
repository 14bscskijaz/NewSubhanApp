# ─── Dependencies Stage ───────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are baked into the client bundle at build time.
# Pass them via --build-arg when building the image.
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_HARDCODED_EMAIL
ARG NEXT_PUBLIC_HARDCODED_PASSWORD

ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_HARDCODED_EMAIL=$NEXT_PUBLIC_HARDCODED_EMAIL
ENV NEXT_PUBLIC_HARDCODED_PASSWORD=$NEXT_PUBLIC_HARDCODED_PASSWORD

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ─── Runtime Stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# ====== Debug =========
RUN apk add --no-cache curl


# =============== End of debug ================

# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy standalone server output (requires `output: 'standalone'` in next.config.js)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV HOSTNAME=0.0.0.0

# Runtime env vars (NEXTAUTH_* are NOT baked in, they are read at runtime)
# Set them in docker-compose or via -e flags.

CMD ["node", "server.js"]
