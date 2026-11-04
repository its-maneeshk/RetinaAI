import { api } from './api'
import type { CaseMetadata, ScreeningRecord } from '../types/screening'

export async function analyzeImage(file: File, metadata: CaseMetadata, signal?: AbortSignal): Promise<ScreeningRecord> {
  const form = new FormData()
  form.append('image', file)
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== '') form.append(key, value)
  })
  return api<ScreeningRecord>('/screening/analyze', { method: 'POST', body: form, signal })
}
export const saveScreening = (recordId: string) =>
  api<ScreeningRecord>('/screening/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ record_id: recordId }),
  })
export const deleteScreening = (recordId: string, adminKey: string) =>
  api<void>(`/screening/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': adminKey },
  })
