import { useEffect, useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { profile } from '../data/profile'

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

const NAV_IDS = NAV.map((n) => n.id)

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(NAV_IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/[0.07] bg-ink-900/85 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between" aria-label="Primary">
        <a
          href="#home"
          className="group -ml-1 flex min-h-[44px] items-center gap-2.5 px-1 font-mono text-sm font-medium text-slate-200"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-[11px] font-semibold text-accent transition-colors group-hover:bg-accent/20"
          >
            AJ
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                className={`relative rounded-md px-3 py-2 text-sm transition-colors ${
                  active === item.id ? 'text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {active === item.id && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a href={profile.resumePath} download className="btn-ghost !px-4 !py-2 !min-h-0 text-[13px]">
            Résumé
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-lg border border-white/[0.1] text-slate-300 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d={open ? 'M4 4l10 10M14 4L4 14' : 'M2 5h14M2 9h14M2 13h14'}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-white/[0.07] bg-ink-900 shadow-2xl shadow-black/50 md:!hidden"
      >
        <ul className="shell flex flex-col py-3">
          {NAV.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                aria-current={active === item.id ? 'true' : undefined}
                className={`flex min-h-[48px] items-center rounded-lg px-3 text-[15px] ${
                  active === item.id ? 'bg-white/[0.05] text-accent' : 'text-slate-300'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="px-3 pb-2 pt-3">
            <a href={profile.resumePath} download className="btn-ghost w-full" onClick={() => setOpen(false)}>
              Download résumé
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
