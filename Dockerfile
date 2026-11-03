# Production Dockerfile for HEARTLINK (Coolify / VPS Deployment)
FROM node:20-alpine AS builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat

# Copy package manifests
COPY package*.json ./

# Install dependencies (including devDependencies needed for build)
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache libc6-compat

# Create data directory for JSON DB persistence
RUN mkdir -p /app/data

# Copy build artifacts and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src

EXPOSE 3000

VOLUME ["/app/data"]

CMD ["npm", "start"]
