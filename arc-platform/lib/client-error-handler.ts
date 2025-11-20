/**
 * Client-side error handling utilities
 */

export interface ApiErrorResponse {
  error: {
    message: string
    code?: string
    details?: Record<string, string>
  }
}

export class ClientApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: Record<string, string>
  ) {
    super(message)
    this.name = "ClientApiError"
  }
}

/**
 * Handles API responses and throws appropriate errors
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null
    
    try {
      errorData = await response.json()
    } catch {
      // If response is not JSON, use status text
      throw new ClientApiError(
        response.status,
        response.statusText || "Request failed",
        "UNKNOWN_ERROR"
      )
    }

    throw new ClientApiError(
      response.status,
      errorData?.error?.message || "Request failed",
      errorData?.error?.code,
      errorData?.error?.details
    )
  }

  return response.json()
}

/**
 * Gets a user-friendly error message from an error object
 */
export function getClientErrorMessage(error: unknown): string {
  if (error instanceof ClientApiError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === "string") {
    return error
  }
  
  return "An unexpected error occurred"
}

/**
 * Checks if an error is a specific API error code
 */
export function isApiErrorCode(error: unknown, code: string): boolean {
  return error instanceof ClientApiError && error.code === code
}

/**
 * Checks if an error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  return isApiErrorCode(error, "RATE_LIMIT_EXCEEDED")
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return isApiErrorCode(error, "VALIDATION_ERROR")
}
