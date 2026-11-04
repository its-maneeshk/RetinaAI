import { useRef, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { ScanLine, ArrowRight, Save, Check, RotateCcw, ShieldCheck, Image, Cpu } from 'lucide-react'
import { api } from '../services/api'
import type { HealthResponse } from '../types/screening'
import { useScreening } from '../hooks/useScreening'
import { PageHeader } from '../components/common/PageHeader'
import { Button, buttonClass } from '../components/common/Button'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { CaseMetadataForm } from '../components/screening/CaseMetadataForm'
import { ImageUpload } from '../components/screening/ImageUpload'
import { ImageQualityBanner } from '../components/screening/ImageQualityBanner'
import { PredictionResultCard } from '../components/screening/PredictionResultCard'
import { SafetyDisclaimer, DemoBanner } from '../components/screening/SafetyDisclaimer'
export function Screening() {
  const screening = useScreening()
  const { data: health, error: healthError, mutate: retryHealth } = useSWR<HealthResponse>('/health', api)
  const resultsRef = useRef<HTMLDivElement>(null)
  const ready = Boolean(screening.file && screening.consent && screening.metadata.patient_reference)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await screening.analyze()
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  return (
    <>
      <PageHeader
        eyebrow="A THOUGHTFUL, GUIDED WORKFLOW"
        title="Start with a clearer picture."
        description="Add a synthetic case, upload a retinal image, and explore the screening pipeline."
        actions={
          <Link to="/history" className={buttonClass('secondary')}>
            View screening history
            <ArrowRight className="size-3.5" />
          </Link>
        }
      />
      {health?.model_type !== 'TRAINED' && <DemoBanner />}
      {healthError && (
        <ErrorMessage
          message="The Python screening service is unavailable. Analysis is paused until it reconnects."
          retry={() => void retryHealth()}
        />
      )}
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <form onSubmit={(event) => void submit(event)} className="flex flex-col gap-5">
            <div className="grid items-start gap-5 md:grid-cols-2">
              <CaseMetadataForm
                value={screening.metadata}
                onChange={screening.updateMetadata}
                disabled={screening.analyzing || screening.saving}
              />
              <ImageUpload file={screening.file} onFile={screening.chooseFile} disabled={screening.analyzing || screening.saving} />
            </div>
            {screening.file && !screening.result && <ImageQualityBanner rejected={screening.imageRejected} />}
            {!screening.result && (
              <div className="rounded-xl border border-border bg-white p-5">
                <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-6">
                  <input
                    type="checkbox"
                    checked={screening.consent}
                    onChange={(event) => screening.setConsent(event.target.checked)}
                    disabled={screening.analyzing}
                    className="mt-1 size-4 shrink-0 accent-primary"
                    required
                  />
                  <span>
                    I confirm this is synthetic, non-identifying data. I understand that{' '}
                    {health?.model_type === 'TRAINED'
                      ? 'research outputs are not diagnoses'
                      : 'demo predictions are simulated and have no clinical meaning'}
                    .
                  </span>
                </label>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
                  <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <ShieldCheck className="size-3.5" />
                    No clinical decisions. No patient-identifying data.
                  </p>
                  <Button type="submit" disabled={!ready || !health?.model_loaded} loading={screening.analyzing}>
                    <ScanLine className="size-4" />
                    {screening.analyzing
                      ? 'Running image checks & inference…'
                      : health?.model_type === 'TRAINED'
                        ? 'Analyze research image'
                        : 'Run demo analysis'}
                    {!screening.analyzing && <ArrowRight className="size-3.5" />}
                  </Button>
                </div>
                {screening.analyzing && (
                  <button type="button" onClick={screening.cancel} className="mt-3 text-[10px] text-muted-foreground underline">
                    Cancel analysis
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
        <aside className="flex flex-col gap-4">
          <section className="rounded-xl border border-border bg-white p-5">
            <h2 className="text-xs font-semibold">A simple path to understanding</h2>
            <ol className="mt-5 flex flex-col gap-5">
              {[
                { icon: Image, title: 'Upload your image', text: 'JPEG, PNG, or WebP. Synthetic fundus images only.' },
                { icon: ShieldCheck, title: 'Check the basics', text: 'Format, dimensions, brightness, and sharpness.' },
                { icon: Cpu, title: 'Explore the output', text: 'Review clearly labeled model scores and limitations.' },
              ].map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                    <Icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold">
                      0{index + 1} · {title}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-xl border border-primary/15 bg-primary-light/70 p-5">
            <p className="text-xs font-semibold text-primary-dark">New to retinal screening?</p>
            <p className="mt-2 text-[10px] leading-5 text-muted-foreground">
              Understand the five DR grades and why professional interpretation always matters.
            </p>
            <Link to="/education" className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-primary">
              Explore the learning center
              <ArrowRight className="size-3" />
            </Link>
          </section>
        </aside>
      </div>
      {screening.error && <ErrorMessage message={screening.error} />}
      <div ref={resultsRef} className="scroll-mt-6">
        {screening.result && (
          <div className="flex flex-col gap-5">
            <PredictionResultCard result={screening.result} />
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-4">
              <p role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
                {screening.result.is_saved ? (
                  <>
                    <Check className="size-4 text-primary" />
                    Record saved to screening history.
                  </>
                ) : (
                  'Analysis is a draft. Save it to include it in your history.'
                )}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={screening.reset} disabled={screening.saving}>
                  <RotateCcw className="size-3.5" />
                  New screening
                </Button>
                <Button onClick={() => void screening.save()} loading={screening.saving} disabled={screening.result.is_saved}>
                  <Save className="size-3.5" />
                  {screening.result.is_saved ? 'Record saved' : 'Save screening'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {!screening.result && <SafetyDisclaimer />}
    </>
  )
}
