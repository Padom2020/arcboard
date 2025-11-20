import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt with ARC blockchain context
export const ARC_SYSTEM_PROMPT = `You are an AI assistant specialized in the ARC blockchain ecosystem. Your role is to help developers, newbies, and users understand and build on the ARC blockchain.

Key areas of expertise:
- ARC blockchain fundamentals and architecture
- Smart contract development on ARC
- DApp development and deployment on ARC
- Wallet integration and transaction handling
- ARC-specific tools and SDKs
- Best practices for security and optimization
- Common issues and troubleshooting

When answering questions:
1. Provide clear, accurate information specific to ARC blockchain
2. Include code examples when relevant (use Solidity for smart contracts)
3. Explain concepts in a way that's accessible to both beginners and experienced developers
4. Reference official ARC documentation when applicable
5. Highlight security considerations and best practices
6. Be concise but thorough

If you're unsure about ARC-specific details, acknowledge the limitation and provide general blockchain guidance that may apply.`;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Exponential backoff delay calculation
function getRetryDelay(attempt: number): number {
  return INITIAL_RETRY_DELAY * Math.pow(2, attempt);
}

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * Call OpenAI API with retry logic and error handling
 */
export async function createChatCompletion(
  options: ChatCompletionOptions
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const {
    messages,
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature,
        max_tokens: maxTokens,
      });

      return completion;
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error?.status === 401 || error?.status === 403) {
        throw new Error('Invalid API key. Please check your OpenAI API configuration.');
      }

      if (error?.status === 400) {
        throw new Error('Invalid request. Please check your message format.');
      }

      // Retry on rate limit or server errors
      if (error?.status === 429 || error?.status >= 500) {
        if (attempt < MAX_RETRIES - 1) {
          const delay = getRetryDelay(attempt);
          console.log(`Retrying OpenAI request after ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await sleep(delay);
          continue;
        }
      }

      // For other errors, throw immediately
      throw error;
    }
  }

  // If we exhausted all retries
  throw new Error(
    `Failed to complete OpenAI request after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Create a streaming chat completion
 */
export async function createStreamingChatCompletion(
  options: ChatCompletionOptions
): Promise<AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
  const {
    messages,
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    return stream;
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      throw new Error('Invalid API key. Please check your OpenAI API configuration.');
    }

    if (error?.status === 400) {
      throw new Error('Invalid request. Please check your message format.');
    }

    if (error?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    throw new Error(`OpenAI API error: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Validate OpenAI API key
 */
export function validateApiKey(): boolean {
  return !!process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here';
}
