import { Section } from '../components/Section'
import { skillCategories } from '../data/profile'

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Skills"
      title="What I have actually built with"
      lead="Every item here is backed by a project on this page or by documented coursework. Core items are ones I have used to build something that works end to end."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {skillCategories.map((cat) => (
          <div key={cat.title} className="reveal card p-6 sm:p-7">
            <h3 className="text-base font-semibold text-slate-100">{cat.title}</h3>
            <p className="mt-1 mb-5 text-[13px] leading-relaxed text-slate-500">{cat.note}</p>
            <ul className="flex flex-wrap gap-1.5">
              {cat.skills.map((s) => (
                <li
                  key={s.name}
                  className={
                    s.level === 'core'
                      ? 'inline-flex items-center rounded-md border border-accent/25 bg-accent/[0.07] px-2.5 py-1.5 font-mono text-[11.5px] leading-none text-slate-200'
                      : 'chip !py-1.5'
                  }
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="reveal mt-7 flex items-center gap-2.5 font-mono text-[11px] text-slate-600">
        <span className="inline-block h-2.5 w-2.5 rounded-sm border border-accent/30 bg-accent/[0.07]" aria-hidden="true" />
        core
        <span className="ml-3 inline-block h-2.5 w-2.5 rounded-sm border border-white/[0.08] bg-white/[0.03]" aria-hidden="true" />
        working knowledge
      </p>
    </Section>
  )
}
