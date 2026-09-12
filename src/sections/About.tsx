import { Section } from '../components/Section'
import { about } from '../data/profile'

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Hardware and software, treated as one system"
      lead="I am most useful where the two meet — where a control law has to survive a real motor, a real battery and a real radio link."
    >
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="reveal space-y-5">
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-[15.5px] leading-relaxed text-slate-400">
              {p}
            </p>
          ))}
        </div>

        <div className="reveal">
          <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Focus areas</h3>
          <ul className="space-y-px overflow-hidden rounded-xl border border-white/[0.07]">
            {about.focus.map((f) => (
              <li key={f.label} className="bg-ink-850/60 px-5 py-4 transition-colors hover:bg-ink-800/70">
                <p className="text-[14.5px] font-medium text-slate-200">{f.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{f.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
