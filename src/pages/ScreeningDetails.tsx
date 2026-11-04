import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { ArrowLeft, Trash2, LockKeyhole, Save } from 'lucide-react'
import { api, errorMessage } from '../services/api'
import { saveScreening } from '../services/screeningService'
import type { HealthResponse, ScreeningRecord } from '../types/screening'
import { PageHeader } from '../components/common/PageHeader'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { Button, buttonClass } from '../components/common/Button'
import { PredictionResultCard } from '../components/screening/PredictionResultCard'
import { DeleteScreeningModal } from '../components/screening/DeleteScreeningModal'
export function ScreeningDetails() {
  const { recordId } = useParams()
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const { data, error, mutate } = useSWR<ScreeningRecord>(recordId ? `/screening/${encodeURIComponent(recordId)}` : null, api)
  const { data: health } = useSWR<HealthResponse>('/health', api)
  async function saveDraft() {
    if (!data) return
    setSaving(true)
    setSaveError(null)
    try {
      await mutate(await saveScreening(data.record_id))
    } catch (caught: unknown) {
      setSaveError(errorMessage(caught))
    } finally {
      setSaving(false)
    }
  }
  return (
    <>
      <Link
        to="/history"
        className="inline-flex items-center gap-2 self-start text-[11px] font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-3.5" />
        Back to screening history
      </Link>
      <PageHeader
        eyebrow="SCREENING RECORD"
        title={data?.record_id ?? 'Screening details'}
        description="A complete view of this synthetic research screening."
        actions={
          data && (
            <Button variant="secondary" onClick={() => setDeleting(true)}>
              <Trash2 className="size-3.5" />
              Delete record
            </Button>
          )
        }
      />
      {error ? (
        <ErrorMessage message={errorMessage(error)} retry={() => void mutate()} />
      ) : !data ? (
        <LoadingSpinner />
      ) : (
        <>
          <section className="rounded-xl border border-border bg-white p-5">
            <dl className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {[
                ['Synthetic patient reference', data.patient_reference],
                ['Case ID', data.case_id],
                ['Age', data.age === null ? 'Not provided' : `${data.age} years`],
                ['Eye', data.eye === 'UNSPECIFIED' ? 'Not specified' : data.eye === 'LEFT' ? 'Left (OS)' : 'Right (OD)'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] text-muted-foreground">{label}</dt>
                  <dd className="mt-2 text-xs font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-[10px] leading-5 text-muted-foreground">
              <LockKeyhole className="size-3 shrink-0" />
              {data.image_available
                ? 'Source image stored privately on the backend; not publicly accessible.'
                : 'Preloaded synthetic example. No source image was uploaded or analyzed.'}
            </p>
          </section>
          <PredictionResultCard result={data} />
          {!data.is_saved && (
            <Button onClick={() => void saveDraft()} loading={saving} className="self-end">
              <Save className="size-4" />
              Save analysis draft
            </Button>
          )}
          {saveError && <ErrorMessage message={saveError} />}
          <Link to="/screening" className={`${buttonClass('secondary')} self-start`}>
            Start a new screening
          </Link>
          {deleting && (
            <DeleteScreeningModal
              recordId={data.record_id}
              enabled={health?.deletion_enabled ?? false}
              onClose={() => setDeleting(false)}
            />
          )}
        </>
      )}
    </>
  )
}
