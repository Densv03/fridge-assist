FROM node:20-alpine

WORKDIR /app

# Copy pre-built output (built in CI)
COPY dist/telegram-bot/ ./

# Install only production dependencies
RUN npm install --omit=dev

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "main.js"]
