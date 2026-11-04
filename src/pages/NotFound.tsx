import { Link } from 'react-router-dom'
import { Eye, ArrowLeft } from 'lucide-react'
import { buttonClass } from '../components/common/Button'
export function NotFound() {
  return (
    <section className="flex min-h-[60dvh] flex-col items-center justify-center gap-5 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Eye className="size-8" />
      </span>
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground">404 · A LITTLE OUT OF FOCUS</span>
      <h1 className="text-2xl font-semibold tracking-tight">Let’s find a clearer path.</h1>
      <p className="max-w-sm text-sm leading-7 text-muted-foreground">
        This page isn’t part of your workspace. Your overview is a good place to start.
      </p>
      <Link to="/" className={buttonClass()}>
        <ArrowLeft className="size-4" />
        Back to overview
      </Link>
    </section>
  )
}
