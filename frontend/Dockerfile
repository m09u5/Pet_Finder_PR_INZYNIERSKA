FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock ./
COPY frontend/package.json frontend/package.json
COPY shared/package.json shared/package.json
COPY backend/package.json backend/package.json
RUN bun install --frozen-lockfile

COPY shared shared
COPY frontend frontend

WORKDIR /app/frontend
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
