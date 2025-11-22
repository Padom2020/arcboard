import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DAppDetailResponse } from '@/lib/types/dapp';

async function getDApp(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/dapps/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch DApp');
  }

  return res.json() as Promise<DAppDetailResponse>;
}

export default async function DAppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await getDApp(id);

  if (!response) {
    notFound();
  }

  const dapp = response.data;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
      {/* Back Navigation */}
      <Link
        href="/dapps"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors touch-manipulation"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Directory
      </Link>

      {/* DApp Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
          {dapp.logoUrl && (
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted border">
              <img
                src={dapp.logoUrl}
                alt={`${dapp.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{dapp.name}</h1>
            <Badge variant="secondary" className="mb-2 sm:mb-4">
              {dapp.category}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="w-full sm:w-auto touch-manipulation">
            <a
              href={dapp.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto touch-manipulation">
            <a
              href={`mailto:${dapp.contactEmail}`}
              className="inline-flex items-center justify-center"
            >
              Contact
              <Mail className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{dapp.description}</p>
        </CardContent>
      </Card>

      {/* Features */}
      {dapp.features.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dapp.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Category</span>
            <Badge variant="secondary">{dapp.category}</Badge>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium">Website</span>
            <a
              href={dapp.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center"
            >
              {new URL(dapp.websiteUrl).hostname}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium">Added</span>
            <span className="text-sm text-muted-foreground">
              {new Date(dapp.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
