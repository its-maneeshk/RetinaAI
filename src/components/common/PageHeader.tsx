import type { ReactNode } from 'react'
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        {eyebrow && <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-primary">{eyebrow}</p>}
        <h1 className="text-[27px] leading-tight font-semibold tracking-[-0.035em] text-foreground sm:text-[30px]">{title}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
