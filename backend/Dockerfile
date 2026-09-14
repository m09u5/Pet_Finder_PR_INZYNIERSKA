# Built from the monorepo root: `docker build -f backend/Dockerfile .`
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json backend/package.json
COPY shared/package.json shared/package.json
COPY frontend/package.json frontend/package.json
RUN bun install --frozen-lockfile

COPY shared shared
COPY database/prisma database/prisma
COPY backend backend

WORKDIR /app/backend
RUN bun run db:generate

EXPOSE 4000
CMD ["bun", "run", "src/server.ts"]
