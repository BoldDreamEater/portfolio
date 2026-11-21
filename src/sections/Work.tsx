import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getProject, projects, statusLabels } from '../data/projects'
import { covers, tiles } from '../data/work'
import { ProjectDetails } from '../components/ProjectDetails'
import { ProjectCard } from '../components/ProjectCard'
import type { WorkScene } from '../components/WorkScene'
import { useReveal } from '../hooks/useReveal'

const VH_PER_PROJECT = 85 // scroll distance per project, in viewport heights

function canUse3D() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function Work() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<string | null>(null)
  const [use3D] = useState(canUse3D)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<WorkScene | null>(null)
  const fallbackRef = useReveal<HTMLElement>()

  // Deep links: #project/<slug> opens that project's panel.
  useEffect(() => {
    const sync = () => {
      const match = window.location.hash.match(/^#project\/(.+)$/)
      setOpenSlug(match && getProject(match[1]) ? match[1] : null)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const open = useCallback((slug: string) => {
    window.location.hash = `project/${slug}`
  }, [])

  const close = useCallback(() => {
    const { pathname, search } = window.location
    window.history.replaceState(null, '', `${pathname}${search}#work`)
    setOpenSlug(null)
  }, [])

  const sceneProjects = useMemo(
    () =>
      projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        meta: `${p.year} · ${statusLabels[p.status]}`,
        tags: p.technologies,
        cover: covers[p.slug],
        confidential: p.confidential,
      })),
    [],
  )

  // Build the Three.js scene once (loaded lazily so it stays out of the first paint).
  useEffect(() => {
    if (!use3D || !canvasRef.current) return
    let disposed = false
    import('../components/WorkScene').then(({ WorkScene }) => {
      if (disposed || !canvasRef.current) return
      sceneRef.current = new WorkScene(canvasRef.current, sceneProjects, tiles, import.meta.env.BASE_URL, open, setHover)
      sceneRef.current.setRunning(true)
    })
    return () => {
      disposed = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [use3D, sceneProjects, open])

  // Scroll -> camera progress; pause rendering while the section is off-screen.
  useEffect(() => {
    if (!use3D) return
    const section = sectionRef.current
    if (!section) return
    const onScroll = () => {
      const r = section.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const f = Math.min(1, Math.max(0, -r.top / Math.max(1, span)))
      const p = f * (projects.length - 1)
      sceneRef.current?.setProgress(p)
      setActive(Math.round(p))
    }
    const io = new IntersectionObserver(([e]) => sceneRef.current?.setRunning(e.isIntersecting))
    io.observe(section)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [use3D])

  const current = projects[active]

  return (
    <>
      {use3D ? (
        <section
          id="work"
          ref={sectionRef}
          aria-label="Selected work"
          className="relative"
          style={{ height: `${(projects.length - 1) * VH_PER_PROJECT + 100}svh` }}
        >
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden="true" />

            {/* Label over the card, as in the reference, when it is hovered */}
            <div
              className={`pointer-events-none absolute left-1/2 top-[22%] z-10 -translate-x-1/2 rounded-full bg-ink-900/80 px-3 py-1 text-[12px] text-slate-200 backdrop-blur transition-opacity duration-300 ${
                hover ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Open {current.title}
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-5 pb-5 sm:px-8 sm:pb-6">
              <button
                type="button"
                onClick={() => open(current.slug)}
                className="group flex min-w-0 items-end gap-3 text-left sm:gap-4"
                aria-label={`Open project ${active + 1}: ${current.title}`}
              >
                <span className="display shrink-0 text-[3.4rem] leading-[0.8] sm:text-[5.2rem]">
                  {String(active + 1).padStart(3, '0')}
                </span>
                <span className="min-w-0 pb-1">
                  <span className="display block truncate text-[1.4rem] leading-tight transition-colors group-hover:text-white sm:text-[2rem]">
                    {current.title}
                  </span>
                  <span className="block max-w-[34ch] truncate text-[12px] text-slate-500">{current.subtitle}</span>
                </span>
              </button>

              <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
                <span className="text-[12px] text-slate-500">
                  {active + 1} of {projects.length} projects
                </span>
                <a href="#home" className="pill-solid">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M4.5 3L1.5 6l3 3M1.5 6h6a3 3 0 013 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to home
                </a>
              </div>
            </div>
          </div>

          {/* Screen-reader and keyboard path through the same projects */}
          <ul className="sr-only">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button type="button" onClick={() => open(p.slug)}>
                  Project {i + 1}: {p.title}. {p.oneLiner}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section id="work" ref={fallbackRef} className="section-pad scroll-mt-20" aria-labelledby="work-heading">
          <div className="shell">
            <header className="mb-12 max-w-2xl">
              <p className="eyebrow mb-2">Work</p>
              <h2 id="work-heading" className="display text-5xl sm:text-6xl">
                Selected work
              </h2>
            </header>
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} onOpen={open} />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProjectDetails project={openSlug ? getProject(openSlug) ?? null : null} onClose={close} />
    </>
  )
}
