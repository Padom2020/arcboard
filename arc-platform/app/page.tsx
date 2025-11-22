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
      <section className="bg-gradient-to-b from-background to-muted/20 px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-primary">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Welcome to Arcboard</span>
            <span className="sm:hidden">Welcome to Arcboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Build on ARC Blockchain
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground px-4">
            Your comprehensive hub for discovering DApps, getting AI assistance, generating smart contracts, and learning to build on the ARC ecosystem.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:flex-row">
            <Link
              href="/onboarding"
              className="flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95 touch-manipulation"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dapps"
              className="flex w-full sm:w-auto h-12 items-center justify-center rounded-lg border border-border bg-background px-6 text-foreground transition-colors hover:bg-accent active:scale-95 touch-manipulation"
            >
              Explore DApps
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="border-y border-border bg-muted/30 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">5+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Core Features</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">AI-Powered</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Smart Assistance</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl sm:text-3xl font-bold text-foreground">OpenZeppelin</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Contract Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Everything You Need to Build
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground px-4">
              Powerful tools and resources to accelerate your ARC blockchain development
            </p>
          </div>
          <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* DApp Directory */}
            <Link
              href="/dapps"
              className="group rounded-lg border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] touch-manipulation"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                DApp Directory
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Discover and explore decentralized applications built on ARC blockchain.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
                Browse DApps
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* AI Assistant */}
            <Link
              href="/assistant"
              className="group rounded-lg border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] touch-manipulation"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                AI Assistant
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get instant answers to your ARC blockchain questions from our AI agent.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
                Start Chatting
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Smart Contract Generator */}
            <Link
              href="/contracts"
              className="group rounded-lg border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] touch-manipulation"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                Smart Contracts
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Generate secure smart contracts using OpenZeppelin templates.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
                Generate Contract
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Debug Help */}
            <Link
              href="/debug"
              className="group rounded-lg border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] touch-manipulation"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                Debug Help
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get AI-powered assistance to debug your ARC blockchain code.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
                Get Help
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Onboarding Guide */}
            <Link
              href="/onboarding"
              className="group rounded-lg border border-border bg-card p-5 sm:p-6 transition-all hover:border-primary hover:shadow-lg active:scale-[0.98] touch-manipulation"
            >
              <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                Onboarding Guide
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Step-by-step tutorials to help you navigate the ARC ecosystem.
              </p>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary">
                Start Learning
                <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured DApps Section */}
      {featuredDApps.length > 0 && (
        <section className="bg-muted/30 px-4 sm:px-6 py-12 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Featured DApps
                </h2>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Explore popular applications built on ARC blockchain
                </p>
              </div>
              <Link
                href="/dapps"
                className="flex items-center gap-2 text-xs sm:text-sm text-primary hover:underline touch-manipulation"
              >
                View All
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {featuredDApps.map((dapp) => (
                <DAppCard key={dapp.id} dapp={dapp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Ready to Start Building?
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground px-4">
                Join the ARC blockchain ecosystem and bring your ideas to life with our comprehensive tools and resources.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:flex-row">
                <Link
                  href="/onboarding"
                  className="flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 sm:px-8 text-primary-foreground transition-colors hover:bg-primary/90 active:scale-95 touch-manipulation"
                >
                  <BookOpen className="h-4 w-4" />
                  Start Tutorial
                </Link>
                <Link
                  href="/assistant"
                  className="flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 sm:px-8 text-foreground transition-colors hover:bg-accent active:scale-95 touch-manipulation"
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
