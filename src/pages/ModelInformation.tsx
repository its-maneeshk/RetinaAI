import useSWR from 'swr'
import { FlaskConical, Cpu, Check, X, ArrowUpRight, Download, Database, LockKeyhole, RefreshCw } from 'lucide-react'
import { api, apiUrl, errorMessage } from '../services/api'
import type { HealthResponse } from '../types/screening'
import { PageHeader } from '../components/common/PageHeader'
import { Button, buttonClass } from '../components/common/Button'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { ModelBadge } from '../components/common/StatusBadge'
import { SafetyDisclaimer } from '../components/screening/SafetyDisclaimer'
export function ModelInformation() {
  const { data, error, mutate, isValidating } = useSWR<HealthResponse>('/health', api)
  return (
    <>
      <PageHeader
        eyebrow="TRANSPARENCY, BY DESIGN"
        title="Know the model. Know its limits."
        description="The technology behind RetinaAI, explained without the black box."
        actions={
          <Button variant="secondary" onClick={() => void mutate()} loading={isValidating}>
            <RefreshCw className="size-3.5" />
            Check service
          </Button>
        }
      />
      {error ? (
        <ErrorMessage message={errorMessage(error)} retry={() => void mutate()} />
      ) : !data ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="overflow-hidden rounded-xl border border-border bg-white">
            <header className="flex items-center gap-3 border-b border-border p-5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Cpu className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">
                  {data.model_type === 'DEMO' ? 'Untrained demonstration model' : 'Trained research model'}
                </h2>
                <p className="mt-1 text-[10px] text-muted-foreground">TensorFlow / Keras inference pipeline</p>
              </div>
              <span className="ml-auto">
                <ModelBadge isDemo={data.model_type === 'DEMO'} />
              </span>
            </header>
            <dl className="grid grid-cols-2 gap-6 p-5 sm:grid-cols-4">
              {[
                ['Model version', data.model_version],
                ['Service status', data.model_loaded ? 'Loaded & operational' : 'Model unavailable'],
                ['Input contract', '224 × 224 · RGB · 0–255'],
                ['Output contract', '5-class softmax'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] text-muted-foreground">{label}</dt>
                  <dd className="mt-2 text-xs font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-xl border border-border bg-white p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <FlaskConical className="size-4 text-primary" />
                What this prototype does
              </h2>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  'Validates image format, size, and basic technical quality',
                  'Preprocesses images and runs a real Keras inference pipeline',
                  'Returns five clearly labeled research scores',
                  'Stores saved cases and metadata in a SQLite database',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[11px] leading-6 text-muted-foreground">
                    <Check className="mt-1 size-3.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-warning-border bg-warning-light p-6">
              <h2 className="text-sm font-semibold text-warning-foreground">What it does not do</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {[
                  data.model_type === 'DEMO'
                    ? 'Identify disease: the demo has never been trained on retinal data'
                    : 'Provide clinically validated diagnostic interpretations',
                  'Provide a clinical confidence measurement or treatment advice',
                  'Confirm that an image is a retina or clinically suitable',
                  'Fabricate Grad-CAM heatmaps or model explanations',
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-[11px] leading-6 text-warning-foreground">
                    <X className="mt-1 size-3.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <section className="rounded-xl border border-border bg-white p-6">
            <h2 className="text-sm font-semibold">A clear path from demo to research</h2>
            <p className="mt-2 max-w-3xl text-xs leading-7 text-muted-foreground">
              The frontend and response contract stay the same. Train a compatible five-class model, export it as retina_dr_model.keras, and
              update the backend MODEL_PATH, MODEL_TYPE, and MODEL_VERSION settings. The loader verifies input/output shapes and rejects
              attempts to label the demo artifact as trained.
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-4">
              {['Prepare & license a dataset', 'Train & evaluate rigorously', 'Export the Keras artifact', 'Verify & integrate safely'].map(
                (item, index) => (
                  <li key={item} className="rounded-lg border border-border bg-background p-4">
                    <span className="text-[9px] font-semibold text-primary">STEP 0{index + 1}</span>
                    <p className="mt-2 text-[11px] font-medium leading-6">{item}</p>
                  </li>
                ),
              )}
            </ol>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={apiUrl('/resources/kaggle-guide')} download className={buttonClass('secondary')}>
                <Download className="size-3.5" />
                Kaggle training guide
              </a>
              <a href={apiUrl('/docs')} target="_blank" rel="noopener noreferrer" className={buttonClass('ghost')}>
                Explore API documentation
                <ArrowUpRight className="size-3.5" />
                <span className="sr-only">Opens in a new tab</span>
              </a>
            </div>
          </section>
          <section className="grid gap-6 rounded-xl border border-border bg-white p-6 md:grid-cols-2">
            <div>
              <h2 className="flex items-center gap-2 text-xs font-semibold">
                <Database className="size-4 text-primary" />
                Data & privacy
              </h2>
              <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
                Only synthetic case references are accepted. Files are decoded, re-encoded without original EXIF data, and stored privately
                using generated filenames. Unsaved analysis drafts expire after 24 hours and are cleaned up on backend startup.
              </p>
            </div>
            <div>
              <h2 className="flex items-center gap-2 text-xs font-semibold">
                <LockKeyhole className="size-4 text-primary" />
                Access & deployment
              </h2>
              <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
                Permanent deletion is{' '}
                {data.deletion_enabled ? 'enabled with administrator-key authorization' : 'locked until an administrator key is configured'}
                . This shared demo has no user authentication or clinical role permissions. Add authentication, role-based access, encrypted
                storage, auditing, and a clinical safety review before processing real data.
              </p>
            </div>
          </section>
          <SafetyDisclaimer prominent />
        </>
      )}
    </>
  )
}
