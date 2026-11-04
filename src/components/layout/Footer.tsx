import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
export function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-5 text-[10px] text-muted-foreground sm:px-8">
      <p>
        © {new Date().getFullYear()} RetinaAI <span className="mx-1.5 text-border">|</span> Clarity through responsible AI.
      </p>
      <div className="flex items-center gap-5">
        <Link to="/model" className="hover:text-primary">
          Research use only
        </Link>
        <Link to="/education" className="flex items-center gap-1.5 hover:text-primary">
          <ShieldCheck className="size-3" />
          Safety & education
        </Link>
      </div>
    </footer>
  )
}
