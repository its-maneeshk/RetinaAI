import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Download, Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { api, errorMessage } from '../services/api'
import { exportScreenings } from '../services/exportService'
import type { HistoryResponse } from '../types/screening'
import { GRADE_LABELS } from '../types/screening'
import { PageHeader } from '../components/common/PageHeader'
import { Button, buttonClass } from '../components/common/Button'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { ScreeningHistory } from '../components/screening/ScreeningHistory'
import { SafetyDisclaimer } from '../components/screening/SafetyDisclaimer'
export function ScreeningHistoryPage() {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [grade, setGrade] = useState('')
  const [quality, setQuality] = useState('')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const filters = new URLSearchParams({ search: deferredSearch, sort })
  if (grade) filters.set('grade', grade)
  if (quality) filters.set('quality', quality)
  const { data, error, mutate } = useSWR<HistoryResponse>(`/screening/history?${filters.toString()}&page=${page}`, api)
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / 10))
  async function exportRecords() {
    setExporting(true)
    setExportError(null)
    try {
      await exportScreenings(filters)
    } catch (caught: unknown) {
      setExportError(errorMessage(caught))
    } finally {
      setExporting(false)
    }
  }
  const selectClass = 'min-h-10 rounded-lg border border-border bg-white px-3 py-2 text-[11px] text-muted-foreground outline-primary'
  return (
    <>
      <PageHeader
        eyebrow="YOUR RESEARCH RECORDS"
        title="Every screening, in perspective."
        description="Find, review, and revisit your saved synthetic screening records."
        actions={
          <>
            <Button variant="secondary" onClick={() => void exportRecords()} loading={exporting} disabled={!data?.total}>
              <Download className="size-3.5" />
              Export CSV
            </Button>
            <Link to="/screening" className={buttonClass()}>
              <Plus className="size-4" />
              New screening
            </Link>
          </>
        }
      />
      <div className="rounded-xl border border-warning-border bg-warning-light px-4 py-3 text-[11px] leading-5 text-warning-foreground">
        <strong>Research records only.</strong> Demo classifications and scores are simulated. Preloaded examples are marked with model
        version dummy-v1-fixture; no image was analyzed for these records.
      </div>
      <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex flex-wrap items-center gap-3 p-5">
          <div className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground" />
            <label htmlFor="history-search" className="sr-only">
              Search case ID or synthetic reference
            </label>
            <input
              id="history-search"
              value={search}
              maxLength={64}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Search case ID or patient reference…"
              className="min-h-10 w-full rounded-lg border border-border py-2 pr-8 pl-9 text-[11px] outline-primary placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  setPage(1)
                }}
                aria-label="Clear search"
                className="absolute top-2 right-2 flex size-6 items-center justify-center text-muted-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          <SlidersHorizontal className="hidden size-4 text-muted-foreground sm:block" />
          <label>
            <span className="sr-only">Filter classification</span>
            <select
              value={grade}
              onChange={(event) => {
                setGrade(event.target.value)
                setPage(1)
              }}
              className={selectClass}
            >
              <option value="">All classifications</option>
              {GRADE_LABELS.map((label, index) => (
                <option key={label} value={index}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter image quality</span>
            <select
              value={quality}
              onChange={(event) => {
                setQuality(event.target.value)
                setPage(1)
              }}
              className={selectClass}
            >
              <option value="">All image quality</option>
              <option value="ACCEPTABLE">Passed checks</option>
              <option value="WARNING">Needs quality review</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort records</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value)
                setPage(1)
              }}
              className={selectClass}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        {error ? (
          <div className="p-5">
            <ErrorMessage message={errorMessage(error)} retry={() => void mutate()} />
          </div>
        ) : !data ? (
          <LoadingSpinner label="Loading screening records…" />
        ) : (
          <>
            <ScreeningHistory records={data.records} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
              <p aria-live="polite" className="text-[10px] text-muted-foreground">
                {data.total
                  ? `Showing ${(page - 1) * 10 + 1}–${Math.min(page * 10, data.total)} of ${data.total} records`
                  : '0 matching records'}
              </p>
              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-[10px] text-muted-foreground">
                  Page {page} of {pages}
                </span>
                <Button variant="secondary" onClick={() => setPage(page + 1)} disabled={page >= pages} aria-label="Next page">
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
      {exportError && <ErrorMessage message={exportError} />}
      <SafetyDisclaimer />
    </>
  )
}
