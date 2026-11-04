import { useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, ScanLine, History, BookOpen, Cpu, ArrowUpRight, Eye, ShieldCheck, X } from 'lucide-react'
import { clsx } from 'clsx'
const workspaceLinks = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/screening', label: 'New screening', icon: ScanLine },
  { to: '/history', label: 'Screening history', icon: History },
]
const resourceLinks = [
  { to: '/education', label: 'Learning center', icon: BookOpen },
  { to: '/model', label: 'System & model', icon: Cpu },
]
export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const asideRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const focusable = () => Array.from(asideRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? [])
    focusable()[0]?.focus()
    document.body.classList.add('overflow-hidden')
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key === 'Tab') {
        const items = focusable()
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault()
          items.at(-1)?.focus()
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault()
          items[0]?.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('overflow-hidden')
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open, onClose])
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        aria-label="Main navigation"
        role={open ? 'dialog' : undefined}
        aria-modal={open || undefined}
        ref={asideRef}
        className={clsx('fixed inset-y-0 left-0 z-50 w-[236px] flex-col border-r border-border bg-white', open ? 'flex' : 'hidden lg:flex')}
      >
        <div className="flex h-[82px] shrink-0 items-center justify-between px-6">
          <Link to="/" onClick={onClose} aria-label="RetinaAI home" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[11px] bg-primary text-white">
              <Eye className="size-6" strokeWidth={1.7} />
            </span>
            <span className="text-[24px] font-semibold tracking-[-0.06em]">
              Retina<span className="text-primary">AI</span>
              <span className="ml-0.5 align-top text-[10px] text-primary">®</span>
            </span>
          </Link>
          <button onClick={onClose} aria-label="Close navigation" className="rounded p-1 lg:hidden">
            <X className="size-5" />
          </button>
        </div>
        <div className="mx-4 mb-7 flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-white text-primary">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold">Research workspace</p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">Educational prototype</p>
          </div>
          <span className="ml-auto size-1.5 rounded-full bg-primary" />
        </div>
        <nav className="flex flex-col gap-7 px-3.5">
          {[
            { title: 'WORKSPACE', links: workspaceLinks },
            { title: 'RESOURCES', links: resourceLinks },
          ].map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[9px] font-semibold tracking-[0.12em] text-muted-foreground">{group.title}</p>
              <ul className="flex flex-col gap-1">
                {group.links.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        clsx(
                          'flex min-h-11 items-center gap-3 rounded-lg px-3 text-[12px] font-medium transition-colors',
                          isActive
                            ? 'bg-primary-light font-semibold text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      <Icon className="size-[17px]" strokeWidth={1.7} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="mt-auto px-4 pt-10">
          <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-primary-light/70 p-4">
            <span className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-primary">
              <BookOpen className="size-4" />
            </span>
            <p className="text-xs font-semibold leading-relaxed">
              A little knowledge.
              <br />A clearer perspective.
            </p>
            <p className="mt-2 text-[10px] leading-[1.7] text-muted-foreground">Explore the essentials of diabetic retinopathy.</p>
            <Link to="/education" onClick={onClose} className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold text-primary">
              Visit learning center
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
        <div className="mx-4 mt-5 flex items-center gap-2 border-t border-border py-5">
          <span className="size-1.5 rounded-full bg-amber-500" />
          <p className="text-[10px] text-muted-foreground">Synthetic environment</p>
          <span className="ml-auto font-mono text-[9px] text-muted-foreground">v1.0</span>
        </div>
      </aside>
    </>
  )
}
