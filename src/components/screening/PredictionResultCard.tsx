import { FlaskConical, CircleCheck } from 'lucide-react'
import type { ScreeningRecord } from '../../types/screening'
import { ModelBadge } from '../common/StatusBadge'
import { PredictionConfidence } from './PredictionConfidence'
import { ExplainabilityPanel } from './ExplainabilityPanel'
import { SafetyDisclaimer } from './SafetyDisclaimer'
import { ImageQualityBanner } from './ImageQualityBanner'
import { formatDate } from '../../utils/imageValidation'
export function PredictionResultCard({ result }: { result: ScreeningRecord }) {
  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <SafetyDisclaimer prominent />
      <section className="overflow-hidden rounded-xl border border-primary/20 bg-white">
        <header className="flex items-center gap-2 border-b border-border bg-primary-light/40 px-5 py-3">
          <CircleCheck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">{result.is_demo ? 'Demo analysis complete' : 'Research analysis complete'}</h2>
          <span className="ml-auto">
            <ModelBadge isDemo={result.is_demo} />
          </span>
        </header>
        <div className="p-5">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground">
            {result.is_demo ? 'DEMO OUTPUT · NOT A CLINICAL FINDING' : 'RESEARCH OUTPUT · NOT A CLINICAL DIAGNOSIS'}
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="mb-2 block text-[10px] text-muted-foreground">
                {result.is_demo ? 'Simulated classification' : 'Model classification estimate'}
              </span>
              <p className="text-2xl font-semibold tracking-tight">
                {result.predicted_label}
                <span className="ml-3 align-middle text-xs font-normal text-muted-foreground">Grade {result.predicted_grade}</span>
              </p>
            </div>
            <div>
              <span className="block text-[10px] text-muted-foreground">
                {result.is_demo ? 'Simulated demo score' : 'Uncalibrated model score'}
              </span>
              <p className="mt-1 text-2xl font-semibold text-primary">
                {(result.model_score * 100).toFixed(1)}
                <span className="text-sm">%</span>
              </p>
            </div>
          </div>
          {result.is_demo && (
            <p className="mt-4 flex gap-2 rounded-lg bg-warning-light p-3 text-[10px] leading-5 text-warning-foreground">
              <FlaskConical className="mt-0.5 size-4 shrink-0" />
              This untrained model output is simulated. It does not reflect actual disease severity or establish the presence or absence of
              diabetic retinopathy.
            </p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-[10px] sm:grid-cols-4">
            {[
              ['Record', result.record_id],
              ['Model version', result.model_version],
              ['Model type', result.model_type],
              ['Analyzed', formatDate(result.timestamp)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mt-1.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <ImageQualityBanner result={result} />
      <div className="grid gap-4 md:grid-cols-2">
        <PredictionConfidence result={result} />
        <ExplainabilityPanel isDemo={result.is_demo} explanation={result.explainability} modelVersion={result.model_version} />
      </div>
    </div>
  )
}
