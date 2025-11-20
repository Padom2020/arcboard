import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: { message: 'Invalid DApp ID', code: 'INVALID_ID' } },
        { status: 400 }
      );
    }

    // Fetch DApp from database
    const dapp = await prisma.dApp.findUnique({
      where: { id },
    });

    // Handle non-existent DApp
    if (!dapp) {
      return NextResponse.json(
        { error: { message: 'DApp not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    // Only return approved DApps to public
    if (dapp.status !== 'approved') {
      return NextResponse.json(
        { error: { message: 'DApp not found', code: 'NOT_FOUND' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: dapp });
  } catch (error) {
    console.error('Error fetching DApp:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch DApp',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
