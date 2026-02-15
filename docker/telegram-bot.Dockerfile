# ── Build stage ──
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
COPY nx.json tsconfig.base.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source files needed for building
COPY apps/telegram-bot/ apps/telegram-bot/

# Build the bot
RUN npx nx build telegram-bot

# ── Production stage ──
FROM node:20-alpine

WORKDIR /app

# Copy build output with generated package.json
COPY --from=build /app/dist/telegram-bot/ ./

# Install only production dependencies
RUN npm install --omit=dev

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "main.js"]
