# Portfolio Deployment Guide

## Production Deployment Checklist

### 📋 Pre-Deployment Steps

1. **Environment Variables**

   - Update `.env.production` with your production API URL
   - Set `VITE_API_URL` to your backend domain
   - Enable analytics if needed

2. **Build Optimization**

   ```bash
   # Frontend build
   cd frontend
   npm run build:prod

   # Backend build
   cd ../backend
   npm run build
   ```

3. **Testing**

   ```bash
   # Run linting
   npm run lint

   # Type checking
   npm run type-check

   # Preview production build
   npm run preview:prod
   ```

### 🚀 Deployment Options

#### Option 1: Netlify (Frontend) + Railway/Heroku (Backend)

**Frontend (Netlify):**

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

**Backend (Railway):**

1. Connect your GitHub repository to Railway
2. Set root directory to `backend`
3. Add environment variables (DATABASE_URL, JWT_SECRET, etc.)

#### Option 2: Vercel (Frontend) + AWS/Digital Ocean (Backend)

**Frontend (Vercel):**

1. Connect GitHub repository to Vercel
2. Framework preset: Vite
3. Root directory: `frontend`
4. Build command: `npm run build:prod`
5. Output directory: `dist`

#### Option 3: Self-Hosted (VPS)

**Setup with PM2:**

```bash
# Install PM2 globally
npm install -g pm2

# Backend
cd backend
npm install --production
pm2 start dist/index.js --name "portfolio-api"

# Frontend (serve with nginx or static server)
cd frontend
npm run build:prod
# Copy dist/ to your web server
```

### 🔧 Production Configuration

#### Backend Environment Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:password@host:port/portfolio_db
JWT_SECRET=your-super-secure-jwt-secret-key
FRONTEND_URL=https://your-domain.com
```

#### Frontend Environment Variables

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
```

### 📊 Performance Optimizations Applied

1. **Bundle Splitting**: Vendor libraries separated into chunks
2. **Code Elimination**: Console logs and debugger statements removed
3. **Asset Optimization**: Images and assets inlined when appropriate
4. **Compression**: Minification with Terser
5. **SEO**: Comprehensive meta tags and structured data

### 🔒 Security Considerations

1. **CORS**: Configured for production domains only
2. **Rate Limiting**: Applied to API endpoints
3. **Input Validation**: All forms validated on frontend and backend
4. **SQL Injection Protection**: Parameterized queries used
5. **XSS Protection**: Input sanitization implemented

### 📈 Monitoring & Analytics

**Recommended Tools:**

- **Frontend**: Google Analytics, Hotjar
- **Backend**: Winston logging, New Relic
- **Uptime**: Pingdom, UptimeRobot
- **Performance**: Lighthouse CI, GTmetrix

### 🔄 CI/CD Pipeline (Optional)

**GitHub Actions Example:**

```yaml
name: Deploy Portfolio
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install and Build
        run: |
          cd frontend
          npm ci
          npm run build:prod
          cd ../backend
          npm ci
          npm run build
```

### 🐛 Troubleshooting

**Common Issues:**

1. **CORS Errors**: Check backend CORS configuration
2. **API Connection**: Verify environment variables
3. **Build Failures**: Check TypeScript errors
4. **Database Connection**: Verify MySQL credentials

### 📱 Mobile Testing

Ensure to test on:

- iOS Safari
- Android Chrome
- Various screen sizes (320px to 1920px)
- Touch interactions and swipe gestures

### 🎯 Performance Targets

- **Lighthouse Score**: 90+ for all metrics
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

---

## Quick Deploy Commands

```bash
# Build everything
npm run build:all

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:prod
```

For specific deployment platform guides, see the `/docs` folder.
