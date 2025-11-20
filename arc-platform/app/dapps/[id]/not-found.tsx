import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DAppNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">DApp Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The DApp you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/dapps" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Directory
          </Link>
        </Button>
      </div>
    </div>
  );
}
