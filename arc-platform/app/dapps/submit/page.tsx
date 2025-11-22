import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DAppSubmissionForm } from '@/components/dapps/dapp-submission-form';
import { CategoriesResponse } from '@/lib/types/dapp';

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

export default async function DAppSubmitPage() {
  const categoriesResponse = await getCategories();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      {/* Back Navigation */}
      <Link
        href="/dapps"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors touch-manipulation"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Directory
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Submit Your DApp</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Share your decentralized application with the ARC blockchain community
        </p>
      </div>

      <DAppSubmissionForm categories={categoriesResponse.data} />
    </div>
  );
}
