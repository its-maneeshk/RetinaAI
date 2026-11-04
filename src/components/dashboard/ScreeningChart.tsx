import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ActivityPoint } from '../../types/screening'
export function ScreeningChart({
  activity,
  days,
  onDaysChange,
}: {
  activity: ActivityPoint[]
  days: number
  onDaysChange: (days: number) => void
}) {
  const [hovered, setHovered] = useState<ActivityPoint | null>(null)
  const max = Math.max(4, ...activity.map((point) => point.count))
  const total = activity.reduce((sum, point) => sum + point.count, 0)
  return (
    <section
      className="min-w-0 rounded-xl border border-border bg-white p-5 shadow-xs shadow-black/[0.015]"
      aria-label="Screening activity chart"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold">Screening activity</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">A little progress, every day.</p>
        </div>
        <div className="relative">
          <label htmlFor="chart-period" className="sr-only">
            Activity period
          </label>
          <select
            id="chart-period"
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="min-h-8 appearance-none rounded-md border border-border bg-white py-1.5 pr-7 pl-2.5 text-[9px] text-muted-foreground"
          >
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-2.5 right-2 size-3 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-[24px] font-semibold tracking-tight">{total}</span>
        <span className="text-[9px] text-muted-foreground">saved screenings</span>
        <span aria-live="polite" className="ml-auto text-[9px] text-primary">
          {hovered
            ? `${new Date(hovered.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${hovered.count}`
            : 'Synthetic research data'}
        </span>
      </div>
      <div className="mt-3">
        <svg
          viewBox="0 0 570 138"
          role="img"
          aria-label={`${total} synthetic screenings over the last ${days} days`}
          className="h-[139px] w-full overflow-visible"
        >
          <title>Saved synthetic screenings per day</title>
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <line
                x1="24"
                x2="565"
                y1={12 + row * 32}
                y2={12 + row * 32}
                className="stroke-border"
                strokeDasharray="3 4"
                strokeWidth="0.7"
              />
              <text x="0" y={15 + row * 32} className="fill-muted-foreground text-[8px]">
                {Math.round(max * (1 - row / 3))}
              </text>
            </g>
          ))}
          {activity.map((point, index) => {
            const width = 530 / activity.length
            const height = (point.count / max) * 88
            return (
              <g key={point.date} onMouseEnter={() => setHovered(point)} onMouseLeave={() => setHovered(null)}>
                <rect
                  x={28 + index * width}
                  y={105 - Math.max(height, 2)}
                  width={Math.max(width - 5, 3)}
                  height={Math.max(height, 2)}
                  rx="2.5"
                  className={index >= activity.length - 6 ? 'fill-primary' : 'fill-[#b4d3c0]'}
                >
                  <title>
                    {point.date}: {point.count} synthetic screenings
                  </title>
                </rect>
              </g>
            )
          })}
          {activity
            .filter((_, index) => index % Math.max(1, Math.floor(activity.length / 5)) === 0)
            .map((point) => (
              <text
                key={point.date}
                x={28 + activity.indexOf(point) * (530 / activity.length)}
                y="132"
                className="fill-muted-foreground text-[8px]"
              >
                {new Date(point.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            ))}
        </svg>
      </div>
    </section>
  )
}
