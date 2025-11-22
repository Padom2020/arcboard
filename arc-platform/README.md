# Arcboard Blockchain Onboarding Platform

A comprehensive Next.js web application designed to serve as a central hub for developers, newbies, and users interested in building on the Arcboard blockchain. The platform provides a directory of DApps, an AI-powered assistant for blockchain-specific queries, smart contract development tools integrated with OpenZeppelin, debugging assistance, and guided onboarding experiences.

## ✨ Features

- **📱 DApp Directory**: Browse, search, and filter decentralized applications built on Arcboard blockchain
- **🤖 AI Assistant**: Get intelligent answers to Arcboard blockchain-specific questions with conversation context
- **📝 Smart Contract Generator**: Generate secure smart contracts using OpenZeppelin templates (ERC20, ERC721, ERC1155)
- **🐛 Debugging Assistant**: Get AI-powered help debugging Arcboard blockchain development issues
- **📚 Onboarding Guide**: Interactive step-by-step tutorials for new users with progress tracking
- **🔍 Global Search**: Search across DApps, tutorials, and documentation
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI API (GPT-3.5/GPT-4)
- **Smart Contracts**: OpenZeppelin Contracts
- **Deployment**: Vercel (recommended)

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

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Set up database
npm run db:generate
npm run db:migrate

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on http://localhost:3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without making changes |
| `npm run db:generate` | Generate Prisma client from schema |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes to database (dev only) |
| `npm run db:studio` | Open Prisma Studio to view/edit database |

## 📁 Project Structure

```
arc-platform/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── chat/               # AI chat endpoints
│   │   ├── contracts/          # Contract generation
│   │   ├── dapps/              # DApp directory API
│   │   ├── debug/              # Debugging assistant
│   │   ├── progress/           # Progress tracking
│   │   └── search/             # Global search
│   ├── dapps/                  # DApp directory pages
│   │   ├── [id]/              # DApp detail page
│   │   ├── submit/            # DApp submission
│   │   └── page.tsx           # DApp listing
│   ├── assistant/              # AI assistant page
│   ├── contracts/              # Contract generator page
│   ├── debug/                  # Debug assistant page
│   ├── onboarding/             # Onboarding guide page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── loading.tsx             # Loading state
│   └── globals.css             # Global styles
├── components/                  # React Components
│   ├── ui/                     # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── chat/                   # Chat interface
│   │   ├── chat-interface.tsx
│   │   ├── chat-input.tsx
│   │   └── message-bubble.tsx
│   ├── contracts/              # Contract generator
│   │   ├── contract-template-selector.tsx
│   │   ├── contract-config-form.tsx
│   │   └── contract-preview.tsx
│   ├── dapps/                  # DApp directory
│   │   ├── dapp-card.tsx
│   │   ├── dapp-grid.tsx
│   │   ├── dapp-search.tsx
│   │   └── dapp-submission-form.tsx
│   ├── debug/                  # Debug assistant
│   │   ├── debug-form.tsx
│   │   └── debug-suggestions.tsx
│   ├── layout/                 # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── onboarding/             # Onboarding guide
│   │   ├── onboarding-progress.tsx
│   │   ├── tutorial-step.tsx
│   │   └── tutorial-navigation.tsx
│   ├── search/                 # Search components
│   │   └── search-bar.tsx
│   └── error-boundary.tsx      # Error boundary
├── lib/                         # Utilities & Logic
│   ├── contracts/              # Contract generation
│   │   ├── templates.ts       # Template definitions
│   │   └── generator.ts       # Generation logic
│   ├── tutorials/              # Tutorial content
│   │   └── content.ts         # Tutorial data
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── db.ts                   # Database connection
│   ├── openai.ts               # OpenAI integration
│   ├── api-error.ts            # Error handling
│   ├── client-error-handler.ts # Client error handling
│   └── utils.ts                # Helper utilities
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration files
├── public/                      # Static Assets
│   ├── images/
│   └── icons/
├── .env.example                 # Environment template
├── .env.local                   # Local environment (gitignored)
├── .gitignore                   # Git ignore rules
├── components.json              # Shadcn config
├── eslint.config.mjs            # ESLint config
├── next.config.ts               # Next.js config
├── package.json                 # Dependencies
├── postcss.config.mjs           # PostCSS config
├── prettier.config.js           # Prettier config
├── prisma.config.ts             # Prisma config
├── tsconfig.json                # TypeScript config
├── README.md                    # This file
├── SETUP.md                     # Setup guide
├── DEPLOYMENT.md                # Deployment guide
├── API_DOCUMENTATION.md         # API reference
├── CONTRIBUTING.md              # Contribution guide
├── SECURITY.md                  # Security guidelines
└── DATABASE_SETUP.md            # Database guide
```

