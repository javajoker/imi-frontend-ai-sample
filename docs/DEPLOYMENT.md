# Deployment Guide

## IP Marketplace Frontend Deployment

This guide covers deploying the IP Marketplace frontend application to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [Docker](#docker)
  - [Traditional Hosting](#traditional-hosting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Production Considerations](#production-considerations)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git repository access
- Domain name (optional but recommended)

## Environment Variables

Create environment files for different environments:

### `.env.local` (Development)
```env
# App Configuration
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK_DATA=true

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PAYMENTS=false
VITE_ENABLE_NOTIFICATIONS=false

# External Services (Development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
VITE_GOOGLE_ANALYTICS_ID=
VITE_SENTRY_DSN=

# i18n Configuration
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,zh-TW
```

### `.env.production` (Production)
```env
# App Configuration
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.ipmarketplace.com/api/v1
VITE_USE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_NOTIFICATIONS=true

# External Services (Production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=https://your-sentry-dsn

# Performance
VITE_CDN_URL=https://cdn.ipmarketplace.com
VITE_IMAGE_OPTIMIZATION=true

# Security
VITE_CSP_NONCE=
VITE_ALLOWED_ORIGINS=https://ipmarketplace.com,https://www.ipmarketplace.com

# i18n Configuration
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,zh-TW
```

### `.env.staging` (Staging)
```env
# App Configuration
VITE_ENVIRONMENT=staging
VITE_API_URL=https://api-staging.ipmarketplace.com/api/v1
VITE_USE_MOCK_DATA=false

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=false
VITE_ENABLE_NOTIFICATIONS=true

# External Services (Staging)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
VITE_GOOGLE_ANALYTICS_ID=GA_STAGING_ID
VITE_SENTRY_DSN=https://your-staging-sentry-dsn

# Security
VITE_ALLOWED_ORIGINS=https://staging.ipmarketplace.com

# i18n Configuration
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,zh-TW
```

## Build Process

### Local Build
```bash
# Install dependencies
npm install

# Run type checking
npm run lint

# Run tests
npm test -- --coverage --watchAll=false

# Build for production
npm run build

# Serve locally to test
npx serve -s build -l 3000
```

### Build Optimization

The build process includes:
- TypeScript compilation and type checking
- Code splitting and lazy loading
- Asset optimization and compression
- Bundle analysis and size optimization
- Service worker generation (if enabled)

### Build Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "build:staging": "VITE_ENVIRONMENT=staging npm run build",
    "build:production": "VITE_ENVIRONMENT=production npm run build",
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js",
    "type-check": "tsc --noEmit",
    "test:ci": "npm test -- --coverage --watchAll=false --passWithNoTests"
  }
}
```

## Deployment Options

### Vercel (Recommended)

Vercel offers the best developer experience for React applications with automatic deployments and optimizations.

#### Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   ```

