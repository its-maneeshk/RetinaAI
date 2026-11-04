import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Eye, ArrowUpRight, ShieldCheck, ArrowRight, ChevronDown, CircleHelp, ScanEye } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { buttonClass } from '../components/common/Button'
import { SafetyDisclaimer } from '../components/screening/SafetyDisclaimer'
import { clsx } from 'clsx'
const grades = [
  {
    name: 'No DR',
    summary: 'No apparent retinopathy',
    text: 'In established clinical grading, grade 0 describes no visible features of diabetic retinopathy in the assessed images. It does not rule out other eye disease. A simulated demo grade cannot establish the absence of disease.',
  },
  {
    name: 'Mild DR',
    summary: 'Mild non-proliferative changes',
    text: 'Mild non-proliferative diabetic retinopathy typically involves microaneurysms. Professional assessment is needed to interpret retinal features and decide on appropriate monitoring.',
  },
  {
    name: 'Moderate DR',
    summary: 'More extensive retinal changes',
    text: 'Moderate non-proliferative diabetic retinopathy involves changes beyond microaneurysms alone, but less than severe disease. Assessment must include clinical context and a qualified eye care professional.',
  },
  {
    name: 'Severe DR',
    summary: 'Extensive non-proliferative changes',
    text: 'Severe non-proliferative diabetic retinopathy has extensive retinal vascular changes and a higher risk of progression. Diagnosis and follow-up decisions belong to qualified ophthalmologists, not this prototype.',
  },
  {
    name: 'Proliferative DR',
    summary: 'Abnormal new blood vessel growth',
    text: 'Proliferative diabetic retinopathy involves abnormal new blood vessels and may threaten vision. It requires specialist examination. A demo model label provides no evidence of these findings.',
  },
]
export function Education() {
  const [selected, setSelected] = useState(0)
  return (
    <>
      <PageHeader
        eyebrow="THE LEARNING CENTER"
        title="Understanding starts with awareness."
        description="A little knowledge about retinal health can make a meaningful difference."
      />
      <section className="grid overflow-hidden rounded-2xl border border-primary/15 bg-primary-light/70 md:grid-cols-[1fr_260px]">
        <div className="p-6 sm:p-8">
          <span className="mb-4 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-primary">
            <BookOpen className="size-3.5" />
            RETINAL HEALTH, SIMPLIFIED
          </span>
          <h2 className="text-2xl font-medium tracking-tight">What is diabetic retinopathy?</h2>
          <p className="mt-4 max-w-2xl text-xs leading-7 text-muted-foreground">
            Diabetic retinopathy is an eye condition caused by damage to the blood vessels in the retina—the light-sensitive tissue at the
            back of the eye. It can develop in people with diabetes and may not cause noticeable symptoms in its early stages.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-7 text-muted-foreground">
            Regular eye examinations are important. AI screening research can explore image patterns, but it never replaces a comprehensive
            examination by a qualified eye care professional.
          </p>
        </div>
        <div className="hidden flex-col items-center justify-center gap-4 border-l border-primary/10 bg-white/40 p-7 md:flex">
          <span className="flex size-20 items-center justify-center rounded-full border border-primary/15 bg-white/60 text-primary">
            <Eye className="size-10" strokeWidth={1.2} />
          </span>
          <p className="text-center text-[11px] leading-6 text-primary-dark">
            Healthy vision.
            <br />
            <strong>Informed perspectives.</strong>
          </p>
        </div>
      </section>
      <section className="rounded-xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ScanEye className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Five grades, explained</h2>
        </div>
        <p className="mt-2 text-[11px] leading-6 text-muted-foreground">
          These descriptions explain a common clinical severity scale. They are not interpretations of demo output.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5" role="group" aria-label="Explore diabetic retinopathy grades">
          {grades.map((grade, index) => (
            <button
              key={grade.name}
              onClick={() => setSelected(index)}
              aria-pressed={selected === index}
              className={clsx(
                'flex min-h-24 flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors',
                selected === index
                  ? 'border-primary bg-primary-light text-primary'
                  : 'border-border bg-white text-muted-foreground hover:bg-muted',
              )}
            >
              <span className="text-[9px] font-semibold">GRADE {index}</span>
              <span className="text-xs font-semibold">{grade.name}</span>
            </button>
          ))}
        </div>
        <div aria-live="polite" className="mt-4 rounded-xl bg-muted p-5">
          <h3 className="text-sm font-semibold">{grades[selected].summary}</h3>
          <p className="mt-2 text-xs leading-7 text-muted-foreground">{grades[selected].text}</p>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CircleHelp className="size-4 text-primary" />A few important questions
          </h2>
          {[
            {
              question: 'Can this demo tell me if I have DR?',
              answer:
                'No. The demo model is untrained, and its outputs have no medical meaning. Consult a qualified ophthalmologist for assessment.',
            },
            {
              question: 'What do the image quality checks mean?',
              answer:
                'They test basic file properties, brightness, and sharpness. They cannot confirm that an image is retinal or clinically suitable.',
            },
            {
              question: 'What if I notice a change in my vision?',
              answer:
                'Seek advice from a qualified healthcare professional. Sudden loss of vision or new severe visual symptoms need urgent medical attention. Do not wait for or rely on this application.',
            },
          ].map((item) => (
            <details key={item.question} className="group border-b border-border py-4 last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-medium">
                {item.question}
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[11px] leading-6 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </section>
        <section className="flex flex-col rounded-xl border border-border bg-white p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-primary" />
            Learn from trusted sources
          </h2>
          <p className="mt-3 text-[11px] leading-6 text-muted-foreground">
            Continue your reading with established public health and eye research organizations.
          </p>
          {[
            {
              title: 'National Eye Institute',
              description: 'Diabetic retinopathy: causes, screening, and treatment',
              href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy',
            },
            {
              title: 'NIDDK · National Institutes of Health',
              description: 'Understanding diabetic eye disease',
              href: 'https://www.niddk.nih.gov/health-information/diabetes/overview/preventing-problems/diabetic-eye-disease',
            },
          ].map((source) => (
            <a
              key={source.title}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary/30 hover:bg-muted"
            >
              <div className="flex-1">
                <h3 className="text-[11px] font-semibold">{source.title}</h3>
                <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{source.description}</p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-primary" />
              <span className="sr-only">Opens in a new tab</span>
            </a>
          ))}
          <p className="mt-auto pt-5 text-[9px] leading-5 text-muted-foreground">
            General educational content, not personalized medical advice.
          </p>
        </section>
      </div>
      <SafetyDisclaimer />
      <Link to="/screening" className={`${buttonClass()} self-start`}>
        Explore a synthetic screening
        <ArrowRight className="size-3.5" />
      </Link>
    </>
  )
}
