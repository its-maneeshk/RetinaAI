import { clsx } from 'clsx'
import { FlaskConical } from 'lucide-react'
import type { Grade, QualityStatus } from '../../types/screening'
export function StatusBadge({
  children,
  tone = 'neutral',
  dot = false,
}: {
  children: React.ReactNode
  tone?: 'green' | 'amber' | 'red' | 'neutral'
  dot?: boolean
}) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold leading-none', {
        'bg-primary-light text-primary-dark': tone === 'green',
        'bg-warning-light text-warning-foreground': tone === 'amber',
        'bg-red-50 text-red-800': tone === 'red',
        'bg-muted text-muted-foreground': tone === 'neutral',
      })}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  )
}
export function ModelBadge({ isDemo = true }: { isDemo?: boolean }) {
  return (
    <StatusBadge tone={isDemo ? 'amber' : 'green'}>
      <FlaskConical className="size-3" aria-hidden="true" />
      {isDemo ? 'DEMO MODEL' : 'TRAINED · RESEARCH'}
    </StatusBadge>
  )
}
export function GradeBadge({ grade, label }: { grade: Grade; label: string }) {
  return <StatusBadge tone={grade <= 1 ? 'green' : grade === 2 ? 'amber' : 'red'}>{label}</StatusBadge>
}
export function QualityBadge({ status }: { status: QualityStatus }) {
  return (
    <StatusBadge tone={status === 'ACCEPTABLE' ? 'green' : status === 'WARNING' ? 'amber' : 'red'} dot>
      {status === 'ACCEPTABLE' ? 'Passed checks' : status === 'WARNING' ? 'Review quality' : 'Rejected'}
    </StatusBadge>
  )
}
