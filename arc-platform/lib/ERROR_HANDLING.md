# Error Handling Guide

This document describes the error handling system implemented in the ARC Blockchain Platform.

## Overview

The platform implements comprehensive error handling at multiple levels:

1. **Global Error Boundaries** - Catch critical application errors
2. **Page-Level Error Pages** - Handle route-specific errors (404, 500)
3. **API Error Handling** - Standardized error responses from API routes
4. **Client Error Handling** - Utilities for handling API errors in client components
5. **Toast Notifications** - User-friendly error messages
6. **Loading States** - Skeleton loaders for all pages

## Components

### 1. Error Pages

#### `app/error.tsx`
Catches errors within page components and provides a recovery option.

#### `app/global-error.tsx`
Catches critical errors that occur outside the root layout.

#### `app/not-found.tsx`
Custom 404 page for non-existent routes.

### 2. Error Boundary Component

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

function MyComponent() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  )
}
```

### 3. Toast Notifications

```tsx
import { useToast } from '@/components/ui/toast'

function MyComponent() {
  const { addToast } = useToast()
  
  const handleAction = async () => {
    try {
      // ... some action
      addToast({
        title: 'Success!',
        description: 'Action completed successfully',
        variant: 'success',
      })
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'error',
      })
    }
  }
}
```

Toast variants:
- `default` - Gray background
- `success` - Green background
- `error` - Red background
- `warning` - Yellow background

### 4. API Error Handling (Server-Side)

```typescript
import { handleApiError, ApiError } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    // Validate input
    if (!isValid) {
      throw new ApiError(400, 'Invalid input', 'VALIDATION_ERROR')
    }
    
    // Process request
    const result = await processRequest()
    
    return NextResponse.json({ data: result })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### 5. Client-Side API Error Handling

```typescript
import { handleApiResponse, getClientErrorMessage } from '@/lib/client-error-handler'

async function fetchData() {
  try {
    const response = await fetch('/api/endpoint')
    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    const message = getClientErrorMessage(error)
    console.error(message)
    throw error
  }
}
```

### 6. Loading States

Each page has a corresponding `loading.tsx` file that displays skeleton loaders:

- `app/loading.tsx` - Homepage loading
- `app/dapps/loading.tsx` - DApp directory loading
- `app/assistant/loading.tsx` - AI assistant loading
- `app/contracts/loading.tsx` - Contract generator loading
- `app/debug/loading.tsx` - Debug assistant loading
- `app/onboarding/loading.tsx` - Onboarding guide loading

## Error Response Format

All API routes return errors in a consistent format:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {
      "field1": "Field-specific error",
      "field2": "Another error"
    }
  }
}
```

## Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `API_KEY_MISSING` - Required API key not configured
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server-side error
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions

## Best Practices

1. **Always use try-catch blocks** for async operations
2. **Provide user-friendly error messages** via toast notifications
3. **Log errors** for debugging (console.error)
4. **Validate input** before processing
5. **Use loading states** to indicate pending operations
6. **Handle specific error types** differently when needed
7. **Don't expose sensitive information** in error messages
8. **Test error scenarios** to ensure proper handling

## Examples

### Form Submission with Error Handling

```tsx
'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/toast'
import { handleApiResponse } from '@/lib/client-error-handler'

export function MyForm() {
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      await handleApiResponse(response)
      
      addToast({
        title: 'Success!',
        description: 'Form submitted successfully',
        variant: 'success',
      })
    } catch (error) {
      if (error instanceof ClientApiError && error.details) {
        setErrors(error.details)
      }
      
      addToast({
        title: 'Submission Failed',
        description: getClientErrorMessage(error),
        variant: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### API Route with Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { handleApiError, ApiError } from '@/lib/api-error'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    if (!body.name) {
      throw new ApiError(400, 'Name is required', 'VALIDATION_ERROR')
    }
    
    // Process
    const result = await processData(body)
    
    return NextResponse.json({ data: result })
  } catch (error) {
    return handleApiError(error)
  }
}
```
