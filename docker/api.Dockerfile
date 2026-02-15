FROM node:20-alpine

WORKDIR /app

# Copy pre-built output (built in CI)
COPY dist/api/ ./

# Install production dependencies + tslib (injected by TS importHelpers)
RUN npm install --omit=dev && npm install --no-save tslib

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "main.js"]
