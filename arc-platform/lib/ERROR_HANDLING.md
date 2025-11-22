# Error Handling Guide

This document describes the error handling strategy implemented across the ARC Blockchain Platform.

## Overview

The platform implements a comprehensive error handling system with:
- Centralized API error handling
- Client-side error boundaries
- Toast notifications for user feedback
- Loading states for all async operations
- Custom error pages (404, 500, global errors)

## Server-Side Error Handling

### API Error Handler

All API routes use the centralized `handleApiError` utility from `@/lib/api-error`:

```typescript
import { handleApiError, ApiError } from '@/lib/api-error';

export async function GET(request: NextRequest) {
  try {
    // API logic here
    
    // Throw custom errors
    if (!someCondition) {
      throw new ApiError(400, 'Invalid request', 'INVALID_REQUEST');
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### ApiError Class

The `ApiError` class provides structured error responses:

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  )
}
```

### Standard Error Response Format

All API errors return a consistent format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {} // Optional validation errors
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `INVALID_INPUT` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `API_KEY_MISSING` - Missing API key configuration
- `INTERNAL_ERROR` - Unexpected server error
- `UNKNOWN_ERROR` - Unhandled error

## Client-Side Error Handling

### Error Boundaries

The platform includes error boundary components for catching React errors:

**Root Error Boundary** (`app/error.tsx`):
- Catches errors in page components
- Displays user-friendly error message
- Provides "Try again" and "Go to homepage" actions

**Global Error Boundary** (`app/global-error.tsx`):
- Catches critical errors that crash the entire app
- Minimal UI with recovery option

**Component Error Boundary** (`components/error-boundary.tsx`):
- Reusable error boundary for wrapping specific components
- Supports custom fallback UI

Usage:
```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

### Client Error Handler

Use `@/lib/client-error-handler` for handling API responses:

```typescript
import { handleApiResponse, getClientErrorMessage } from '@/lib/client-error-handler';

try {
  const response = await fetch('/api/endpoint');
  const data = await handleApiResponse(response);
  // Use data
} catch (error) {
  const message = getClientErrorMessage(error);
  // Display error to user
}
```

### Toast Notifications

The platform uses a toast notification system for user feedback:

```typescript
import { useToast } from '@/components/ui/toast';

const { addToast } = useToast();

// Success toast
addToast({
  title: 'Success!',
  description: 'Operation completed successfully',
  variant: 'success',
});

// Error toast
addToast({
  title: 'Error',
  description: 'Something went wrong',
  variant: 'error',
});

// Warning toast
addToast({
  title: 'Warning',
  description: 'Please review your input',
  variant: 'warning',
});

// Default toast
addToast({
  title: 'Info',
  description: 'Here is some information',
  variant: 'default',
});
```

Toast options:
- `title` - Toast title (optional)
- `description` - Toast message (optional)
- `variant` - 'default' | 'success' | 'error' | 'warning'
- `duration` - Auto-dismiss duration in ms (default: 5000)

## Loading States

All pages have dedicated loading components:

- `app/loading.tsx` - Homepage loading
- `app/dapps/loading.tsx` - DApp directory loading
- `app/dapps/[id]/loading.tsx` - DApp detail loading
- `app/dapps/submit/loading.tsx` - DApp submission loading
- `app/assistant/loading.tsx` - AI assistant loading
- `app/contracts/loading.tsx` - Contract generator loading
- `app/debug/loading.tsx` - Debug assistant loading
- `app/onboarding/loading.tsx` - Onboarding guide loading

Loading states use skeleton loaders from `@/components/ui/skeleton` for better UX.

## Error Pages

### 404 Not Found (`app/not-found.tsx`)

Displayed when a page or resource is not found:
- Clear "404" heading
- User-friendly message
- Links to homepage and DApp directory

### 500 Server Error

Next.js automatically generates a 500 error page for server errors.

### Global Error (`app/global-error.tsx`)

Catches critical errors that prevent the app from rendering:
- Minimal HTML/CSS (no dependencies)
- Recovery option

## Best Practices

### API Routes

1. Always wrap route handlers in try-catch
2. Use `ApiError` for expected errors
3. Use `handleApiError` in catch blocks
4. Validate input and throw appropriate errors
5. Log errors for debugging

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.field) {
      throw new ApiError(400, 'Field is required', 'VALIDATION_ERROR');
    }
    
    // Process request
    const result = await processData(body);
    
    return NextResponse.json({ data: result });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Client Components

1. Use try-catch for async operations
2. Display loading states during operations
3. Show toast notifications for success/error
4. Provide user-friendly error messages
5. Allow users to retry failed operations

```typescript
const handleSubmit = async (data: FormData) => {
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    const result = await handleApiResponse(response);
    
    addToast({
      title: 'Success!',
      description: 'Operation completed',
      variant: 'success',
    });
  } catch (error) {
    const message = getClientErrorMessage(error);
    setError(message);
    
    addToast({
      title: 'Error',
      description: message,
      variant: 'error',
    });
  } finally {
    setIsLoading(false);
  }
};
```

### Form Validation

1. Validate on client-side first
2. Show inline validation errors
3. Validate on server-side for security
4. Return structured validation errors

```typescript
// Server-side validation
const errors: Record<string, string> = {};

if (!body.email) {
  errors.email = 'Email is required';
} else if (!isValidEmail(body.email)) {
  errors.email = 'Invalid email format';
}

if (Object.keys(errors).length > 0) {
  throw new ApiError(400, 'Validation failed', 'VALIDATION_ERROR');
}
```

## Testing Error Handling

When testing error scenarios:

1. Test API error responses
2. Test client error handling
3. Test loading states
4. Test error boundaries
5. Test toast notifications
6. Test form validation

## Monitoring and Logging

All errors are logged to the console. In production:

1. Integrate error tracking service (e.g., Sentry)
2. Log errors with context
3. Monitor error rates
4. Set up alerts for critical errors

```typescript
// Example: Integrate with error tracking
useEffect(() => {
  if (error) {
    // Send to error tracking service
    errorTracker.captureException(error, {
      context: 'component-name',
      user: userId,
    });
  }
}, [error]);
```

## Summary

The error handling system provides:
- ✅ Consistent error responses across all APIs
- ✅ User-friendly error messages
- ✅ Toast notifications for feedback
- ✅ Loading states for all async operations
- ✅ Error boundaries for React errors
- ✅ Custom error pages (404, 500)
- ✅ Centralized error handling utilities
- ✅ Validation error support
- ✅ Rate limiting with proper errors
