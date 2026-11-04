import { useState } from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Plus, CalendarDays, ScanLine, CircleCheck, Timer, Layers } from 'lucide-react'
import { api, errorMessage } from '../services/api'
import type { DashboardResponse } from '../types/screening'
import { PageHeader } from '../components/common/PageHeader'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { ErrorMessage } from '../components/common/ErrorMessage'
import { buttonClass } from '../components/common/Button'
import { WelcomePanel } from '../components/dashboard/WelcomePanel'
import { StatCard } from '../components/dashboard/StatCard'
import { ScreeningChart } from '../components/dashboard/ScreeningChart'
import { GradeDistribution } from '../components/dashboard/GradeDistribution'
import { RecentScreenings } from '../components/dashboard/RecentScreenings'
import { DemoBanner, SafetyDisclaimer } from '../components/screening/SafetyDisclaimer'
export function Dashboard() {
  const [days, setDays] = useState(30)
  const { data, error, mutate } = useSWR<DashboardResponse>(`/dashboard?days=${days}`, api)
  return (
    <>
      <PageHeader
        eyebrow="YOUR SCREENING WORKSPACE"
        title="A clearer view of retinal health."
        description="Welcome to RetinaAI. Let’s make every screening a step toward understanding."
        actions={
          <>
            <span className="hidden items-center gap-1.5 text-[10px] text-muted-foreground xl:flex">
              <CalendarDays className="size-3.5" />
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <Link to="/screening" className={buttonClass()}>
              <Plus className="size-4" />
              New screening
            </Link>
          </>
        }
      />
      <WelcomePanel />
      {data?.model_type !== 'TRAINED' && <DemoBanner />}
      {error ? (
        <ErrorMessage message={errorMessage(error)} retry={() => void mutate()} />
      ) : !data ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard
              title="Total screenings"
              value={String(data.total)}
              description="Saved synthetic research records"
              icon={ScanLine}
              detail="All time"
            />
            <StatCard
              title="Screenings this week"
              value={String(data.this_week)}
              description="A week of learning and discovery"
              icon={Layers}
            />
            <StatCard
              title="Technical check pass rate"
              value={`${data.quality_pass_rate}%`}
              description="Basic image checks, not clinical quality"
              icon={CircleCheck}
            />
            <StatCard
              title="Average analysis time"
              value={data.average_analysis_ms > 0 ? `${(data.average_analysis_ms / 1000).toFixed(1)}s` : '—'}
              description={data.average_analysis_ms > 0 ? 'Measured inference pipeline processing' : 'Run & save a screening to measure'}
              icon={Timer}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            <ScreeningChart activity={data.activity} days={days} onDaysChange={setDays} />
            <GradeDistribution distribution={data.distribution} isDemo={data.model_type === 'DEMO'} />
          </div>
          <RecentScreenings records={data.recent} />
        </>
      )}
      <SafetyDisclaimer />
    </>
  )
}
