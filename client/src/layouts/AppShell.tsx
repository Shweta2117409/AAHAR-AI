import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute right-[-10%] top-[25%] h-[480px] w-[480px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-20%,rgba(249,115,22,0.18),transparent_60%)]" />
      </div>

      <header className="relative mx-auto w-full max-w-6xl px-5 pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.85)]" />
            <span className="text-sm font-medium tracking-wide text-zinc-200">Aahar-AI</span>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                clsx(
                  'rounded-2xl border px-4 py-2 text-sm font-semibold transition',
                  'border-white/10 bg-black/20 text-zinc-100',
                  'hover:border-white/20 hover:bg-black/30',
                  isActive && 'border-orange-400/30 bg-orange-500/10 text-zinc-50'
                )
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/insights"
              className={({ isActive }) =>
                clsx(
                  'rounded-2xl border px-4 py-2 text-sm font-semibold transition',
                  'border-white/10 bg-black/20 text-zinc-100',
                  'hover:border-white/20 hover:bg-black/30',
                  isActive && 'border-orange-400/30 bg-orange-500/10 text-zinc-50'
                )
              }
            >
              Insights
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-8">
        <Outlet />
      </main>
    </div>
  )
}

