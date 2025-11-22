# Deployment Guide - ARC Blockchain Platform

This guide covers deploying the ARC Blockchain Platform to production, with a focus on Vercel deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Post-Deployment](#post-deployment)
- [Alternative Platforms](#alternative-platforms)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ A Vercel account (free tier available)
- ✅ Production database (Vercel Postgres, Supabase, or similar)
- ✅ OpenAI API key with sufficient credits
- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ All features tested locally

## Environment Configuration

### Required Environment Variables

The following environment variables MUST be configured in production:

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `DATABASE_URL` | PostgreSQL connection string | Your database provider |
| `OPENAI_API_KEY` | OpenAI API key | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Your domain (e.g., https://arc-platform.vercel.app) |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENZEPPELIN_API_KEY` | OpenZeppelin API key (if required) | - |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `NODE_ENV` | Environment mode | `production` |

### Environment Variable Security

⚠️ **CRITICAL SECURITY PRACTICES:**

1. **Never commit** `.env`, `.env.local`, or `.env.production` files
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly (every 90 days recommended)
4. **Monitor API usage** to detect unauthorized access
5. **Use Vercel's encrypted environment variables** for production

## Database Setup

### Option 1: Vercel Postgres (Recommended)

Vercel Postgres is the easiest option for Vercel deployments:

1. **Create Vercel Postgres Database:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Create Postgres database
   vercel postgres create arc-platform-db
   ```

2. **Link Database to Project:**
   ```bash
   # Link your project
   vercel link
   
   # Pull environment variables
   vercel env pull .env.production.local
   ```

3. **The `DATABASE_URL` will be automatically added to your project**

### Option 2: Supabase

Supabase offers a generous free tier:

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Navigate to Settings → Database
4. Copy the connection string (use "Connection pooling" for production)
5. Add to Vercel environment variables

Example connection string:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### Option 3: Railway

Railway provides simple PostgreSQL hosting:

1. Go to [Railway](https://railway.app/)
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from the Variables tab
4. Add to Vercel environment variables

### Option 4: Neon

Neon offers serverless PostgreSQL:

1. Go to [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables

## Vercel Deployment

### Step 1: Prepare Your Repository

1. **Ensure your code is committed:**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Verify `.gitignore` excludes sensitive files:**
   ```bash
   # Check that these are in .gitignore:
   # .env
   # .env*.local
   # .vercel
   ```

### Step 2: Create Vercel Project

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `arc-platform` (if in monorepo) or `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### Option B: Via Vercel CLI

```bash
# Navigate to project directory
cd arc-platform

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - What's your project's name? arc-platform
# - In which directory is your code located? ./
# - Want to override settings? No
```

### Step 3: Configure Environment Variables

#### Via Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
OPENZEPPELIN_API_KEY=your-key (if needed)
NODE_ENV=production
```

3. Select environments: **Production**, **Preview**, **Development**
4. Click "Save"

#### Via Vercel CLI:

```bash
# Add production environment variables
vercel env add DATABASE_URL production
vercel env add OPENAI_API_KEY production
vercel env add NEXT_PUBLIC_APP_URL production

# Add for preview/development if needed
vercel env add DATABASE_URL preview
vercel env add OPENAI_API_KEY preview
```

### Step 4: Run Database Migrations

After setting up environment variables, run migrations:

```bash
# Pull production environment variables
vercel env pull .env.production.local

# Run migrations against production database
npm run db:migrate

# Or use Vercel CLI
vercel env pull
npx prisma migrate deploy
```

⚠️ **Important:** Use `prisma migrate deploy` for production (not `prisma migrate dev`)

### Step 5: Deploy

#### Automatic Deployment (Recommended):

Vercel automatically deploys when you push to your main branch:

```bash
git push origin main
```

#### Manual Deployment:

```bash
# Deploy to production
vercel --prod

# Or just deploy
vercel
```

### Step 6: Verify Deployment

1. **Check deployment status** in Vercel Dashboard
2. **Visit your production URL**
3. **Test critical features:**
   - DApp directory loads
   - AI Assistant responds
   - Contract generator works
   - Search functionality works
   - Database queries succeed

## Post-Deployment

### 1. Seed Production Database

Add initial data to your production database:

```bash
# Option A: Use Prisma Studio
npm run db:studio

# Option B: Create and run a seed script
# Create prisma/seed.ts and run:
npx prisma db seed
```

### 2. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### 3. Set Up Monitoring

#### Vercel Analytics:

1. Go to Project → Analytics
2. Enable Web Analytics (free)
3. Monitor page views, performance, and errors

#### Error Tracking:

Consider integrating error tracking:
- [Sentry](https://sentry.io/)
- [LogRocket](https://logrocket.com/)
- [Datadog](https://www.datadoghq.com/)

### 4. Configure API Rate Limiting

To prevent abuse of AI endpoints:

1. Implement rate limiting in API routes
2. Use Vercel's Edge Config for rate limit storage
3. Monitor API usage in OpenAI dashboard

### 5. Set Up Backups

#### Database Backups:

- **Vercel Postgres:** Automatic daily backups
- **Supabase:** Automatic backups (check your plan)
- **Railway:** Enable automatic backups in settings
- **Neon:** Automatic backups included

#### Manual Backup:

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Or use Prisma
npx prisma db pull
```

### 6. Security Checklist

- [ ] All environment variables are set correctly
- [ ] No API keys in code or git history
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Database uses SSL connection
- [ ] API rate limiting is configured
- [ ] Error messages don't expose sensitive data
- [ ] CORS is properly configured
- [ ] Content Security Policy headers are set

## Alternative Platforms

### Deploy to Netlify

1. Connect your Git repository
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### Deploy to Railway

1. Create new project from GitHub repo
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically

### Deploy to AWS (Advanced)

Use AWS Amplify or deploy to EC2/ECS:

1. Set up AWS account and CLI
2. Configure AWS Amplify or ECS
3. Set up RDS for PostgreSQL
4. Configure environment variables
5. Deploy via AWS CLI or console

### Self-Hosted (Docker)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t arc-platform .
docker run -p 3000:3000 --env-file .env.production arc-platform
```

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Error: "Prisma Client not generated"**
```bash
# Add to package.json scripts:
"postinstall": "prisma generate"
```

### Database Connection Issues

**Error: "Can't reach database server"**

1. Check `DATABASE_URL` is correct
2. Verify database is running
3. Check firewall/security group settings
4. Ensure SSL is configured if required

**Error: "SSL connection required"**

Add `?sslmode=require` to connection string:
```
postgresql://user:pass@host:5432/db?sslmode=require
```

### OpenAI API Errors

**Error: "Incorrect API key"**
- Verify API key in environment variables
- Check for extra spaces or quotes
- Regenerate API key if needed

**Error: "Rate limit exceeded"**
- Check your OpenAI usage limits
- Implement request queuing
- Upgrade OpenAI plan if needed

**Error: "Insufficient credits"**
- Add credits to OpenAI account
- Set up billing alerts

### Environment Variable Issues

**Variables not updating:**
```bash
# Redeploy after changing environment variables
vercel --prod

# Or trigger redeploy in dashboard
```

**Variables not accessible:**
- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Restart development server after changes
- Check variable is set for correct environment

### Performance Issues

**Slow API responses:**
- Check database query performance
- Add database indexes
- Implement caching with React Query
- Use Edge Functions for faster response times

**High memory usage:**
- Optimize images with Next.js Image component
- Implement code splitting
- Reduce bundle size

## Deployment Process Summary

### Quick Deployment Steps

For a quick production deployment to Vercel:

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "chore: prepare for production"
   git push origin main
   ```

2. **Set Up Database**
   - Create production PostgreSQL database (Vercel Postgres, Supabase, etc.)
   - Copy connection string

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_APP_URL`
   - Click "Deploy"

4. **Run Migrations**
   ```bash
   vercel env pull .env.production.local
   npx prisma migrate deploy
   ```

5. **Verify Deployment**
   - Visit your production URL
   - Test all major features
   - Check error logs

### Deployment Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Production database seeded with initial data
- [ ] All features tested in production
- [ ] Error handling works correctly
- [ ] Loading states display properly
- [ ] Mobile responsiveness verified
- [ ] API rate limiting configured
- [ ] Monitoring and analytics set up
- [ ] Backup strategy in place
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Performance metrics baseline established

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod

# Deploy with specific environment
vercel --env production
```

### Rollback

If issues occur after deployment:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/production-best-practices)

## Cost Estimation

### Free Tier (Hobby):
- Vercel: Free (with limits)
- Vercel Postgres: Free tier available
- OpenAI: Pay per use (~$0.002 per 1K tokens)

### Estimated Monthly Costs:
- **Small project:** $0-20/month
- **Medium traffic:** $20-100/month
- **High traffic:** $100+/month

Monitor usage and scale as needed.

---

**Need help?** Check the [SETUP.md](./SETUP.md) for local development or [SECURITY.md](./SECURITY.md) for security guidelines.
