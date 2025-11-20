import { FileQuestion } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4">
            <FileQuestion className="h-12 w-12 text-blue-600" />
          </div>
        </div>
        <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          Page not found
        </h2>
        <p className="mb-6 text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dapps">Browse DApps</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
