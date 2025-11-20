import { Suspense } from 'react';
import Link from 'next/link';
import { DAppGrid } from '@/components/dapps/dapp-grid';
import { DAppGridSkeleton } from '@/components/dapps/dapp-skeleton';
import { DAppSearch } from '@/components/dapps/dapp-search';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DAppListResponse, CategoriesResponse } from '@/lib/types/dapp';

async function getDApps(searchParams: { search?: string; category?: string }) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.category) params.set('category', searchParams.category);
  params.set('limit', '12');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dapps?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch DApps');
  }

  return res.json() as Promise<DAppListResponse>;
}

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dapps/categories`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json() as Promise<CategoriesResponse>;
}

interface DAppDirectoryContentProps {
  searchParams: { search?: string; category?: string };
}

async function DAppDirectoryContent({ searchParams }: DAppDirectoryContentProps) {
  const response = await getDApps(searchParams);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {response.pagination.total} {response.pagination.total === 1 ? 'DApp' : 'DApps'} found
        </p>
      </div>
      <DAppGrid dapps={response.data} />
    </div>
  );
}

export default async function DAppDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const categoriesResponse = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">DApp Directory</h1>
          <p className="text-muted-foreground">
            Discover decentralized applications built on the ARC blockchain
          </p>
        </div>
        <Button asChild>
          <Link href="/dapps/submit" className="inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Submit DApp
          </Link>
        </Button>
      </div>

      <DAppSearch categories={categoriesResponse.data} />

      <Suspense fallback={<DAppGridSkeleton />}>
        <DAppDirectoryContent searchParams={params} />
      </Suspense>
    </div>
  );
}
