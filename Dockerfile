# Single-service deploy: builds both frontend and backend, then the backend
# server serves the frontend's built static files itself — one Render
# service, one URL, no separate frontend deployment or CORS coordination
# needed. Matches the pattern already proven working on the College Admin
# Portal project.

# ---- Stage 1: build the frontend ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Same-origin in production — no separate backend URL to configure, API
# calls go to relative /api/... paths since frontend and backend are served
# from the same place. Local dev is unaffected (uses frontend/.env instead).
ENV VITE_API_URL=""
RUN npm run build

# ---- Stage 2: build the backend ----
# Debian-based (not Alpine) — Prisma's engine binaries need a real OpenSSL
# that's straightforward to install; Alpine's musl libc causes exactly the
# "failed to detect libssl" / garbled JSON error Prisma throws otherwise.
FROM node:20-slim AS backend-build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma
RUN npm ci
COPY backend/ ./
RUN npm run build

# ---- Stage 3: runtime image ----
# Same Debian-based image as the backend build, for the same OpenSSL reason —
# `prisma migrate deploy` runs at container start (see CMD below) and needs
# it too, not just at build time.
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
# Full node_modules (not pruned to production-only) so the `prisma` CLI is
# still available at runtime for the migrate-on-start step below.
COPY --from=backend-build /app/backend/package*.json ./
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/prisma ./prisma
# The frontend's built static files — the backend serves these directly.
# Must match the path backend/src/index.ts serves from (./public).
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 4000
# Apply any pending migrations, then start — runs on every container start,
# which is safe since Prisma migrations are idempotent (already-applied
# migrations are skipped).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
