import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'
import { LoaderCircle } from 'lucide-react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  children: ReactNode
}
export const buttonClass = (variant: Props['variant'] = 'primary', small = false) =>
  clsx(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45',
    small ? 'min-h-9 px-3 py-2' : 'min-h-10 px-4 py-2.5',
    variant === 'primary' && 'bg-primary text-white shadow-xs hover:bg-primary-dark',
    variant === 'secondary' && 'border border-border bg-white text-foreground shadow-xs hover:bg-muted',
    variant === 'ghost' && 'text-muted-foreground hover:bg-muted hover:text-foreground',
    variant === 'danger' && 'bg-destructive text-white hover:bg-red-800',
  )
export function Button({ children, variant, loading, className, disabled, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clsx(buttonClass(variant), className)}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