2. **Configure `vercel.json`**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build"
       }
     ],
     "routes": [
       {
         "src": "/static/(.*)",
         "headers": {
           "cache-control": "public, max-age=31536000, immutable"
         }
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "env": {
       "VITE_ENVIRONMENT": "production"
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           },
           {
             "key": "Referrer-Policy",
             "value": "strict-origin-when-cross-origin"
           }
         ]
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   # Deploy to preview
   vercel
   
   # Deploy to production
   vercel --prod
   ```

#### Environment Variables in Vercel

Set environment variables through the Vercel dashboard or CLI:

```bash
# Set production environment variables
vercel env add VITE_API_URL production
vercel env add VITE_STRIPE_PUBLISHABLE_KEY production

# Set staging environment variables
vercel env add VITE_API_URL preview
```

### Netlify

#### Setup

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Configure `netlify.toml`**
   ```toml
   [build]
     publish = "build"
     command = "npm run build"
   
   [build.environment]
     VITE_ENVIRONMENT = "production"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [[headers]]
     for = "/static/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

3. **Deploy**
   ```bash
   # Build and deploy
   netlify deploy --prod --dir=build
   ```

### AWS S3 + CloudFront

#### Setup S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://ipmarketplace-frontend-prod

# Configure bucket for static website hosting
aws s3 website s3://ipmarketplace-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

#### Deployment Script

Create `scripts/deploy-aws.sh`:

```bash
#!/bin/bash

# Build the application
npm run build

# Sync files to S3
aws s3 sync build/ s3://ipmarketplace-frontend-prod \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html"

# Upload HTML files with no cache
aws s3 sync build/ s3://ipmarketplace-frontend-prod \
  --cache-control "no-cache" \
  --include "*.html"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed successfully!"
```

#### CloudFront Distribution

```json
{
  "CallerReference": "ipmarketplace-frontend",
  "Comment": "IP Marketplace Frontend Distribution",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-ipmarketplace-frontend-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "Compress": true
  },
  "Origins": [
    {
      "Id": "S3-ipmarketplace-frontend-prod",
      "DomainName": "ipmarketplace-frontend-prod.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "Enabled": true,
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    },
    {
      "ErrorCode": 403,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

### Docker

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=builder /app/build /usr/share/nginx/html

# Add labels
LABEL maintainer="your-email@example.com"
LABEL version="1.0.0"
LABEL description="IP Marketplace Frontend"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Cache static assets
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t ipmarketplace-frontend:latest .

# Run locally
docker run -p 3000:80 ipmarketplace-frontend:latest

# Push to registry
docker tag ipmarketplace-frontend:latest your-registry/ipmarketplace-frontend:latest
docker push your-registry/ipmarketplace-frontend:latest
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linting
        run: npm run lint
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        env:
          VITE_ENVIRONMENT: production
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build/
          
      - name: Deploy to Staging
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npx vercel --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
          
  deploy-production:
    needs: [build, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: build/
          
      - name: Deploy to Production
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npx vercel --prod --token=$VERCEL_TOKEN --scope=$VERCEL_ORG_ID
          
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

## Production Considerations

### Performance Optimization

1. **Bundle Analysis**
   ```bash
   # Analyze bundle size
   npm run analyze
   
   # Check for duplicate dependencies
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

2. **Code Splitting**
   - Implement route-based code splitting
   - Use React.lazy() for component-level splitting
   - Optimize chunk sizes

3. **Asset Optimization**
   - Enable gzip/brotli compression
   - Optimize images and fonts
   - Use CDN for static assets

### Security

1. **Content Security Policy**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; 
                  script-src 'self' 'unsafe-inline'; 
                  style-src 'self' 'unsafe-inline'; 
                  img-src 'self' data: https:; 
                  font-src 'self' https:;">
   ```

2. **Environment Variables**
   - Never commit sensitive data
   - Use different keys for different environments
   - Rotate keys regularly

3. **Security Headers**
   - Implement HTTPS everywhere
   - Set appropriate security headers
   - Enable HSTS

### SEO and Meta Tags

Update `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#2563eb" />
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="The world's first IP authorization and secondary creation marketplace platform. License, create, and sell authentic products with verified IP authorization." />
  <meta name="keywords" content="IP marketplace, intellectual property, licensing, authentic products, creators, secondary creation" />
  <meta name="author" content="IP Marketplace" />
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="IP Marketplace - Authentic IP Licensing Platform" />
  <meta property="og:description" content="License, create, and sell authentic products with verified IP authorization." />
  <meta property="og:image" content="%PUBLIC_URL%/og-image.jpg" />
  <meta property="og:url" content="https://ipmarketplace.com" />
  
  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="IP Marketplace - Authentic IP Licensing Platform" />
  <meta name="twitter:description" content="License, create, and sell authentic products with verified IP authorization." />
  <meta name="twitter:image" content="%PUBLIC_URL%/twitter-image.jpg" />
  
  <title>IP Marketplace - Authentic IP Licensing Platform</title>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>
</html>
```

## Monitoring & Maintenance

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

   ```typescript
   // src/utils/sentry.ts
   import * as Sentry from "@sentry/react";
   import { Integrations } from "@sentry/tracing";

   Sentry.init({
     dsn: process.env.VITE_SENTRY_DSN,
     integrations: [
       new Integrations.BrowserTracing(),
     ],
     tracesSampleRate: 1.0,
     environment: process.env.VITE_ENVIRONMENT,
   });
   ```

2. **Analytics**
   ```typescript
   // Google Analytics 4
   import { gtag } from 'ga-gtag';
   
   gtag('config', process.env.VITE_GOOGLE_ANALYTICS_ID, {
     page_title: document.title,
     page_location: window.location.href,
   });
   ```

### Health Checks

Create health check endpoints:

```typescript
// src/utils/healthCheck.ts
export const checkAppHealth = async () => {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.VITE_ENVIRONMENT,
    version: process.env.VITE_VERSION,
    api: await checkApiHealth(),
    dependencies: await checkDependencies(),
  };
  
  return checks;
};
```

### Monitoring Dashboard

Set up monitoring for:
- Application performance metrics
- Error rates and types
- User engagement metrics
- API response times
- Bundle size trends

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check for type errors
   npm run type-check
   
   # Verbose build output
   npm run build -- --verbose
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **Environment Variable Issues**
   - Ensure variables start with `VITE_`
   - Check variable names and values
   - Verify environment-specific configurations

4. **Routing Issues**
   - Configure server to handle client-side routing
   - Set up proper redirects for SPA
   - Check base URL configuration

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Enable verbose logging
VITE_DEBUG=true npm start

# Enable React DevTools
VITE_ENVIRONMENT=development npm run build
```

### Performance Issues

1. **Bundle Size Analysis**
   ```bash
   npm run analyze
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

2. **Runtime Performance**
   - Use React DevTools Profiler
   - Monitor Core Web Vitals
   - Check for memory leaks

### Support

For deployment issues:
- Check platform-specific documentation
- Review build logs and error messages
- Test locally with production build
- Verify environment variables and configurations

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] Performance optimized
- [ ] Error tracking enabled

### Post-deployment
- [ ] Application loads correctly
- [ ] All routes working
- [ ] API connections functional
- [ ] Monitoring dashboards active
- [ ] Error tracking operational
- [ ] Performance metrics baseline established

### Rollback Plan
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database migration compatibility checked
- [ ] Feature flags for quick disabling

This deployment guide should be regularly updated as the application evolves and new deployment requirements emerge.
