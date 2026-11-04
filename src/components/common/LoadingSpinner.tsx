import { LoaderCircle } from 'lucide-react'
export function LoadingSpinner({ label = 'Loading workspace…' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-44 items-center justify-center gap-3 text-sm text-muted-foreground">
      <LoaderCircle className="size-5 motion-safe:animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}
