import { Section } from '../components/Section'
import { Timeline } from '../components/Timeline'
import { achievements, certifications, education, experience, profile } from '../data/profile'
import { projects } from '../data/projects'

export function Resume() {
  return (
    <Section
      id="resume"
      eyebrow="Résumé"
      title="Education, experience and record"
      lead="The full document is available to download. Everything below is drawn from it."
    >
      <div className="reveal mb-12 flex flex-wrap items-center gap-4">
        <a href={profile.resumePath} download className="btn-primary">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 1.5v9m0 0L4.5 7M8 10.5L11.5 7M2 13.5h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Download résumé (PDF)
        </a>
        <a href={profile.resumePath} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          Open in browser
        </a>
        <p className="font-mono text-[11px] text-slate-600">Last updated {profile.resumeUpdated}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="space-y-12">
          <div>
            <h3 className="reveal mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Experience</h3>
            <Timeline items={experience} />
          </div>

          <div>
            <h3 className="reveal mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Education</h3>
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.institution} className="reveal card p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h4 className="text-[15px] font-semibold text-slate-100">{e.qualification}</h4>
                    <span className="font-mono text-[11.5px] text-slate-600">{e.period}</span>
                  </div>
                  <p className="mt-1 text-[14px] text-slate-400">{e.institution}</p>
                  {e.detail && <p className="mt-1 font-mono text-[12px] text-slate-500">{e.detail}</p>}
                  {e.highlight && (
                    <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-1 text-[12px] text-amber-200/90">
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                        <path d="M6 0l1.6 3.5L11.5 4 8.7 6.6l.7 3.9L6 8.7 2.6 10.5l.7-3.9L.5 4l3.9-.5L6 0z" />
                      </svg>
                      {e.highlight}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="reveal">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Projects at a glance</h3>
            <ul className="space-y-px overflow-hidden rounded-xl border border-white/[0.07]">
              {projects.map((p) => (
                <li key={p.slug} className="bg-ink-850/60">
                  <a
                    href={`#project/${p.slug}`}
                    className="flex min-h-[44px] items-center justify-between gap-3 px-4 py-2.5 text-[13.5px] text-slate-300 transition-colors hover:bg-white/[0.03] hover:text-accent"
                  >
                    {p.title}
                    <span className="shrink-0 font-mono text-[11px] text-slate-600">{p.year}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Achievements</h3>
            <ul className="space-y-2.5">
              {achievements.map((a) => (
                <li key={a} className="flex gap-2.5 text-[13.5px] leading-relaxed text-slate-400">
                  <span aria-hidden="true" className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Certifications</h3>
            <ul className="flex flex-wrap gap-1.5">
              {certifications.map((c) => (
                <li key={c} className="chip !py-1.5">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">Languages</h3>
            <p className="text-[13.5px] leading-relaxed text-slate-400">
              English (fluent) · Hindi (native) · Urdu (native)
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
