import { NextRequest, NextResponse } from 'next/server';
import { createChatCompletion, validateApiKey, type ChatMessage } from '@/lib/openai';
import { prisma } from '@/lib/db';
import { handleApiError, ApiError } from '@/lib/api-error';

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

## About ARC Blockchain

ARC is an EVM-compatible blockchain platform. When debugging:
- Consider EVM compatibility and Solidity standards
- Check ARC-specific network configurations
- Verify gas settings and transaction parameters
- Reference official docs: https://docs.arc.network

## Debugging Approach

When analyzing errors:
1. **Identify Root Cause**: Determine what's actually failing
2. **Provide Solutions**: Give clear, step-by-step fixes
3. **Show Code**: Include working code examples
4. **Explain Why**: Help developers understand the issue
5. **Prevent Future Issues**: Suggest best practices
6. **Reference Docs**: Link to relevant ARC documentation

## Common ARC Error Patterns

### Smart Contract Errors
- Compilation errors (Solidity syntax, version mismatches)
- Deployment failures (gas limits, constructor parameters)
- Function execution reverts (require statements, access control)
- Gas estimation issues

### Transaction Errors
- Insufficient funds for gas
- Nonce management problems
- Transaction timeout or pending
- Gas price too low

### Web3 Integration Issues
- Provider connection failures
- Wallet integration problems (MetaMask, WalletConnect)
- Network configuration errors (wrong RPC, chain ID)
- ABI mismatches

### Contract Interaction Errors
- Function signature mismatches
- Parameter encoding issues
- Event listening problems
- State synchronization issues

## Response Format

Structure your suggestions as JSON array:
[
  {
    "title": "Clear, actionable title",
    "description": "Detailed explanation of the fix and why it works",
    "codeExample": "// Working code example\nconst fixed = await contract.method();",
    "references": ["https://docs.arc.network/relevant-section"]
  }
]

## Guidelines

- **Be Specific**: Tailor solutions to ARC blockchain
- **Be Practical**: Provide code that actually works
- **Be Clear**: Use simple language, avoid jargon when possible
- **Be Thorough**: Cover edge cases and gotchas
- **Be Helpful**: Include debugging tips and tools

Focus on actionable solutions that developers can implement immediately.`;

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
      throw new ApiError(500, 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment variables. Get a free key at https://makersuite.google.com/app/apikey', 'API_KEY_MISSING');
    }

    // Check rate limiting
    const clientId = getClientIdentifier(request);
    if (!checkRateLimit(clientId)) {
      throw new ApiError(429, 'Rate limit exceeded. Please try again later.', 'RATE_LIMIT_EXCEEDED');
    }

    // Parse request body
    const body = await request.json();
    const { errorMessage, codeSnippet, context } = body;

    // Validate input
    if (!errorMessage || typeof errorMessage !== 'string') {
      throw new ApiError(400, 'Error message is required and must be a string.', 'INVALID_INPUT');
    }

    if (errorMessage.trim().length === 0) {
      throw new ApiError(400, 'Error message cannot be empty.', 'INVALID_INPUT');
    }

    if (errorMessage.length > 5000) {
      throw new ApiError(400, 'Error message is too long. Maximum length is 5000 characters.', 'INVALID_INPUT');
    }

    // Validate code snippet if provided
    if (codeSnippet && typeof codeSnippet !== 'string') {
      throw new ApiError(400, 'Code snippet must be a string.', 'INVALID_INPUT');
    }

    if (codeSnippet && codeSnippet.length > 10000) {
      throw new ApiError(400, 'Code snippet is too long. Maximum length is 10000 characters.', 'INVALID_INPUT');
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
  } catch (error) {
    return handleApiError(error);
  }
}
