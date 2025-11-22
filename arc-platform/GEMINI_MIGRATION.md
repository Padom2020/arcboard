# Migration from OpenAI to Google Gemini

## Overview

The ARC platform has been migrated from OpenAI to Google Gemini AI for all AI-powered features. This change provides:

- **Free Tier**: Gemini offers a generous free tier with no credit card required
- **No Cost**: Perfect for development and testing
- **Easy Setup**: Simple API key generation through Google AI Studio

## What Changed

### 1. AI Provider
- **Before**: OpenAI GPT-3.5-turbo
- **After**: Google Gemini Pro

### 2. Environment Variables
- **Before**: `OPENAI_API_KEY`
- **After**: `GEMINI_API_KEY`

### 3. Dependencies
- **Added**: `@google/generative-ai` package
- **Kept**: `openai` package (for type compatibility, can be removed if needed)

## Getting Your Free Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file:

```env
GEMINI_API_KEY=your-actual-api-key-here
```

## Testing the Integration

Run the test script to verify your API key works:

```bash
node test-gemini.js
```

Expected output:
```
✅ Gemini API is working!
Response: [AI response about blockchain]
✅ Gemini integration test passed!
```

## Features Using Gemini

### 1. AI Assistant (`/assistant`)
- Interactive chat interface
- Blockchain and smart contract guidance
- Code examples and explanations
- Streaming responses

### 2. Code Debugger (`/debug`)
- Error analysis
- Debugging suggestions
- Code fix recommendations
- Best practices guidance

## API Endpoints

### Chat API (`/api/chat`)
- Handles conversational AI interactions
- Supports streaming responses
- Rate limited to 10 requests per minute

### Debug API (`/api/debug`)
- Analyzes code errors
- Generates structured debugging suggestions
- Rate limited to 5 requests per minute

## Code Changes

### Modified Files

1. **`lib/openai.ts`**
   - Replaced OpenAI client with Gemini client
   - Updated message format conversion
   - Maintained compatible interface for existing code

2. **`app/api/chat/route.ts`**
   - Updated error messages to reference Gemini
   - Adjusted streaming response handling

3. **`app/api/debug/route.ts`**
   - Updated error messages to reference Gemini

4. **`.env` and `.env.example`**
   - Replaced `OPENAI_API_KEY` with `GEMINI_API_KEY`
   - Added instructions for getting free API key

## Compatibility Notes

- The `lib/openai.ts` file maintains the same interface, so no changes were needed in components
- Response format is converted to match OpenAI's structure for compatibility
- Streaming works similarly but uses Gemini's native streaming format

## Rate Limits

### Gemini Free Tier
- 60 requests per minute
- 1,500 requests per day
- More than sufficient for development and testing

### Application Rate Limits
- Chat API: 10 requests per minute per IP
- Debug API: 5 requests per minute per IP

## Troubleshooting

### API Key Not Working
- Verify you copied the entire key from Google AI Studio
- Check that there are no extra spaces or quotes
- Ensure the key is set in the `.env` file (not `.env.example`)

### "API key not configured" Error
- Restart the development server after adding the API key
- Verify the environment variable is loaded: `node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY)"`

### Rate Limit Errors
- Wait 1 minute before trying again
- Consider implementing request queuing for high-traffic scenarios

## Future Enhancements

Potential improvements for the Gemini integration:

1. **Model Selection**: Allow switching between Gemini Pro and Gemini Pro Vision
2. **Context Caching**: Implement caching for repeated queries
3. **Fine-tuning**: Create ARC-specific model fine-tuning
4. **Multi-modal**: Add support for image-based debugging (screenshots of errors)

## Rollback Instructions

If you need to rollback to OpenAI:

1. Install OpenAI package: `npm install openai`
2. Revert `lib/openai.ts` from git history
3. Update environment variables back to `OPENAI_API_KEY`
4. Restart the development server

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini Pricing](https://ai.google.dev/pricing)
- [Rate Limits](https://ai.google.dev/docs/rate_limits)

## Support

For issues related to:
- **Gemini API**: Check [Google AI documentation](https://ai.google.dev/docs)
- **Integration**: Review this migration guide
- **Application**: Check the main README.md

---

**Migration Date**: November 21, 2024  
**Migrated By**: Kiro AI Assistant  
**Status**: ✅ Complete
