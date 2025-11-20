import { NextRequest, NextResponse } from 'next/server';
import { generateContract, validateParameters } from '@/lib/contracts/generator';
import { getTemplateById } from '@/lib/contracts/templates';

/**
 * POST /api/contracts/generate
 * Generate smart contract code from template and parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, parameters } = body;
    
    // Validate request body
    if (!templateId || typeof templateId !== 'string') {
      return NextResponse.json(
        {
          error: {
            message: 'Template ID is required',
            code: 'INVALID_TEMPLATE_ID',
          },
        },
        { status: 400 }
      );
    }
    
    if (!parameters || typeof parameters !== 'object') {
      return NextResponse.json(
        {
          error: {
            message: 'Parameters object is required',
            code: 'INVALID_PARAMETERS',
          },
        },
        { status: 400 }
      );
    }
    
    // Check if template exists
    const template = getTemplateById(templateId);
    if (!template) {
      return NextResponse.json(
        {
          error: {
            message: `Template '${templateId}' not found`,
            code: 'TEMPLATE_NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }
    
    // Validate parameters
    const validation = validateParameters(templateId, parameters);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: {
            message: 'Invalid parameters',
            code: 'VALIDATION_ERROR',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }
    
    // Generate contract
    const contract = generateContract(templateId, parameters);
    
    return NextResponse.json({
      success: true,
      contract,
    });
    
  } catch (error) {
    console.error('Error generating contract:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.startsWith('Unknown template')) {
        return NextResponse.json(
          {
            error: {
              message: error.message,
              code: 'UNKNOWN_TEMPLATE',
            },
          },
          { status: 400 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      {
        error: {
          message: 'Failed to generate contract',
          code: 'GENERATION_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
