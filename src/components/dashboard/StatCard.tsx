import type { LucideIcon } from 'lucide-react'
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  detail,
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
  detail?: string
}) {
  return (
    <article className="rounded-xl border border-border bg-white px-5 py-4 shadow-xs shadow-black/[0.015]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-medium text-muted-foreground">{title}</h2>
        <Icon className="size-4 text-primary/75" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="mt-3 flex items-end gap-2">
        <p className="text-[29px] leading-none font-semibold tracking-[-0.04em]">{value}</p>
        {detail && <span className="mb-0.5 rounded bg-primary-light px-1.5 py-0.5 text-[8px] font-semibold text-primary">{detail}</span>}
      </div>
      <p className="mt-3 text-[10px] text-muted-foreground">{description}</p>
    </article>
  )
}
