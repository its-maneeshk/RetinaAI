import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
export function MainLayout() {
  const [menu, setMenu] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = `${pathname === '/' ? 'Overview' : pathname.startsWith('/screening') ? 'New screening' : pathname.startsWith('/history') ? 'Screening history' : pathname === '/model' ? 'System & model' : 'Learning center'} · RetinaAI`
  }, [pathname])
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-lg bg-primary px-4 py-3 text-sm text-white focus:translate-y-0"
      >
        Skip to content
      </a>
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div inert={menu} className="flex min-h-dvh flex-col lg:ml-[236px]">
        <Navbar onMenu={() => setMenu(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-6 px-4 py-7 outline-none sm:px-8 sm:py-8"
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
