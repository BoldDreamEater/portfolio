import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { statusLabels } from '../data/projects'
import { StatusDot } from './StatusDot'
import { Diagram } from './Diagram'

type Props = {
  project: Project | null
  onClose: () => void
}

export function ProjectDetails({ project, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape to close, focus trap, and body scroll lock while open.
  useEffect(() => {
    if (!project) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in items-start justify-center overflow-y-auto overscroll-contain bg-ink-900/80 p-0 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="relative my-0 w-full max-w-3xl border border-white/[0.08] bg-ink-850 shadow-2xl sm:my-4 sm:rounded-2xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.07] bg-ink-850/95 px-5 py-4 backdrop-blur-xl sm:rounded-t-2xl sm:px-8 sm:py-5">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <StatusDot status={project.status} label={statusLabels[project.status]} />
              <span className="font-mono text-[11px] text-slate-600">{project.year}</span>
            </div>
            <h2 id="project-modal-title" className="truncate text-xl font-semibold text-slate-50 sm:text-2xl">
              {project.title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-400">{project.subtitle}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[0.1] text-slate-400 transition-colors hover:border-white/[0.25] hover:text-slate-100"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-9 px-5 py-7 sm:px-8 sm:py-9">
          {project.confidential && project.confidentialNote && (
            <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.06] p-4">
              <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-amber-300">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <rect x="2" y="5" width="8" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                Confidential project
              </p>
              <p className="text-[13.5px] leading-relaxed text-amber-100/70">{project.confidentialNote}</p>
            </div>
          )}

          <p className="text-[15.5px] leading-relaxed text-slate-300">{project.summary}</p>

          {project.diagram && <Diagram kind={project.diagram} />}

          <Prose title="The problem" body={project.problem} />
          <Prose title="Approach" body={project.approach} />

          {project.images && project.images.length > 0 && (
            <div>
              <SubHeading>Project photographs</SubHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img) => (
                  <figure key={img.src} className="m-0">
                    <img
                      src={`${import.meta.env.BASE_URL}${img.src}`}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-lg border border-white/[0.07] bg-ink-900 object-cover"
                    />
                    <figcaption className="mt-2 text-xs leading-relaxed text-slate-500">{img.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div>
            <SubHeading>Key features</SubHeading>
            <ul className="space-y-2.5">
              {project.features.map((f) => (
                <li key={f} className="flex gap-3 text-[14.5px] leading-relaxed text-slate-400">
                  <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <TagBlock title="Technologies" items={project.technologies} />
            <TagBlock title="Hardware" items={project.hardware} />
          </div>

          <div>
            <SubHeading>Software components</SubHeading>
            <ul className="space-y-2">
              {project.software.map((s) => (
                <li key={s} className="font-mono text-[12.5px] leading-relaxed text-slate-400">
                  <span className="text-slate-600">— </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {project.sections && project.sections.length > 0 && (
            <div>
              <SubHeading>Technical detail</SubHeading>
              <div className="space-y-2.5">
                {project.sections.map((s) => (
                  <Expandable key={s.title} title={s.title} body={s.body} bullets={s.bullets} />
                ))}
              </div>
            </div>
          )}

          <Prose title="My contribution" body={project.contribution} />

          {project.results && project.results.length > 0 && (
            <div>
              <SubHeading>Results</SubHeading>
              <ul className="space-y-2.5">
                {project.results.map((r) => (
                  <li key={r} className="flex gap-3 text-[14.5px] leading-relaxed text-slate-400">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-signal"
                    >
                      <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-6">
            {project.links && project.links.length > 0 ? (
              project.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33C3.81 14.35 3.35 12.8 3.35 12.8c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  {l.label}
                </a>
              ))
            ) : (
              <p className="text-[13px] leading-relaxed text-slate-500">
                {project.confidential
                  ? 'Repository access withheld under a non-disclosure agreement.'
                  : 'No public repository for this project yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{children}</h3>
}

function Prose({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <SubHeading>{title}</SubHeading>
      <p className="text-[14.5px] leading-relaxed text-slate-400">{body}</p>
    </div>
  )
}

function TagBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <SubHeading>{title}</SubHeading>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="chip">
            {i}
          </span>
        ))}
      </div>
    </div>
  )
}

function Expandable({ title, body, bullets }: { title: string; body: string; bullets?: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-ink-900/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-[52px] w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="text-[14px] font-medium text-slate-200">{title}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="animate-fade-in border-t border-white/[0.06] px-4 py-4">
          <p className="text-[14px] leading-relaxed text-slate-400">{body}</p>
          {bullets && bullets.length > 0 && (
            <ul className="mt-3.5 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2.5 font-mono text-[12.5px] leading-relaxed text-slate-500">
                  <span aria-hidden="true" className="text-slate-700">
                    ·
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
