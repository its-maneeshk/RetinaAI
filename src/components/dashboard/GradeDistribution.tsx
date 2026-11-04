import { GRADE_LABELS, type Grade } from '../../types/screening'
const strokes = ['stroke-primary', 'stroke-[#80b696]', 'stroke-[#d9b969]', 'stroke-[#d39165]', 'stroke-[#b97068]']
const dots = ['bg-primary', 'bg-[#80b696]', 'bg-[#d9b969]', 'bg-[#d39165]', 'bg-[#b97068]']
export function GradeDistribution({ distribution, isDemo = true }: { distribution: { grade: Grade; count: number }[]; isDemo?: boolean }) {
  const total = distribution.reduce((sum, item) => sum + item.count, 0)
  const radius = 47
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-xs shadow-black/[0.015]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold">{isDemo ? 'Demo grade distribution' : 'Research grade distribution'}</h2>
        <span className="rounded bg-muted px-1.5 py-1 text-[8px] text-muted-foreground">All time</span>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">
        {isDemo ? 'Simulated outputs, not clinical findings.' : 'Research estimates, not clinical diagnoses.'}
      </p>
      <div className="mt-3 flex items-center justify-center gap-5 xl:gap-7">
        <div className="relative size-[143px] shrink-0">
          <svg viewBox="0 0 120 120" role="img" aria-label="Distribution of five simulated demo grades" className="size-full -rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" className="stroke-muted" strokeWidth="13" />
            {distribution.map((item) => {
              const length = total ? (item.count / total) * circumference : 0
              const previous = offset
              offset += length
              return (
                <circle
                  key={item.grade}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  strokeWidth="13"
                  strokeDasharray={`${Math.max(0, length - 3)} ${circumference}`}
                  strokeDashoffset={-previous}
                  className={strokes[item.grade]}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[25px] font-semibold leading-none tracking-tight">{total}</span>
            <span className="mt-2 text-[8px] text-muted-foreground">demo screenings</span>
          </div>
        </div>
        <ul className="flex min-w-[120px] flex-1 flex-col gap-3">
          {distribution.map((item) => (
            <li key={item.grade} className="flex items-center gap-2 text-[9px]">
              <span className={`size-1.5 rounded-full ${dots[item.grade]}`} />
              <span className="flex-1 text-muted-foreground">{GRADE_LABELS[item.grade]}</span>
              <span className="font-semibold tabular-nums">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 border-t border-border pt-3 text-[9px] text-muted-foreground">Five grades. One goal: responsible exploration.</p>
    </section>
  )
}
