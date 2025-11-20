import { DApp } from '@/lib/types/dapp';
import { DAppCard } from './dapp-card';

interface DAppGridProps {
  dapps: DApp[];
}

export function DAppGrid({ dapps }: DAppGridProps) {
  if (dapps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No DApps found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dapps.map((dapp) => (
        <DAppCard key={dapp.id} dapp={dapp} />
      ))}
    </div>
  );
}
