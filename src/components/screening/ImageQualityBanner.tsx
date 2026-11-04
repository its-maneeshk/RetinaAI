import { CircleCheck, Info, TriangleAlert } from 'lucide-react'
import { clsx } from 'clsx'
import type { ScreeningRecord } from '../../types/screening'
export function ImageQualityBanner({ result, rejected = false }: { result?: ScreeningRecord | null; rejected?: boolean }) {
  if (rejected)
    return (
      <div role="status" className="flex gap-2.5 rounded-lg border border-red-200 bg-red-50 p-4">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-800" />
        <div>
          <p className="text-[11px] font-semibold text-red-800">REJECTED · Image could not be processed</p>
          <p className="mt-1 text-[10px] leading-5 text-red-800">
            Review the error details and choose a valid synthetic retinal fundus photograph. No prediction was generated.
          </p>
        </div>
      </div>
    )
  const warning = result?.quality_status === 'WARNING'
  const Icon = result ? (warning ? TriangleAlert : CircleCheck) : Info
  return (
    <div
      className={clsx(
        'flex items-start gap-2.5 rounded-lg border px-4 py-3',
        warning ? 'border-warning-border bg-warning-light' : 'border-primary/15 bg-primary-light/45',
      )}
      role="status"
    >
      <Icon className={clsx('mt-0.5 size-4 shrink-0', warning ? 'text-warning-foreground' : 'text-primary')} />
      <div>
        <p className="text-[11px] font-semibold">
          {result ? (warning ? 'Technical quality needs review' : 'Basic technical checks passed') : 'Ready for technical checks'}
        </p>
        <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
          {result
            ? result.quality_messages.join(' ')
            : 'Image decoding, dimensions, brightness, and sharpness are checked before analysis.'}{' '}
          Technical checks cannot establish clinical suitability.
        </p>
      </div>
    </div>
  )
}