### Directory Descriptions

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js pages and API routes (App Router) |
| `components/` | Reusable React components organized by feature |
| `lib/` | Business logic, utilities, and integrations |
| `prisma/` | Database schema and migrations |
| `public/` | Static assets (images, icons, etc.) |

## 📖 Documentation

📑 **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Complete documentation index and navigation guide

### Core Documentation

- **[SETUP.md](./SETUP.md)** - Quick setup guide for local development
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Developer contribution guide
- **[SECURITY.md](./SECURITY.md)** - Security best practices
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Database configuration guide
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes

## 🏗️ Architecture

The platform follows a modern Next.js architecture:

- **App Router** - File-based routing with React Server Components
- **Server Components** - Default for optimal performance
- **Client Components** - Used only when interactivity is needed
- **API Routes** - RESTful API endpoints under `/api/*`
- **Prisma ORM** - Type-safe database access
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Accessible, customizable components

### Key Features Implementation

- **DApp Directory**: Server-side rendering with client-side search/filtering
- **AI Assistant**: Streaming responses from OpenAI API with conversation context
- **Contract Generator**: Integration with OpenZeppelin for secure contract templates
- **Debugging Assistant**: AI-powered code analysis and suggestions
- **Onboarding Guide**: Interactive tutorials with progress tracking
- **Global Search**: Full-text search across all content types

## 🛠️ Development Guidelines

### Code Style

This project uses ESLint and Prettier for code quality and formatting:

- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- TypeScript strict mode is enabled
- Follow the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines

### Adding Shadcn UI Components

To add new Shadcn UI components:

```bash
npx shadcn@latest add [component-name]
```

Example:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Environment Variables

See [.env.example](./.env.example) for all available environment variables.

#### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/arc_platform` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `NEXT_PUBLIC_APP_URL` | Your application URL | `http://localhost:3000` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENZEPPELIN_API_KEY` | OpenZeppelin API key | - |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |
| `NODE_ENV` | Environment mode | `development` |

**Important**: Never commit `.env` or `.env.local` files. Keep API keys secure.

### Database Management

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🧪 Testing

Testing infrastructure is in place for:

- Unit tests for utility functions
- Integration tests for API routes
- Component tests for React components
- E2E tests for critical user flows

Run tests with:

```bash
npm test
```

## 🚀 Deployment

The recommended deployment platform is Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/arc-platform)

### Environment Variables for Production

Required environment variables for production:

```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

See [.env.production.example](./.env.production.example) for a complete list.

## 📊 Project Status

- ✅ DApp Directory - Complete
- ✅ AI Assistant - Complete
- ✅ Smart Contract Generator - Complete
- ✅ Debugging Assistant - Complete
- ✅ Onboarding Guide - Complete
- ✅ Global Search - Complete
- ✅ Responsive Design - Complete
- 🚧 User Authentication - Planned
- 🚧 DApp Ratings & Reviews - Planned
- 🚧 Community Features - Planned

## 🔒 Security

Security is a top priority. Please review [SECURITY.md](./SECURITY.md) for:

- Security best practices
- Reporting vulnerabilities
- API key management
- Data protection guidelines

**Never commit sensitive information like API keys or database credentials.**

## 📚 Learn More

### Project Documentation

- [Setup Guide](./SETUP.md) - Detailed setup instructions
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Security Guidelines](./SECURITY.md) - Security best practices

### Technology Documentation

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React library
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS
- [Shadcn/ui](https://ui.shadcn.com) - Component library
- [Prisma](https://www.prisma.io/docs) - Database ORM
- [OpenAI API](https://platform.openai.com/docs) - AI integration
- [OpenZeppelin](https://docs.openzeppelin.com/) - Smart contracts

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env.local
```

**OpenAI API Error**
```bash
# Verify API key is correct
# Check OpenAI account has credits
# Review rate limits
```

**Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

For more troubleshooting, see [SETUP.md](./SETUP.md#troubleshooting).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

See the list of [contributors](https://github.com/YOUR_USERNAME/arc-platform/contributors) who participated in this project.

## 🙏 Acknowledgments

- OpenZeppelin for smart contract templates
- OpenAI for AI capabilities
- Vercel for hosting platform
- Shadcn for UI components
- The Arcboard blockchain community

## 📞 Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 🐦 Twitter: [@arcplatform](https://twitter.com/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)

## 🗺️ Roadmap

### Phase 1 (Current) - MVP
- ✅ Core features implementation
- ✅ Basic documentation
- ✅ Deployment setup

### Phase 2 (Q1 2025)
- 🚧 User authentication
- 🚧 DApp ratings and reviews
- 🚧 Enhanced search
- 🚧 Analytics dashboard

### Phase 3 (Q2 2025)
- 📋 Community features
- 📋 Advanced AI capabilities
- 📋 Mobile app
- 📋 API v2

---

**Built with ❤️ for the Arcboard blockchain community**
