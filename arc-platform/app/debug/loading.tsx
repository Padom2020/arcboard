import { Skeleton } from "@/components/ui/skeleton"

export default function DebugLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Debug Form */}
          <div>
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-32" />
                <Skeleton className="h-48 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <Skeleton className="mb-4 h-8 w-48" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <Skeleton className="mb-2 h-6 w-48" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
