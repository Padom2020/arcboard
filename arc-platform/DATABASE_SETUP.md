# Database Setup Guide

This guide will help you set up PostgreSQL for the ARC Blockchain Onboarding Platform.

## Option 1: Local PostgreSQL Installation

### Windows

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will run on port 5432 by default

### macOS

Using Homebrew:

```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

After installing PostgreSQL, create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE arc_platform;

# Exit psql
\q
```

## Option 2: Docker PostgreSQL

If you prefer using Docker:

```bash
docker run --name arc-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=arc_platform \
  -p 5432:5432 \
  -d postgres:15
```

## Option 3: Cloud Database Services

### Vercel Postgres

1. Go to your Vercel project dashboard
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to your `.env` file

### Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (use the "Connection pooling" string for better performance)
5. Add it to your `.env` file

### Railway

1. Create a free account at [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string from the service variables
5. Add it to your `.env` file

## Configure Environment Variables

Update your `.env` file with the database connection string:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arc_platform?schema=public"

# Or use your cloud database connection string
# DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

## Run Migrations

Once your database is set up and the connection string is configured:

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:migrate
```

## Verify Setup

You can verify your database setup by opening Prisma Studio:

```bash
npm run db:studio
```

This will open a browser window where you can view and edit your database tables.

## Troubleshooting

### Connection Refused

- Make sure PostgreSQL is running
- Check that the port (5432) is not blocked by firewall
- Verify the connection string is correct

### Authentication Failed

- Check username and password in connection string
- For local PostgreSQL, the default user is usually `postgres`

### Database Does Not Exist

- Create the database manually using `psql` or your database client
- Or use `npm run db:push` which will create the database if it doesn't exist (not recommended for production)

### SSL Connection Issues

For cloud databases, you may need to add SSL parameters:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public&sslmode=require"
```

## Alternative: SQLite for Development

If you prefer not to set up PostgreSQL for local development, you can use SQLite:

1. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:

```env
DATABASE_URL="file:./dev.db"
```

3. Run migrations:

```bash
npm run db:generate
npm run db:migrate
```

**Note**: SQLite is suitable for development but PostgreSQL is recommended for production.
