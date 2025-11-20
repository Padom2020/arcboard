import { Skeleton } from "@/components/ui/skeleton"

export default function AssistantLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Chat Interface */}
        <div className="rounded-lg border bg-white shadow-sm">
          {/* Messages */}
          <div className="h-[500px] space-y-4 overflow-y-auto p-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${i % 2 === 0 ? "ml-auto" : ""}`}>
                  <Skeleton className="mb-2 h-20 w-64 rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
