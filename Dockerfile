# ==============================================================================
# IMI FRONTEND - DOCKERFILE
# ==============================================================================
# Multi-stage build for optimized production image

# ==============================================================================
# BUILD STAGE
# ==============================================================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Add metadata
LABEL maintainer="Infoecos Team"
LABEL description="IMI Frontend Application"
LABEL version="1.0.0"

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
ARG VITE_API_URL
ARG VITE_USE_MOCK_DATA=false
ARG VITE_ENVIRONMENT=production
ARG VITE_ENABLE_DEMO_MODE=false

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK_DATA=$VITE_USE_MOCK_DATA
ENV VITE_ENVIRONMENT=$VITE_ENVIRONMENT
ENV VITE_ENABLE_DEMO_MODE=$VITE_ENABLE_DEMO_MODE

# Generate build
RUN npm run build

# ==============================================================================
# PRODUCTION STAGE
# ==============================================================================
FROM nginx:alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S react -u 1001

# Copy custom nginx configuration
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Create directory for nginx cache and set permissions
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ==============================================================================
# DEVELOPMENT STAGE (Optional)
# ==============================================================================
FROM node:18-alpine AS development

WORKDIR /app

# Install development dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
