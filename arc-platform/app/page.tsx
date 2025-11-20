import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, Code, Search, Wrench, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/db';
import { DAppCard } from '@/components/dapps/dapp-card';
import { DApp } from '@/lib/types/dapp';

async function getFeaturedDApps() {
  try {
    const dapps = await prisma.dApp.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    return dapps as DApp[];
  } catch (error) {
    console.error('Error fetching featured DApps:', error);
    return [];
  }
}

export default async function Home() {
  const featuredDApps = await getFeaturedDApps();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/20 px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Welcome to the ARC Blockchain Platform</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Build on ARC Blockchain
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Your comprehensive hub for discovering DApps, getting AI assistance, generating smart contracts, and learning to build on the ARC ecosystem.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/onboarding"
              className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dapps"
              className="flex h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-foreground transition-colors hover:bg-accent"
            >
              Explore DApps
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="border-y border-border bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">5+</div>
              <div className="text-sm text-muted-foreground">Core Features</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Smart Assistance</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-foreground">OpenZeppelin</div>
              <div className="text-sm text-muted-foreground">Contract Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Everything You Need to Build
            </h2>
            <p className="mt-2 text-muted-foreground">
              Powerful tools and resources to accelerate your ARC blockchain development
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* DApp Directory */}
            <Link
              href="/dapps"
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                DApp Directory
              </h3>
              <p className="text-muted-foreground">
                Discover and explore decentralized applications built on ARC blockchain.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                Browse DApps
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* AI Assistant */}
            <Link
              href="/assistant"
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                AI Assistant
              </h3>
              <p className="text-muted-foreground">
                Get instant answers to your ARC blockchain questions from our AI agent.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                Start Chatting
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Smart Contract Generator */}
            <Link
              href="/contracts"
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Smart Contracts
              </h3>
              <p className="text-muted-foreground">
                Generate secure smart contracts using OpenZeppelin templates.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                Generate Contract
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Debug Help */}
            <Link
              href="/debug"
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Debug Help
              </h3>
              <p className="text-muted-foreground">
                Get AI-powered assistance to debug your ARC blockchain code.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                Get Help
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Onboarding Guide */}
            <Link
              href="/onboarding"
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                Onboarding Guide
              </h3>
              <p className="text-muted-foreground">
                Step-by-step tutorials to help you navigate the ARC ecosystem.
              </p>
              <div className="mt-4 flex items-center text-sm text-primary">
                Start Learning
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured DApps Section */}
      {featuredDApps.length > 0 && (
        <section className="bg-muted/30 px-4 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Featured DApps
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Explore popular applications built on ARC blockchain
                </p>
              </div>
              <Link
                href="/dapps"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredDApps.map((dapp) => (
                <DAppCard key={dapp.id} dapp={dapp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Start Building?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join the ARC blockchain ecosystem and bring your ideas to life with our comprehensive tools and resources.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Tutorial
                </Link>
                <Link
                  href="/assistant"
                  className="flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-8 text-foreground transition-colors hover:bg-accent"
                >
                  <Bot className="h-4 w-4" />
                  Ask AI Assistant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
