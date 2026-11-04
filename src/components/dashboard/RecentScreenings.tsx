import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ScreeningHistory } from '../screening/ScreeningHistory'
import type { ScreeningRecord } from '../../types/screening'
export function RecentScreenings({ records }: { records: ScreeningRecord[] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-xs shadow-black/[0.015]">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="text-[13px] font-semibold">Recent screenings</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Your latest saved research records, at a glance.</p>
        </div>
        <Link to="/history" className="flex items-center gap-2 text-[10px] font-semibold text-primary">
          View all records
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <ScreeningHistory records={records} compact />
    </section>
  )
}
