import { Skeleton } from "@/components/ui/skeleton"

export default function DAppDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Skeleton className="mb-6 h-6 w-32" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-10 w-64" />
              <Skeleton className="mb-4 h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
