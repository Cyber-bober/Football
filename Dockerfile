# ─── Stage 1: Установка зависимостей ────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем package.json для установки
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# ─── Stage 2: Сборка приложения ─────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерируем Prisma-клиент
RUN npx prisma generate --schema=src/infrastructure/database/prisma/schema.prisma

# Собираем Next.js
RUN npm run build

# ─── Stage 3: Production образ ──────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]