import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-4 w-full rounded-full" />
        </div>

        {/* Tutorial Content */}
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          <Skeleton className="mb-4 h-8 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="mt-6 h-48 w-full rounded-md" />
          <div className="mt-6 flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-8">
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
