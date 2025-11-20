import { NextRequest, NextResponse } from 'next/server';
import {
  createStreamingChatCompletion,
  ARC_SYSTEM_PROMPT,
  validateApiKey,
  type ChatMessage,
} from '@/lib/openai';

// Rate limiting configuration (simple in-memory store)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

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
  // Use IP address or a session identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
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
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        {
          error: {
            message: 'Message is required and must be a string.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    if (message.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            message: 'Message cannot be empty.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    if (message.length > 4000) {
      return NextResponse.json(
        {
          error: {
            message: 'Message is too long. Maximum length is 4000 characters.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        {
          error: {
            message: 'Conversation history must be an array.',
            code: 'INVALID_INPUT',
          },
        },
        { status: 400 }
      );
    }

    // Limit conversation history to prevent token overflow
    const maxHistoryMessages = 20;
    const limitedHistory = conversationHistory.slice(-maxHistoryMessages);

    // Build messages array with system prompt
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: ARC_SYSTEM_PROMPT,
      },
      ...limitedHistory.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    // Create streaming response
    const stream = await createStreamingChatCompletion({
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              // Send the content as Server-Sent Events format
              const data = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
          // Send done signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error: any) {
          console.error('Streaming error:', error);
          const errorData = `data: ${JSON.stringify({ error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);

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
          message: 'An error occurred while processing your request. Please try again.',
          code: 'INTERNAL_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
}
