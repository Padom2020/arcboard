import { NextResponse } from 'next/server';

const CATEGORIES = [
  { id: 'DeFi', name: 'DeFi', description: 'Decentralized Finance applications' },
  { id: 'NFT', name: 'NFT', description: 'Non-Fungible Token platforms and marketplaces' },
  { id: 'Gaming', name: 'Gaming', description: 'Blockchain-based games and gaming platforms' },
  { id: 'Infrastructure', name: 'Infrastructure', description: 'Developer tools and infrastructure services' },
  { id: 'Social', name: 'Social', description: 'Social networking and communication platforms' },
  { id: 'Other', name: 'Other', description: 'Other types of decentralized applications' },
];

export async function GET() {
  try {
    return NextResponse.json({
      data: CATEGORIES,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch categories',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
