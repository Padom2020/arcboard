import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { DApp } from '@/lib/types/dapp';

interface DAppCardProps {
  dapp: DApp;
}

export function DAppCard({ dapp }: DAppCardProps) {
  return (
    <Link href={`/dapps/${dapp.id}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer active:scale-[0.98]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl truncate">{dapp.name}</CardTitle>
              <Badge variant="secondary" className="mt-2 text-xs">
                {dapp.category}
              </Badge>
            </div>
            {dapp.logoUrl && (
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-muted relative">
                <Image
                  src={dapp.logoUrl}
                  alt={`${dapp.name} logo`}
                  fill
                  sizes="(max-width: 640px) 48px, 56px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="line-clamp-3 text-sm">
            {dapp.description}
          </CardDescription>
          {dapp.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {dapp.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {dapp.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{dapp.features.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
