import type { Project } from '../data/projects'
import { statusLabels } from '../data/projects'
import { StatusDot } from './StatusDot'

type Props = {
  project: Project
  onOpen: (slug: string) => void
}

export function ProjectCard({ project, onOpen }: Props) {
  const tags = [...project.technologies, ...project.hardware].slice(0, 5)

  return (
    <article className="reveal">
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        aria-label={`Open details for ${project.title}`}
        className="card card-hover group flex h-full w-full flex-col p-6 text-left focus-visible:border-accent/50 sm:p-7"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-accent sm:text-xl">
              {project.title}
            </h3>
            <p className="mt-1 text-sm leading-snug text-slate-400">{project.subtitle}</p>
          </div>
          <span className="mt-1 shrink-0 font-mono text-[11px] text-slate-600">{project.year}</span>
        </div>

        <p className="mb-5 text-[15px] leading-relaxed text-slate-400">{project.oneLiner}</p>

        {project.confidential && (
          <p className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/[0.07] px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-amber-300/90">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <rect x="2" y="5" width="8" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Under NDA
          </p>
        )}

        <div className="mb-5 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
          <StatusDot status={project.status} label={statusLabels[project.status]} />
          <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors group-hover:text-accent">
            Details
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </button>
    </article>
  )
}
