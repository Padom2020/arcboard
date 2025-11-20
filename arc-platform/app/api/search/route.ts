import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { tutorials } from '@/lib/tutorials/content';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'dapp' | 'tutorial';
  url: string;
  category?: string;
  relevance: number;
}

export interface SearchResponse {
  results: {
    dapps: SearchResult[];
    tutorials: SearchResult[];
  };
  total: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchQuery = query.toLowerCase();

    // Search DApps in database
    const dapps = await prisma.dApp.findMany({
      where: {
        status: 'approved',
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { description: { contains: searchQuery, mode: 'insensitive' } },
          { category: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
      take: 10,
    });

    // Calculate relevance for DApps
    const dappResults: SearchResult[] = dapps.map((dapp) => {
      let relevance = 0;
      const nameLower = dapp.name.toLowerCase();
      const descLower = dapp.description.toLowerCase();
      const categoryLower = dapp.category.toLowerCase();

      // Exact match in name gets highest score
      if (nameLower === searchQuery) relevance += 100;
      else if (nameLower.includes(searchQuery)) relevance += 50;

      // Match in description
      if (descLower.includes(searchQuery)) relevance += 20;

      // Match in category
      if (categoryLower.includes(searchQuery)) relevance += 30;

      return {
        id: dapp.id,
        title: dapp.name,
        description: dapp.description,
        type: 'dapp' as const,
        url: `/dapps/${dapp.id}`,
        category: dapp.category,
        relevance,
      };
    });

    // Search tutorials in static content
    const tutorialResults: SearchResult[] = [];

    tutorials.forEach((tutorial) => {
      const tutorialTitleLower = tutorial.title.toLowerCase();
      const tutorialDescLower = tutorial.description.toLowerCase();

      let tutorialRelevance = 0;

      // Check tutorial title and description
      if (tutorialTitleLower === searchQuery) tutorialRelevance += 100;
      else if (tutorialTitleLower.includes(searchQuery)) tutorialRelevance += 50;

      if (tutorialDescLower.includes(searchQuery)) tutorialRelevance += 20;

      // Check tutorial steps
      tutorial.steps.forEach((step) => {
        const stepTitleLower = step.title.toLowerCase();
        const stepContentLower = step.content.toLowerCase();

        if (stepTitleLower.includes(searchQuery)) tutorialRelevance += 30;
        if (stepContentLower.includes(searchQuery)) tutorialRelevance += 10;
      });

      if (tutorialRelevance > 0) {
        tutorialResults.push({
          id: tutorial.id,
          title: tutorial.title,
          description: tutorial.description,
          type: 'tutorial' as const,
          url: `/onboarding?tutorial=${tutorial.id}`,
          category: tutorial.category,
          relevance: tutorialRelevance,
        });
      }
    });

    // Sort by relevance
    dappResults.sort((a, b) => b.relevance - a.relevance);
    tutorialResults.sort((a, b) => b.relevance - a.relevance);

    // Limit results
    const limitedDappResults = dappResults.slice(0, 5);
    const limitedTutorialResults = tutorialResults.slice(0, 5);

    const response: SearchResponse = {
      results: {
        dapps: limitedDappResults,
        tutorials: limitedTutorialResults,
      },
      total: limitedDappResults.length + limitedTutorialResults.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
