import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion, validateApiKey, type ChatMessage } from '@/lib/openai';
import { prisma } from '@/lib/db';

// Rate limiting configuration (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Lower limit for debugging requests

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userLimit.count++;
  return true;
}

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

// Debugging-specific system prompt
const DEBUG_SYSTEM_PROMPT = `You are an AI debugging assistant specialized in the ARC blockchain ecosystem. Your role is to help developers identify and resolve issues they encounter while building on ARC blockchain.

When analyzing errors:
1. Identify the root cause of the error
2. Provide clear, step-by-step solutions
3. Include code examples showing the fix
4. Explain why the error occurred
5. Suggest best practices to prevent similar issues
6. Reference ARC blockchain-specific considerations

Common ARC blockchain error patterns to watch for:
- Smart contract compilation errors (Solidity syntax, version mismatches)
- Transaction failures (gas estimation, nonce issues, insufficient funds)
- Web3 integration issues (provider connection, wallet integration)
- Contract interaction errors (ABI mismatches, function signatures)
- Network configuration problems (RPC endpoints, chain ID)

Format your response as structured suggestions with:
- A clear title for each solution
- Detailed description of the fix
- Code examples when applicable
- References to documentation or resources

Be concise but thorough. Focus on actionable solutions.`;

interface DebugSuggestion {
  title: string;
  description: string;
  codeExample?: string;
  references?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey()) {
      return NextResponse.json(
        {
          error: {
            message: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.',
            code: 'API_KEY_MISSING',
          },
        },
        { status: 500 }
      );
    }

    // Check rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        {
          error: {
            message: 'Rate limit exceeded. Please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
          },
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { errorMessage, codeSnippet, context } = body;

    // Validate input
    if (!errorMessage || typeof errorMessage !== 'string') {
      return NextResponse.json(
        {
          error: {
            message: 'Error message is required and must be a string.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    if (errorMessage.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            message: 'Error message cannot be empty.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    if (errorMessage.length > 5000) {
      return NextResponse.json(
        {
          error: {
            message: 'Error message is too long. Maximum length is 5000 characters.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    // Validate code snippet if provided
    if (codeSnippet && typeof codeSnippet !== 'string') {
      return NextResponse.json(
        {
          error: {
            message: 'Code snippet must be a string.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    if (codeSnippet && codeSnippet.length > 10000) {
      return NextResponse.json(
        {
          error: {
            message: 'Code snippet is too long. Maximum length is 10000 characters.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    // Build the debugging prompt
    let userPrompt = `I'm encountering the following error while developing on ARC blockchain:\n\nError: ${errorMessage}`;

    if (codeSnippet) {
      userPrompt += `\n\nCode snippet:\n\`\`\`\n${codeSnippet}\n\`\`\``;
    }

    if (context) {
      userPrompt += `\n\nAdditional context: ${context}`;
    }

    userPrompt += `\n\nPlease analyze this error and provide structured debugging suggestions. Format your response as a JSON array of suggestions, where each suggestion has:
- title: A brief title for the solution
- description: Detailed explanation of the fix
- codeExample: (optional) Code showing the fix
- references: (optional) Array of relevant documentation links

Example format:
[
  {
    "title": "Fix gas estimation error",
    "description": "The error occurs because...",
    "codeExample": "const tx = await contract.method();",
    "references": ["https://docs.arc.io/..."]
  }
]`;

    // Build messages array
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: DEBUG_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ];

    // Call OpenAI API
    const completion = await createChatCompletion({
      messages,
      temperature: 0.3, // Lower temperature for more focused debugging
      maxTokens: 1500,
    });

    const aiResponse = completion.choices[0]?.message?.content || '';

    // Try to parse structured suggestions from the response
    let suggestions: DebugSuggestion[] = [];
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a single suggestion with the full response
        suggestions = [
          {
            title: 'Debugging Suggestions',
            description: aiResponse,
          },
        ];
      }
    } catch (parseError) {
      // If parsing fails, wrap the response in a single suggestion
      suggestions = [
        {
          title: 'Debugging Suggestions',
          description: aiResponse,
        },
      ];
    }

    // Store debugging session in database
    try {
      await prisma.debugSession.create({
        data: {
          userId: clientId,
          errorMessage,
          codeSnippet: codeSnippet || null,
          suggestions: suggestions as any,
        },
      });
    } catch (dbError) {
      console.error('Failed to store debug session:', dbError);
      // Continue even if database storage fails
    }

    return NextResponse.json({
      suggestions,
      rawResponse: aiResponse,
    });
  } catch (error: any) {
    console.error('Debug API error:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: 'API_KEY_ERROR',
          },
        },
        { status: 500 }
      );
    }

    if (error.message?.includes('Rate limit')) {
      return NextResponse.json(
        {
          error: {
            message: error.message,
            code: 'RATE_LIMIT_EXCEEDED',
          },
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: 'An error occurred while processing your debugging request. Please try again.',
          code: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}
