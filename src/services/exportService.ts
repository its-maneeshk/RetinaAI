import { api } from './api'
import type { HistoryResponse, ScreeningRecord } from '../types/screening'
function csvCell(value: string | number): string {
  const text = String(value)
  const safe = /^[=+\-@\t\r\n]/.test(text) ? `'${text}` : text
  return `"${safe.replaceAll('"', '""')}"`
}
export async function exportScreenings(filters: URLSearchParams): Promise<void> {
  const parameters = new URLSearchParams(filters)
  parameters.set('page_size', '100')
  let records: ScreeningRecord[] = []
  let total = 0
  for (let page = 1; page <= 100; page += 1) {
    parameters.set('page', String(page))
    const response = await api<HistoryResponse>(`/screening/history?${parameters.toString()}`)
    total = response.total
    records = records.concat(response.records)
    if (records.length >= total || response.records.length === 0) break
  }
  if (total > 10000) throw new Error('Refine your filters to export fewer than 10,000 records.')
  const headings = [
    'Record ID',
    'Synthetic patient reference',
    'Date',
    'Grade',
    'Classification',
    'Model score (not clinical confidence)',
    'Model type',
    'Model version',
    'Quality status',
    'Safety notice',
  ]
  const rows = records.map((record) => [
    record.record_id,
    record.patient_reference,
    record.timestamp,
    record.predicted_grade,
    record.predicted_label,
    record.model_score,
    record.model_type,
    record.model_version,
    record.quality_status,
    record.is_demo ? 'DEMO OUTPUT: simulated, no clinical meaning; not a diagnosis' : 'Research estimate only; not a clinical diagnosis',
  ])
  const csv = [headings, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `retinaai-research-records-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
