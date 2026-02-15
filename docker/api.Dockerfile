# ── Build stage ──
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./
COPY nx.json tsconfig.base.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source files needed for building
COPY apps/api/ apps/api/

# Build the API
RUN npx nx build api

# ── Production stage ──
FROM node:20-alpine

WORKDIR /app

# Copy build output with generated package.json
COPY --from=build /app/dist/api/ ./

# Install only production dependencies
RUN npm install --omit=dev

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "main.js"]
