# Contributing to ARC Blockchain Platform

Thank you for your interest in contributing to the ARC Blockchain Platform! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ installed
- PostgreSQL database (or SQLite for development)
- Git installed and configured
- A code editor (VS Code recommended)
- Basic knowledge of Next.js, React, and TypeScript

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/arc-platform.git
cd arc-platform
```

3. **Add upstream remote:**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/arc-platform.git
```

4. **Install dependencies:**

```bash
npm install
```

5. **Set up environment:**

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

6. **Set up database:**

```bash
npm run db:generate
npm run db:migrate
```

7. **Start development server:**

```bash
npm run dev
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-dapp-ratings`)
- `fix/` - Bug fixes (e.g., `fix/search-pagination`)
- `docs/` - Documentation updates (e.g., `docs/update-api-docs`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-queries`)
- `test/` - Adding tests (e.g., `test/add-api-tests`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add comments for complex logic
- Update documentation if needed
- Write tests for new features

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Check formatting
npm run format:check

# Fix formatting
npm run format

# Run tests (when available)
npm test

# Test in browser
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add DApp rating feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Project Structure

```
arc-platform/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── chat/           # AI chat endpoints
│   │   ├── contracts/      # Contract generation endpoints
│   │   ├── dapps/          # DApp directory endpoints
│   │   ├── debug/          # Debugging endpoints
│   │   ├── progress/       # Progress tracking endpoints
│   │   └── search/         # Search endpoints
│   ├── dapps/              # DApp directory pages
│   ├── assistant/          # AI assistant page
│   ├── contracts/          # Contract generator page
│   ├── debug/              # Debug assistant page
│   ├── onboarding/         # Onboarding guide page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── error.tsx           # Error boundary
│   ├── not-found.tsx       # 404 page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   ├── chat/               # Chat interface components
│   ├── contracts/          # Contract generator components
│   ├── dapps/              # DApp directory components
│   ├── debug/              # Debug assistant components
│   ├── layout/             # Layout components
│   ├── onboarding/         # Onboarding components
│   └── search/             # Search components
├── lib/                     # Utility functions
│   ├── contracts/          # Contract generation logic
│   ├── tutorials/          # Tutorial content
│   ├── types/              # TypeScript types
│   ├── db.ts               # Database connection
│   ├── openai.ts           # OpenAI integration
│   └── utils.ts            # Helper utilities
├── prisma/                  # Database schema
│   ├── schema.prisma       # Prisma schema
│   └── migrations/         # Database migrations
├── public/                  # Static assets
└── [config files]          # Configuration files
```

### Key Directories

- **`app/`** - Next.js pages and API routes (App Router)
- **`components/`** - Reusable React components
- **`lib/`** - Business logic and utilities
- **`prisma/`** - Database schema and migrations

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Enable strict mode** (already configured)
- **Define interfaces** for all data structures
- **Avoid `any` type** - use proper types or `unknown`
- **Use type inference** where possible

```typescript
// ✅ Good
interface DApp {
  id: string;
  name: string;
  category: DAppCategory;
}

function getDApp(id: string): Promise<DApp> {
  // ...
}

// ❌ Bad
function getDApp(id: any): any {
  // ...
}
```

### React Components

- **Use functional components** with hooks
- **Use Server Components** by default (Next.js App Router)
- **Mark Client Components** with `'use client'` directive
- **Keep components small** and focused
- **Extract reusable logic** into custom hooks

```typescript
// ✅ Good - Server Component
export default async function DAppsPage() {
  const dapps = await getDApps();
  return <DAppGrid dapps={dapps} />;
}

// ✅ Good - Client Component
'use client';

export function SearchBar() {
  const [query, setQuery] = useState('');
  // ...
}
```

### Naming Conventions

- **Components:** PascalCase (`DAppCard`, `ChatInterface`)
- **Files:** kebab-case (`dapp-card.tsx`, `chat-interface.tsx`)
- **Functions:** camelCase (`getDApps`, `formatDate`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **Types/Interfaces:** PascalCase (`DApp`, `ChatMessage`)

### Code Style

- **Use Prettier** for formatting (configured)
- **Use ESLint** for linting (configured)
- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** required
- **Trailing commas** in multi-line objects/arrays

```typescript
// ✅ Good
const dapp = {
  name: 'My DApp',
  category: 'DeFi',
};

// ❌ Bad
const dapp = {
  name: "My DApp",
  category: "DeFi"
}
```

### File Organization

- **One component per file**
- **Group related files** in directories
- **Export from index files** for cleaner imports
- **Co-locate tests** with components (when added)

```
components/
├── dapps/
│   ├── index.ts              # Export all components
│   ├── dapp-card.tsx
│   ├── dapp-grid.tsx
│   └── dapp-search.tsx
```

### API Routes

- **Use proper HTTP methods** (GET, POST, PUT, DELETE)
- **Validate input** on all endpoints
- **Return consistent responses** (see API_DOCUMENTATION.md)
- **Handle errors gracefully**
- **Add rate limiting** for expensive operations

```typescript
// ✅ Good
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      return NextResponse.json(
        { error: { message: 'Name is required', code: 'VALIDATION_ERROR' } },
        { status: 400 }
      );
    }
    
    // Process request
    const result = await createDApp(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'SERVER_ERROR' } },
      { status: 500 }
    );
  }
}
```

## Testing Guidelines

### Test Structure

When tests are added, follow these guidelines:

- **Unit tests** for utility functions
- **Integration tests** for API routes
- **Component tests** for React components
- **E2E tests** for critical user flows

### Writing Tests

```typescript
// Example unit test
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('January 15, 2024');
  });
});

