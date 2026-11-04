import { ShieldCheck, FlaskConical } from 'lucide-react'
import { Link } from 'react-router-dom'
export function SafetyDisclaimer({ prominent = false }: { prominent?: boolean }) {
  return (
    <aside
      aria-label="Medical safety disclaimer"
      className={
        prominent
          ? 'flex gap-3 rounded-xl border border-warning-border bg-warning-light p-4'
          : 'flex gap-3 rounded-xl border border-border bg-white p-4'
      }
    >
      <ShieldCheck className="mt-0.5 size-[18px] shrink-0 text-primary" aria-hidden="true" />
      <p className="text-[11px] leading-[1.8] text-muted-foreground">
        <strong className="font-semibold text-foreground">
          {prominent ? 'IMPORTANT: ' : 'Designed to support, never replace, clinical judgment. '}
        </strong>
        {prominent
          ? 'This result is an AI-generated screening estimate, not a clinical diagnosis. It does not replace examination or interpretation by a qualified ophthalmologist. Do not use this result alone to make treatment decisions.'
          : 'RetinaAI is an educational and research prototype, not a clinically validated medical device. Only use synthetic, non-identifying data.'}
      </p>
    </aside>
  )
}
export function DemoBanner() {
  return (
    <aside
      className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-warning-border bg-warning-light px-4 py-3"
      aria-label="Demo mode notice"
    >
      <FlaskConical className="size-4 shrink-0 text-warning-foreground" aria-hidden="true" />
      <p className="flex-1 text-[11px] leading-relaxed text-warning-foreground">
        <strong className="font-semibold">You&apos;re in demo mode.</strong> Predictions are simulated using an untrained model. Use
        synthetic images only.
      </p>
      <Link to="/model" className="text-[11px] font-semibold text-warning-foreground underline-offset-4 hover:underline">
        Model details <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  )
}
