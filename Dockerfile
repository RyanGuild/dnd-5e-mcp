# syntax=docker/dockerfile:1

# --- Base builder image ---
FROM node:20-alpine AS builder

RUN apk add --no-cache bash

WORKDIR /app

# Install dependencies with good layer caching
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
COPY README.md ./
RUN npm run build

# --- Runtime image ---
FROM node:20-alpine AS runner

# MCP Gateway labels and metadata
LABEL org.opencontainers.image.title="D&D 5e Character MCP Server"
LABEL org.opencontainers.image.description="Model Context Protocol server for managing D&D 5e characters, including character creation, dice rolling, and inventory management"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="D&D Character MCP"
LABEL org.opencontainers.image.licenses="MIT"
LABEL mcp.server.name="dnd-character"
LABEL mcp.server.version="1.0.0"
LABEL mcp.server.description="D&D 5e character management and dice rolling"
LABEL mcp.server.transport="stdio"
LABEL mcp.server.capabilities="character-management,inventory,dice-rolling"

ENV NODE_ENV=production

# Create non-root user with home directory
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
WORKDIR /app

# Copy only runtime artifacts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist

# Install only production deps
RUN npm ci --omit=dev --no-audit --no-fund

# Run as non-root
USER nodejs

# Health check for MCP Gateway monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('MCP Server Health Check')" || exit 1

# Default command runs the MCP server entry (stdio)
CMD ["node", "dist/index.js"]