// Example component test
describe('DAppCard', () => {
  it('should render DApp information', () => {
    const dapp = { name: 'Test DApp', category: 'DeFi' };
    render(<DAppCard dapp={dapp} />);
    expect(screen.getByText('Test DApp')).toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for **70%+ coverage** on utility functions
- **100% coverage** on API routes
- Focus on **critical paths** and **edge cases**

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks (dependencies, config)
- **perf:** Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(dapps): add rating system for DApps"

# Bug fix
git commit -m "fix(search): resolve pagination issue"

# Documentation
git commit -m "docs(api): update API documentation"

# Refactoring
git commit -m "refactor(chat): optimize message rendering"

# Multiple changes
git commit -m "feat(contracts): add ERC1155 template

- Add ERC1155 template configuration
- Update contract generator UI
- Add tests for ERC1155 generation"
```

### Commit Best Practices

- **Write clear, descriptive messages**
- **Use present tense** ("add feature" not "added feature")
- **Keep subject line under 72 characters**
- **Reference issues** in footer (`Fixes #123`)
- **Make atomic commits** (one logical change per commit)

## Pull Request Process

### Before Submitting

- [ ] Code follows project coding standards
- [ ] All tests pass (when available)
- [ ] Linter passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation is updated
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### PR Title Format

Use the same format as commit messages:

```
feat(dapps): add DApp rating feature
fix(search): resolve pagination bug
docs(api): update endpoint documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #123
Relates to #456

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** run (linting, tests)
2. **Code review** by maintainers
3. **Address feedback** if requested
4. **Approval** from at least one maintainer
5. **Merge** by maintainer

### After Merge

- Delete your feature branch
- Update your local main branch
- Close related issues

## Issue Guidelines

### Before Creating an Issue

- **Search existing issues** to avoid duplicates
- **Check documentation** for answers
- **Reproduce the bug** consistently

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

## Additional Context
Any other relevant information
```

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Mockups, examples, etc.
```

## Documentation

### When to Update Documentation

Update documentation when you:

- Add new features
- Change existing functionality
- Add new API endpoints
- Update environment variables
- Change setup process
- Fix bugs that affect usage

### Documentation Files

- **README.md** - Project overview and quick start
- **SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - API reference
- **DEPLOYMENT.md** - Deployment guide
- **CONTRIBUTING.md** - This file
- **SECURITY.md** - Security guidelines

### Code Comments

- **Add comments** for complex logic
- **Explain "why"** not "what"
- **Keep comments up to date**
- **Use JSDoc** for functions

```typescript
/**
 * Generates a smart contract from a template
 * @param templateId - The template identifier
 * @param parameters - Template-specific parameters
 * @returns Generated Solidity code
 * @throws {ValidationError} If parameters are invalid
 */
export async function generateContract(
  templateId: string,
  parameters: ContractParameters
): Promise<string> {
  // Implementation
}
```

## Getting Help

### Resources

- **Documentation:** Check README.md and other docs
- **Issues:** Search existing issues
- **Discussions:** GitHub Discussions (if enabled)

### Questions

For questions about contributing:

1. Check this guide first
2. Search existing issues/discussions
3. Create a new discussion or issue
4. Be specific and provide context

## Recognition

Contributors will be:

- Listed in the project's contributors
- Mentioned in release notes (for significant contributions)
- Credited in documentation (for major features)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to the ARC Blockchain Platform! 🚀

