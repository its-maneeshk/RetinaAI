import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import { LockKeyhole } from 'lucide-react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { ErrorMessage } from '../common/ErrorMessage'
import { deleteScreening } from '../../services/screeningService'
import { errorMessage } from '../../services/api'
export function DeleteScreeningModal({ recordId, onClose, enabled }: { recordId: string; onClose: () => void; enabled: boolean }) {
  const [key, setKey] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { mutate } = useSWRConfig()
  const navigate = useNavigate()
  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!key || !confirmed || !enabled) return
    setBusy(true)
    setError(null)
    try {
      await deleteScreening(recordId, key)
      setKey('')
      await mutate((cacheKey) => typeof cacheKey === 'string' && (cacheKey.startsWith('/dashboard') || cacheKey.startsWith('/screening/')))
      navigate('/history')
    } catch (caught: unknown) {
      setError(errorMessage(caught))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal
      title="Permanently delete screening?"
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <form onSubmit={(event) => void remove(event)} className="flex flex-col gap-4">
        <p className="text-xs leading-6 text-muted-foreground">
          This removes <strong className="text-foreground">{recordId}</strong> and its privately stored source image. This operation cannot
          be undone.
        </p>
        {enabled ? (
          <>
            <label className="text-xs font-medium" htmlFor="admin-key">
              Administrator key
              <input
                id="admin-key"
                type="password"
                autoComplete="off"
                required
                value={key}
                onChange={(event) => setKey(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-lg border border-input px-3 outline-primary"
              />
            </label>
            <label className="flex items-start gap-2 text-xs leading-5">
              <input
                type="checkbox"
                required
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              I understand this permanently deletes the record and image.
            </label>
          </>
        ) : (
          <p className="flex gap-2 rounded-lg bg-warning-light p-3 text-xs leading-6 text-warning-foreground">
            <LockKeyhole className="mt-1 size-4 shrink-0" />
            Deletion is locked. The operator must configure API_ADMIN_KEY in the backend environment to enable authorized deletion. No key
            is stored in your browser.
          </p>
        )}
        {error && <ErrorMessage message={error} />}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={busy} disabled={!enabled || !key || !confirmed}>
            Delete permanently
          </Button>
        </div>
      </form>
    </Modal>
  )
}
