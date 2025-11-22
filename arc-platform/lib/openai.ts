import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// System prompt with ARC blockchain context
export const ARC_SYSTEM_PROMPT = `You are an AI assistant specialized in the ARC blockchain ecosystem. Your role is to help developers, newbies, and users understand and build on the ARC blockchain.

## About ARC Blockchain

ARC is a high-performance blockchain platform designed for scalability, security, and developer experience. Key characteristics:

- **EVM Compatible**: Fully compatible with Ethereum Virtual Machine, supporting Solidity smart contracts
- **High Performance**: Fast transaction processing with low latency
- **Developer-Friendly**: Comprehensive tooling and documentation
- **Secure**: Built with security best practices and regular audits
- **Growing Ecosystem**: Active DApps in DeFi, NFT, Gaming, and Infrastructure
- **Official Documentation**: https://docs.arc.network
- **Ecosystem Projects**: https://www.arc.network/ecosystem

## Key Areas of Expertise

1. **ARC Blockchain Fundamentals**
   - Architecture and consensus mechanisms
   - Network configuration and RPC endpoints
   - Transaction lifecycle and gas mechanics
   - Account model and wallet integration

2. **Smart Contract Development**
   - Solidity development for ARC
   - Contract deployment and verification
   - Testing and debugging contracts
   - Gas optimization techniques

3. **DApp Development**
   - Web3 integration with ARC
   - Frontend frameworks (React, Next.js, Vue)
   - Wallet connection (MetaMask, WalletConnect)
   - Event listening and transaction handling

4. **Development Tools**
   - Hardhat and Truffle configuration for ARC
   - Remix IDE usage
   - ARC-specific SDKs and libraries
   - Block explorers and debugging tools

5. **Best Practices**
   - Security considerations and common vulnerabilities
   - Gas optimization strategies
   - Error handling and user experience
   - Testing and deployment workflows

## Response Guidelines

1. **Be Accurate**: Provide information specific to ARC blockchain
2. **Include Examples**: Show code snippets when relevant (Solidity, JavaScript, TypeScript)
3. **Be Accessible**: Explain concepts for both beginners and experienced developers
4. **Reference Docs**: Point to https://docs.arc.network for detailed information
5. **Highlight Security**: Always mention security considerations
6. **Be Practical**: Focus on actionable, real-world solutions

## When Uncertain

If you're unsure about ARC-specific details:
- Acknowledge the limitation clearly
- Provide general blockchain guidance that may apply
- Suggest checking the official ARC documentation
- Recommend testing in a development environment

Remember: You're helping developers succeed on ARC blockchain. Be helpful, accurate, and encouraging!`;

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

export interface ChatCompletion {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Convert messages to Gemini format
 */
function convertMessagesToGemini(messages: ChatMessage[]): string {
  // Combine system message with user messages
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');
  
  let prompt = '';
  
  if (systemMessage) {
    prompt += `${systemMessage.content}\n\n`;
  }
  
  // Add conversation history
  conversationMessages.forEach(msg => {
    if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    }
  });
  
  // Add final prompt for assistant response
  if (conversationMessages[conversationMessages.length - 1]?.role === 'user') {
    prompt += 'Assistant: ';
  }
  
  return prompt;
}

/**
 * Call Gemini API with retry logic and error handling
 */
export async function createChatCompletion(
  options: ChatCompletionOptions
): Promise<ChatCompletion> {
  const {
    messages,
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const prompt = convertMessagesToGemini(messages);
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });

      const response = result.response;
      const text = response.text();

      // Convert Gemini response to OpenAI-compatible format
      return {
        id: `gemini-${Date.now()}`,
        choices: [
          {
            message: {
              role: 'assistant',
              content: text,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 0, // Gemini doesn't provide token counts in the same way
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error?.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API configuration.');
      }

      if (error?.message?.includes('Invalid')) {
        throw new Error('Invalid request. Please check your message format.');
      }

      // Retry on rate limit or server errors
      if (error?.status === 429 || error?.status >= 500) {
        if (attempt < MAX_RETRIES - 1) {
          const delay = getRetryDelay(attempt);
          console.log(`Retrying Gemini request after ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
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
    `Failed to complete Gemini request after ${MAX_RETRIES} attempts: ${lastError?.message || 'Unknown error'}`
  );
}

/**
 * Create a streaming chat completion
 */
export async function createStreamingChatCompletion(
  options: ChatCompletionOptions
): Promise<AsyncIterable<any>> {
  const {
    messages,
    temperature = 0.7,
    maxTokens = 1000,
  } = options;

  try {
    const prompt = convertMessagesToGemini(messages);
    
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    return result.stream;
  } catch (error: any) {
    if (error?.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API configuration.');
    }

    if (error?.message?.includes('Invalid')) {
      throw new Error('Invalid request. Please check your message format.');
    }

    if (error?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    throw new Error(`Gemini API error: ${error?.message || 'Unknown error'}`);
  }
}

/**
 * Validate Gemini API key
 */
export function validateApiKey(): boolean {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here';
}
