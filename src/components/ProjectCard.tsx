import { useRef } from 'react'
import type { Project } from '../data/projects'
import { statusLabels } from '../data/projects'
import { StatusDot } from './StatusDot'

type Props = {
  project: Project
  onOpen: (slug: string) => void
}

export function ProjectCard({ project, onOpen }: Props) {
  const tags = [...project.technologies, ...project.hardware].slice(0, 5)
  const cover = project.videos?.[0]
  const videoRef = useRef<HTMLVideoElement>(null)

  // The cover shows its poster until hovered or focused, then plays muted.
  // Skipped entirely for visitors who ask for reduced motion.
  const play = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    videoRef.current?.play().catch(() => {})
  }
  const pause = () => videoRef.current?.pause()

  return (
    // A card with a video spans the full row: video beside the text on wide
    // screens, above it on narrow ones.
    <article className={`reveal ${cover ? 'md:col-span-2' : ''}`}>
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        onMouseEnter={cover ? play : undefined}
        onMouseLeave={cover ? pause : undefined}
        onFocus={cover ? play : undefined}
        onBlur={cover ? pause : undefined}
        aria-label={`Open details for ${project.title}`}
        className={`card card-hover group grid h-full w-full overflow-hidden text-left focus-visible:border-accent/50 ${
          cover ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]' : ''
        }`}
      >
        {cover && (
          <div className="relative overflow-hidden border-b border-white/[0.06] md:border-b-0 md:border-r">
            <video
              ref={videoRef}
              src={`${import.meta.env.BASE_URL}${cover.src}`}
              poster={`${import.meta.env.BASE_URL}${cover.poster}`}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
              className="aspect-[16/9] w-full bg-ink-900 object-cover transition-transform duration-500 group-hover:scale-[1.03] md:absolute md:inset-0 md:aspect-auto md:h-full"
            />
            <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-md bg-ink-900/80 px-2 py-1 font-mono text-[10.5px] uppercase tracking-wider text-slate-300 backdrop-blur">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path d="M2 1.2v7.6L8.5 5z" />
              </svg>
              {project.videos!.length} simulation videos
            </span>
          </div>
        )}

        <div className="flex h-full flex-col p-6 sm:p-7">
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
        </div>
      </button>
    </article>
  )
}
