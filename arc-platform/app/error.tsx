"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Something went wrong!
        </h1>
        <p className="mb-6 text-gray-600">
          We encountered an unexpected error. Please try again or contact support if
          the problem persists.
        </p>
        {error.message && (
          <div className="mb-6 rounded-md bg-gray-100 p-4 text-left">
            <p className="text-sm font-mono text-gray-700">{error.message}</p>
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} size="lg">
            Try again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}
