import { Link } from 'react-router-dom'
import { ArrowUpRight, Eye, ScanLine } from 'lucide-react'
import { GradeBadge, QualityBadge, ModelBadge } from '../common/StatusBadge'
import { formatDate } from '../../utils/imageValidation'
import type { ScreeningRecord } from '../../types/screening'
export function ScreeningHistory({ records, compact = false }: { records: ScreeningRecord[]; compact?: boolean }) {
  if (!records.length)
    return (
      <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
          <ScanLine className="size-6" />
        </span>
        <h3 className="text-sm font-semibold">A clear place to begin</h3>
        <p className="max-w-xs text-xs leading-6 text-muted-foreground">
          No saved screenings match your filters. Start a new screening or adjust your search.
        </p>
        <Link to="/screening" className="mt-1 text-xs font-semibold text-primary">
          Start a screening →
        </Link>
      </div>
    )
  return (
    <div
      role="region"
      aria-label="Screening records, horizontally scrollable"
      tabIndex={0}
      className="relative w-full overflow-x-auto outline-primary"
    >
      <table className="w-full whitespace-nowrap text-left text-[10px]">
        <caption className="sr-only">Saved retinal screening records. Demo grades and scores are simulated.</caption>
        <thead className="border-y border-border bg-background/80 text-[9px] font-medium text-muted-foreground">
          <tr>
            <th scope="col" className="py-3 pl-5 pr-4 font-medium">
              Case ID
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Patient reference
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Classification estimate
            </th>
            {!compact && (
              <th scope="col" className="px-4 py-3 font-medium">
                Model score
              </th>
            )}
            <th scope="col" className="px-4 py-3 font-medium">
              Image quality
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Model
            </th>
            <th scope="col" className="py-3 pr-5 text-right font-medium">
              <span className="sr-only">Open record</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.record_id} className="border-b border-border last:border-0 hover:bg-muted/50">
              <td className="py-3.5 pl-5 pr-4">
                <Link
                  to={`/history/${record.record_id}`}
                  className="flex items-center gap-2 font-semibold text-foreground hover:text-primary"
                >
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary-light/60 text-primary">
                    <Eye className="size-3.5" strokeWidth={1.6} />
                  </span>
                  {record.record_id}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-muted-foreground">{record.patient_reference}</td>
              <td className="px-4 py-3.5 text-muted-foreground">{formatDate(record.timestamp)}</td>
              <td className="px-4 py-3.5">
                <GradeBadge grade={record.predicted_grade} label={record.predicted_label} />
              </td>
              {!compact && (
                <td className="px-4 py-3.5 text-muted-foreground">
                  {Math.round(record.model_score * 100)}% <span className="text-[8px]">{record.is_demo ? '(demo)' : '(uncalibrated)'}</span>
                </td>
              )}
              <td className="px-4 py-3.5">
                <QualityBadge status={record.quality_status} />
              </td>
              <td className="px-4 py-3.5">
                <ModelBadge isDemo={record.is_demo} />
              </td>
              <td className="pr-5 text-right">
                <Link
                  to={`/history/${record.record_id}`}
                  aria-label={`Open screening ${record.record_id}`}
                  className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary-light hover:text-primary"
                >
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
