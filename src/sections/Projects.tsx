import { useCallback, useEffect, useState } from 'react'
import { Section } from '../components/Section'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectDetails } from '../components/ProjectDetails'
import { getProject, projects } from '../data/projects'

export function Projects() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  // Deep-link support: #project/<slug> opens the matching modal so a
  // specific project can be linked directly in an application.
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
    window.history.replaceState(null, '', `${pathname}${search}#projects`)
    setOpenSlug(null)
  }, [])

  return (
    <>
      <Section
        id="projects"
        eyebrow="Projects"
        title="Selected engineering work"
        lead="Nine projects spanning robotics, satellite power electronics, RF telemetry and bare-metal firmware. Open any card for the architecture, the reasoning and the honest status."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} onOpen={open} />
          ))}
        </div>
      </Section>

      <ProjectDetails project={openSlug ? getProject(openSlug) ?? null : null} onClose={close} />
    </>
  )
}
