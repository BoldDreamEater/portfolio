import { useEffect, useState } from 'react'

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#resume', label: 'Résumé' },
  { href: '#contact', label: 'Contact' },
]

/** Live local time in Aligarh (IST), refreshed every 15 s. */
function useIstTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(
      new Date(),
    )
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 15000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

export function Header() {
  const time = useIstTime()

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto mx-auto grid max-w-[1600px] grid-cols-[auto_1fr] items-start gap-6 px-5 pt-5 sm:px-8 sm:pt-6 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <a href="#home" aria-label="Aman Javed, back to top" className="w-fit text-[#f2f1ed]">
          <svg width="34" height="26" viewBox="0 0 34 26" fill="none" aria-hidden="true">
            {/* A and J monogram, drawn as two strokes */}
            <path d="M2 24L10.5 2L19 24M5.6 15.5h9.8" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M30 2v15.5a6.5 6.5 0 01-11.2 4.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
        </a>

        <p className="hidden lg:block">
          <span className="meta-label">Currently:</span>
          <span className="meta-value">B.Tech Electrical Engineering, AMU</span>
        </p>
        <p className="hidden lg:block">
          <span className="meta-label">Based in:</span>
          <span className="meta-value">
            Aligarh, India <span className="text-slate-500">({time})</span>
          </span>
        </p>

        <nav aria-label="Primary" className="justify-self-end text-right">
          <span className="meta-label">Navigation:</span>
          <span className="meta-value">
            {NAV.map((n, i) => (
              <span key={n.href}>
                <a href={n.href} className="transition-colors hover:text-white hover:underline hover:underline-offset-4">
                  {n.label}
                </a>
                {i < NAV.length - 1 && ', '}
              </span>
            ))}
          </span>
        </nav>
      </div>
    </header>
  )
}
