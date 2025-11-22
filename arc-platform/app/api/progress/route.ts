import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { handleApiError, ApiError } from '@/lib/api-error';

// Generate a session-based user ID for anonymous users
function getUserId(request: NextRequest): string {
  // In a real app, this would come from authentication
  // For now, we'll use a session ID from cookies or generate one
  const sessionId = request.cookies.get('session_id')?.value;
  
  if (sessionId) {
    return sessionId;
  }
  
  // Generate a new session ID
  return `anon_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);

    // Fetch user progress from database
    const progress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      // Return empty progress if user hasn't started
      return NextResponse.json({
        data: {
          userId,
          completedSteps: [],
          currentStep: null,
        },
      });
    }

    return NextResponse.json({
      data: {
        userId: progress.userId,
        completedSteps: progress.completedSteps,
        currentStep: progress.currentStep,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);
    const body = await request.json();

    // Validate request body
    const errors: Record<string, string> = {};

    if (!body.stepId || typeof body.stepId !== 'string') {
      errors.stepId = 'Step ID is required';
    }

    if (body.currentStep !== undefined && body.currentStep !== null && typeof body.currentStep !== 'string') {
      errors.currentStep = 'Current step must be a string or null';
    }

    if (Object.keys(errors).length > 0) {
      throw new ApiError(400, 'Validation failed', 'VALIDATION_ERROR');
    }

    // Check if progress record exists
    const existingProgress = await prisma.userProgress.findUnique({
      where: { userId },
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      const completedSteps = existingProgress.completedSteps.includes(body.stepId)
        ? existingProgress.completedSteps
        : [...existingProgress.completedSteps, body.stepId];

      progress = await prisma.userProgress.update({
        where: { userId },
        data: {
          completedSteps,
          currentStep: body.currentStep ?? existingProgress.currentStep,
        },
      });
    } else {
      // Create new progress record
      progress = await prisma.userProgress.create({
        data: {
          userId,
          completedSteps: [body.stepId],
          currentStep: body.currentStep ?? body.stepId,
        },
      });
    }

    // Set session cookie if it doesn't exist
    const response = NextResponse.json({
      data: {
        userId: progress.userId,
        completedSteps: progress.completedSteps,
        currentStep: progress.currentStep,
      },
    });

    if (!request.cookies.get('session_id')) {
      response.cookies.set('session_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
