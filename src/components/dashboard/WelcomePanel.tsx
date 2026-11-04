import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, ScanLine, Sparkles } from 'lucide-react'
import { buttonClass } from '../common/Button'
export function WelcomePanel() {
  return (
    <section
      aria-labelledby="welcome-heading"
      className="relative flex min-h-[230px] overflow-hidden rounded-2xl border border-[#dce9df] bg-[#edf4ee]"
    >
      <div className="relative z-10 flex flex-1 flex-col items-start justify-center p-6 sm:p-7">
        <p className="mb-3 flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.14em] text-primary">
          <Sparkles className="size-3" />A CLEARER PERSPECTIVE
        </p>
        <h2 id="welcome-heading" className="text-[26px] leading-[1.2] font-medium tracking-[-0.04em] text-[#254d3c] sm:text-[30px]">
          Better insights.
          <br />
          More informed care.
        </h2>
        <p className="mt-3 max-w-[330px] text-[11px] leading-[1.8] text-muted-foreground">
          A thoughtful approach to retinal screening.
          <br className="hidden sm:block" /> Upload, explore, and understand—with AI as your support.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <Link to="/screening" className={buttonClass()}>
            <ScanLine className="size-3.5" />
            Start a screening
            <ArrowRight className="ml-2 size-3.5" />
          </Link>
          <Link to="/education" className="flex items-center gap-1 text-[11px] font-medium text-primary">
            How it works
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
      <div className="relative hidden w-[36%] min-w-[265px] items-center justify-center overflow-hidden bg-[#e3eee4] md:flex">
        <div className="absolute -right-14 -bottom-32 size-[440px] rounded-full border border-primary/10" />
        <div className="absolute -right-4 -bottom-24 size-[350px] rounded-full border border-primary/10" />
        <div className="absolute -right-3 -top-16 size-60 rounded-full bg-white/20" />
        <div className="relative flex flex-col items-center">
          <div className="relative rounded-full border border-primary/15 p-3">
            <span className="absolute top-2 right-4 rounded-full border border-white bg-primary p-1.5 text-white shadow-sm">
              <ScanLine className="size-3.5" />
            </span>
            <div className="rounded-full border-[5px] border-white/80 bg-[#072e25] p-1.5 shadow-lg shadow-primary/10">
              <img
                src="/images/retina-demo.png"
                alt="Synthetic educational illustration of a retinal fundus"
                className="size-[146px] rounded-full object-cover"
              />
            </div>
          </div>
          <span className="mt-3 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[8px] font-medium tracking-[0.06em] text-primary">
            SYNTHETIC RETINAL ILLUSTRATION
          </span>
        </div>
      </div>
    </section>
  )
}
