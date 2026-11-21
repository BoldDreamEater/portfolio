import type { ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  lead?: string
  children: ReactNode
  className?: string
}

export function Section({ id, eyebrow, title, lead, children, className = '' }: SectionProps) {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id={id}
      ref={ref}
      className={`section-pad scroll-mt-20 border-t border-white/[0.06] ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="shell">
        <header className="reveal mb-12 max-w-2xl sm:mb-16">
          <p className="eyebrow mb-2">{eyebrow}</p>
          <h2 id={`${id}-heading`} className="display text-[2.6rem] leading-[1] sm:text-6xl">
            {title}
          </h2>
          {lead && <p className="mt-4 text-base leading-relaxed text-slate-400">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  )
}
