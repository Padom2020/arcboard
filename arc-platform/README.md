# ARC Blockchain Onboarding Platform

A comprehensive Next.js web application designed to serve as a central hub for developers, newbies, and users interested in building on the ARC blockchain. The platform provides a directory of DApps, an AI-powered assistant for blockchain-specific queries, smart contract development tools integrated with OpenZeppelin, debugging assistance, and guided onboarding experiences.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API
- **Smart Contracts**: OpenZeppelin API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- OpenAI API key
- OpenZeppelin API key (optional)

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd arc-platform
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENZEPPELIN_API_KEY`: Your OpenZeppelin API key (if required)
- `NEXT_PUBLIC_APP_URL`: Your application URL (http://localhost:3000 for development)

4. Set up the database:

Generate the Prisma client:

```bash
npm run db:generate
```

Create the database and run migrations:

```bash
npm run db:migrate
```

This will create all the necessary tables (DApp, UserProgress, ChatSession, DebugSession) in your PostgreSQL database.

**Note**: Make sure your PostgreSQL server is running and the database specified in `DATABASE_URL` exists before running migrations.

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without making changes
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database (without migrations)
- `npm run db:studio` - Open Prisma Studio to view/edit database

## Project Structure

```
arc-platform/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/          # React components (to be created)
│   └── ui/             # Shadcn UI components
├── lib/                # Utility functions
│   ├── db.ts           # Database connection utility
│   └── utils.ts        # Helper utilities
├── prisma/             # Prisma ORM
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── public/             # Static assets
├── .env.example        # Environment variables template
├── .env                # Local environment variables (not committed)
├── components.json     # Shadcn UI configuration
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.mjs  # PostCSS configuration
├── prisma.config.ts    # Prisma configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Features (Planned)

- **DApp Directory**: Browse and search decentralized applications built on ARC blockchain
- **AI Assistant**: Get answers to ARC blockchain-specific questions
- **Smart Contract Generator**: Generate smart contracts using OpenZeppelin templates
- **Debugging Assistant**: Get help debugging ARC blockchain development issues
- **Onboarding Guide**: Interactive tutorials for new users

## Development Guidelines

### Code Style

This project uses ESLint and Prettier for code quality and formatting:

- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- TypeScript strict mode is enabled

### Adding Shadcn UI Components

To add new Shadcn UI components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add button
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## Deployment

The recommended deployment platform is Vercel:

1. Push your code to a Git repository
2. Import the project to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
