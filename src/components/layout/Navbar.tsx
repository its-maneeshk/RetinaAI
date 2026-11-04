import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { Menu, Bell, ChevronDown, PanelLeft, Check, ArrowUpRight } from 'lucide-react'
import { api } from '../../services/api'
import type { HealthResponse } from '../../types/screening'
import { Modal } from '../common/Modal'
export function Navbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation()
  const [notice, setNotice] = useState(false)
  const [profile, setProfile] = useState(false)
  const { data: health } = useSWR<HealthResponse>('/health', api, { refreshInterval: 30000 })
  const title = pathname.startsWith('/history/')
    ? 'Screening details'
    : ({
        '/': 'Overview',
        '/screening': 'New screening',
        '/history': 'Screening history',
        '/education': 'Learning center',
        '/model': 'System & model',
      }[pathname] ?? 'Workspace')
  return (
    <>
      <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <PanelLeft className="hidden size-4 text-muted-foreground lg:block" />
          <span className="hidden h-4 border-l border-border lg:block" />
          <span className="text-[11px] text-muted-foreground">Workspace</span>
          <span className="text-xs text-border">/</span>
          <span className="text-[11px] font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="hidden items-center gap-1.5 text-[10px] text-muted-foreground md:flex">
            <span className={health?.model_loaded ? 'size-1.5 rounded-full bg-primary' : 'size-1.5 rounded-full bg-amber-500'} />
            {health?.model_loaded ? 'System operational' : 'Connecting to service'}
          </span>
          <div className="hidden h-5 border-l border-border sm:block" />
          <button
            onClick={() => setNotice(true)}
            aria-label="Workspace notifications"
            className="relative flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <Bell className="size-[17px]" />
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full border border-white bg-primary" />
          </button>
          <button onClick={() => setProfile(true)} aria-label="Research workspace information" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full border border-primary/10 bg-primary-light text-[10px] font-semibold text-primary">
              RW
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[11px] font-semibold">Research workspace</span>
              <span className="mt-0.5 block text-[9px] text-muted-foreground">Prototype operator</span>
            </span>
            <ChevronDown className="hidden size-3 text-muted-foreground sm:block" />
          </button>
        </div>
      </header>
      {notice && (
        <Modal title="Workspace notifications" onClose={() => setNotice(false)}>
          <div className="flex items-start gap-3 rounded-xl bg-primary-light p-4">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Your research workspace is ready</p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                Start a screening with a synthetic retinal image. Every demo output is explicitly labeled and has no clinical meaning.
              </p>
              <Link
                to="/model"
                onClick={() => setNotice(false)}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary"
              >
                Review model information
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>
        </Modal>
      )}
      {profile && (
        <Modal title="Research workspace" onClose={() => setProfile(false)}>
          <p className="text-sm leading-7 text-muted-foreground">
            This is a shared, synthetic-data-only research prototype. There are no patient accounts or clinical permissions.
            Administrator-key authorization protects permanent deletion. Authentication, role-based access, and a security review are
            required before any real clinical deployment.
          </p>
          <Link to="/model" onClick={() => setProfile(false)} className="mt-4 inline-block text-sm font-semibold text-primary">
            View system & model information →
          </Link>
        </Modal>
      )}
    </>
  )
}
