import { NextResponse } from 'next/server';
import { getAllTemplates } from '@/lib/contracts/templates';

/**
 * GET /api/contracts/templates
 * Returns list of available contract templates with metadata
 */
export async function GET() {
  try {
    const templates = getAllTemplates();
    
    return NextResponse.json({
      templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch contract templates',
          code: 'TEMPLATES_FETCH_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
