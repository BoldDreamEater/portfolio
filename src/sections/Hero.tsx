import { profile } from '../data/profile'
import { portrait, portraitFallback } from '../data/work'
import { PortraitField } from '../components/PortraitField'

export function Hero() {
  return (
    <section id="home" className="relative isolate h-[100svh] min-h-[620px] overflow-hidden" aria-labelledby="hero-name">
      <PortraitField src={portrait} fallback={portraitFallback} className="absolute inset-0 -z-10 h-full w-full" />

      {/* Hand-drawn line looping across the portrait */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="signature pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        <path
          d="M-20 640 C 120 520, 300 470, 470 430 S 760 300, 640 220 S 430 260, 470 400 S 520 760, 450 600 C 420 520, 460 260, 520 150 M 560 360 C 700 320, 860 300, 980 270 C 1060 250, 1080 380, 1120 420 C 1160 460, 1180 300, 1220 260 C 1250 230, 1270 330, 1300 340 C 1330 350, 1360 300, 1380 330"
          fill="none"
          stroke="rgba(236,235,231,0.75)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-3 sm:px-8 sm:pb-4">
        <div className="mb-3 flex flex-col items-start justify-between gap-5 sm:mb-1 sm:flex-row sm:items-end">
          <p className="max-w-[23rem] animate-fade-up text-[13px] leading-snug text-slate-300" style={{ animationDelay: '600ms' }}>
            {profile.heroBio} Scroll to fly through the work.
          </p>
          <a href="#work" className="pill animate-fade-up" style={{ animationDelay: '750ms' }}>
            Explore the work
            <span className="pill-icon" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1.5v9M2.5 7L6 10.5 9.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>

        <h1
          id="hero-name"
          className="display -mb-[0.06em] animate-fade-up whitespace-nowrap text-center text-[clamp(4.2rem,18.5vw,19rem)] leading-[0.9]"
          style={{ animationDelay: '250ms' }}
        >
          {profile.name}
        </h1>
      </div>
    </section>
  )
}
