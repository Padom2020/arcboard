import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Validation helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const VALID_CATEGORIES = ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Social', 'Other'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: { message: 'Limit must be between 1 and 100', code: 'INVALID_LIMIT' } },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: { message: 'Offset must be non-negative', code: 'INVALID_OFFSET' } },
        { status: 400 }
      );
    }

    // Build where clause for filtering
    const where: any = {
      status: 'approved', // Only show approved DApps
    };

    // Add search filter (search in name and description)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add category filter
    if (category) {
      where.category = category;
    }

    // Execute queries in parallel
    const [dapps, total] = await Promise.all([
      prisma.dApp.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.dApp.count({ where }),
    ]);

    return NextResponse.json({
      data: dapps,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching DApps:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch DApps',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const errors: Record<string, string> = {};

    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (body.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
      errors.description = 'Description is required';
    } else if (body.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (!body.category || typeof body.category !== 'string') {
      errors.category = 'Category is required';
    } else if (!VALID_CATEGORIES.includes(body.category)) {
      errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}`;
    }

    if (!body.websiteUrl || typeof body.websiteUrl !== 'string') {
      errors.websiteUrl = 'Website URL is required';
    } else if (!isValidUrl(body.websiteUrl)) {
      errors.websiteUrl = 'Website URL must be a valid URL';
    }

    if (!body.contactEmail || typeof body.contactEmail !== 'string') {
      errors.contactEmail = 'Contact email is required';
    } else if (!isValidEmail(body.contactEmail)) {
      errors.contactEmail = 'Contact email must be a valid email address';
    }

    // Validate optional fields
    if (body.logoUrl && typeof body.logoUrl === 'string' && !isValidUrl(body.logoUrl)) {
      errors.logoUrl = 'Logo URL must be a valid URL';
    }

    if (body.features && !Array.isArray(body.features)) {
      errors.features = 'Features must be an array';
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors,
          },
        },
        { status: 400 }
      );
    }

    // Create DApp with pending status
    const dapp = await prisma.dApp.create({
      data: {
        name: body.name.trim(),
        description: body.description.trim(),
        category: body.category,
        websiteUrl: body.websiteUrl,
        contactEmail: body.contactEmail,
        logoUrl: body.logoUrl || null,
        features: body.features || [],
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        data: {
          id: dapp.id,
          message: 'DApp submitted successfully and is pending approval',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating DApp:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Failed to submit DApp',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
