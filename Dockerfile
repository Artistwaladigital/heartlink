# Production Dockerfile for HEARTLINK (Coolify / VPS Deployment)
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install dependencies needed for sharp/canvas if any
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --legacy-peer-deps

# Copy application source
COPY . .

# Build application
RUN npm run build

# Expose server port
EXPOSE 3000

# Volume for data persistence across container redeploys in Coolify
VOLUME ["/app/data"]

# Start production server
CMD ["npm", "start"]
