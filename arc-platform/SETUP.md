# Quick Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use SQLite for development)
- OpenAI API key

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your actual values
# Required:
# - DATABASE_URL
# - OPENAI_API_KEY
# - NEXT_PUBLIC_APP_URL
```

**Important:** Never commit `.env.local` or any file containing real API keys!

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### 4. Seed Database (Optional)

If you want sample data for development:

```bash
# Create a seed script or manually add data via Prisma Studio
npm run db:studio
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables Reference

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/arc_platform` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `http://localhost:3000` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENZEPPELIN_API_KEY` | OpenZeppelin API key | - |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `NODE_ENV` | Environment mode | `development` |

## Database Options

### Option 1: SQLite (Development Only)

Easiest for local development:

```env
DATABASE_URL="file:./dev.db"
```

### Option 2: PostgreSQL (Recommended)

#### Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb arc_platform
```

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arc_platform?schema=public"
```

#### Cloud PostgreSQL

Use services like:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

## Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key and add to `.env.local`

**Note:** OpenAI API usage is not free. Monitor your usage in the dashboard.

### OpenZeppelin API Key

Currently, the OpenZeppelin Contracts Wizard may not require an API key. Check the [OpenZeppelin documentation](https://docs.openzeppelin.com/) for the latest requirements.

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -d arc_platform
```

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npm run db:push

# Regenerate Prisma client
npm run db:generate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### OpenAI API Errors

- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure you're not hitting rate limits
- Check the [OpenAI Status Page](https://status.openai.com/)

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:push        # Push schema changes
npm run db:studio      # Open Prisma Studio
```

## Project Structure

```
arc-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dapps/             # DApp directory pages
│   ├── assistant/         # AI assistant page
│   ├── contracts/         # Contract generator page
│   ├── debug/             # Debug assistant page
│   └── onboarding/        # Onboarding guide page
├── components/            # React components
│   ├── ui/               # UI components (buttons, cards, etc.)
│   ├── chat/             # Chat interface components
│   ├── contracts/        # Contract generator components
│   ├── dapps/            # DApp directory components
│   └── layout/           # Layout components (header, footer)
├── lib/                   # Utility functions and configurations
│   ├── contracts/        # Contract generation logic
│   ├── tutorials/        # Tutorial content
│   └── types/            # TypeScript types
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── .env.local            # Environment variables (not in git)
```

## Next Steps

1. ✅ Set up environment variables
2. ✅ Configure database
3. ✅ Run migrations
4. ✅ Start development server
5. 📝 Add sample DApps to database
6. 🧪 Test all features
7. 🚀 Deploy to production

## Security Reminders

- ⚠️ Never commit `.env` or `.env.local` files
- ⚠️ Never commit API keys or secrets
- ⚠️ Use different API keys for development and production
- ⚠️ Review the [SECURITY.md](./SECURITY.md) file for best practices

## Need Help?

- Check the [ERROR_HANDLING.md](./lib/ERROR_HANDLING.md) for error handling patterns
- Review the [SECURITY.md](./SECURITY.md) for security guidelines
- Check the [DATABASE_SETUP.md](./DATABASE_SETUP.md) for database details

## Deployment

See the main [README.md](./README.md) for deployment instructions to Vercel or other platforms.
