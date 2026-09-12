import { profile } from '../data/profile'
import { projects } from '../data/projects'

const stats = [
  { value: String(projects.length), label: 'Featured projects' },
  { value: '9.83', label: 'Diploma CPI / 10' },
  { value: '3', label: 'Years on a satellite team' },
]

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden scroll-mt-20 pb-20 pt-32 sm:pb-28 sm:pt-40">
      {/* Engineering grid, faded out toward the edges */}
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-0 -z-10"
        style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 100%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(78,163,255,0.10), transparent 65%)' }}
      />

      <div className="shell">
        <p className="animate-fade-in font-mono text-xs uppercase tracking-[0.24em] text-accent">
          Electrical Engineering · AMU
        </p>

        <h1
          className="mt-5 max-w-4xl text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-slate-50 animate-fade-up sm:text-5xl lg:text-[3.4rem]"
          style={{ animationDelay: '60ms' }}
        >
          {profile.name}
        </h1>

        <p
          className="mt-5 max-w-3xl text-lg leading-snug text-slate-300 animate-fade-up sm:text-2xl"
          style={{ animationDelay: '130ms' }}
        >
          {profile.headline}
        </p>

        <p
          className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 animate-fade-up"
          style={{ animationDelay: '200ms' }}
        >
          {profile.intro}
        </p>

        <div className="mt-9 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: '270ms' }}>
          <a href="#projects" className="btn-primary">
            View projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </a>
          <a href="#contact" className="btn-ghost">
            Contact me
          </a>
        </div>

        <ControlLoopStrip />

        <dl className="mt-10 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.06] animate-fade-up" style={{ animationDelay: '420ms' }}>
          {stats.map((s) => (
            <div key={s.label} className="bg-ink-900 px-4 py-5 text-center sm:px-5">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-mono text-2xl font-medium text-slate-100">{s.value}</span>
                <span className="mt-1.5 block text-[11px] leading-tight text-slate-500">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/**
 * A closed control loop rendered as the page's one signature motif — the
 * dashed line animates to suggest signal flow around the feedback path.
 */
function ControlLoopStrip() {
  const nodes = [
    { x: 74, label: 'Command' },
    { x: 236, label: 'Controller' },
    { x: 398, label: 'Plant' },
    { x: 560, label: 'Sensor' },
  ]

  return (
    <div
      className="mt-14 animate-fade-up overflow-x-auto"
      style={{ animationDelay: '340ms' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 640 120" className="h-[110px] w-full min-w-[600px] max-w-3xl" role="presentation">
        <defs>
          <marker id="arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="#3d4a57" />
          </marker>
        </defs>

        {/* forward path */}
        <line x1="112" y1="44" x2="196" y2="44" stroke="#2e3641" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="276" y1="44" x2="358" y2="44" stroke="#2e3641" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="438" y1="44" x2="520" y2="44" stroke="#2e3641" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* feedback path — animated */}
        <path
          d="M560 66 V96 H74 V66"
          fill="none"
          stroke="#4ea3ff"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          opacity="0.7"
          className="animate-dash"
          markerEnd="url(#arrow)"
        />

        {nodes.map((n) => (
          <g key={n.label}>
            <rect
              x={n.x - 38}
              y={26}
              width="76"
              height="36"
              rx="7"
              fill="#101317"
              stroke="#222831"
              strokeWidth="1"
            />
            <text
              x={n.x}
              y={48}
              textAnchor="middle"
              fill="#aeb8c7"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              {n.label}
            </text>
          </g>
        ))}

        <text x="317" y="113" textAnchor="middle" fill="#5a6575" fontSize="10" fontFamily="ui-monospace, monospace">
          feedback
        </text>
      </svg>
    </div>
  )
}
