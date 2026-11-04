import { GRADE_LABELS, type ScreeningRecord } from '../../types/screening'
export function PredictionConfidence({ result }: { result: ScreeningRecord }) {
  return (
    <section className="rounded-xl border border-border bg-white p-5">
      <h3 className="text-[13px] font-semibold">{result.is_demo ? 'Simulated demo scores' : 'Uncalibrated model scores'}</h3>
      <p className="mt-1 text-[10px] leading-5 text-muted-foreground">
        {result.is_demo
          ? 'Illustrates the output format. These are not clinically validated confidence measurements.'
          : 'Softmax scores are not probabilities of disease and are not a validated confidence measurement.'}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        {GRADE_LABELS.map((label, grade) => {
          const score = result.probabilities[grade] ?? 0
          return (
            <div key={label}>
              <div className="mb-1.5 flex justify-between text-[10px]">
                <span className={result.predicted_grade === grade ? 'font-semibold text-primary' : 'text-muted-foreground'}>
                  Grade {grade} · {label}
                </span>
                <span className="font-medium tabular-nums">{(score * 100).toFixed(1)}%</span>
              </div>
              <svg
                viewBox="0 0 100 2"
                preserveAspectRatio="none"
                className="h-1.5 w-full overflow-hidden rounded-full"
                role="img"
                aria-label={`${label}: ${(score * 100).toFixed(1)} percent ${result.is_demo ? 'simulated' : 'model'} score`}
              >
                <rect width="100" height="2" className="fill-muted" />
                <rect width={score * 100} height="2" className={result.predicted_grade === grade ? 'fill-primary' : 'fill-[#bdd7c7]'} />
              </svg>
            </div>
          )
        })}
      </div>
    </section>
  )
}
