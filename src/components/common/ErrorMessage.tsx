import { AlertCircle } from 'lucide-react'
import { Button } from './Button'
export function ErrorMessage({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1">{message}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  )
}
