FROM node:20-alpine

WORKDIR /app

# Copy pre-built output (built in CI)
COPY dist/telegram-bot/ ./

# Install production dependencies + tslib (injected by TS importHelpers)
RUN npm install --omit=dev && npm install --no-save tslib

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "main.js"]
