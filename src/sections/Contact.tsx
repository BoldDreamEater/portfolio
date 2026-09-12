import { Section } from '../components/Section'
import { profile } from '../data/profile'

const channels = [
  {
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: (
      <path
        d="M2 4.5h12v9H2v-9zm0 .5l6 4.5L14 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    label: 'GitHub',
    value: profile.githubHandle,
    href: profile.github,
    icon: (
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33C3.81 14.35 3.35 12.8 3.35 12.8c-.36-.92-.88-1.16-.88-1.16-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.86.86 2.31.66.07-.52.28-.87.5-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    ),
  },
  {
    label: 'LinkedIn',
    value: profile.linkedinHandle,
    href: profile.linkedin,
    icon: (
      <path
        fill="currentColor"
        d="M13.6 0H2.4A2.4 2.4 0 000 2.4v11.2A2.4 2.4 0 002.4 16h11.2a2.4 2.4 0 002.4-2.4V2.4A2.4 2.4 0 0013.6 0zM5 13.3H2.7V6.2H5v7.1zM3.8 5.2a1.35 1.35 0 110-2.7 1.35 1.35 0 010 2.7zm9.5 8.1H11V9.6c0-.9-.3-1.5-1.1-1.5-.6 0-1 .4-1.1.8l-.1.6v3.8H6.4V6.2h2.3v1a2.3 2.3 0 012.1-1.15c1.5 0 2.6 1 2.6 3.1v4.15z"
      />
    ),
  },
  {
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    icon: (
      <path
        d="M3 2.5h3l1 3-1.8 1.3a9 9 0 004 4L10.5 9l3 1v3a1 1 0 01-1.1 1A11.5 11.5 0 012 3.6 1 1 0 013 2.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
]

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Get in touch"
      lead="I am open to internships and research opportunities in robotics, embedded systems, control engineering and hardware design."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal">
          <p className="text-[15.5px] leading-relaxed text-slate-400">
            The fastest way to reach me is email. If you are evaluating my work for a role or a programme, the résumé
            above has the full record, and every project card here links to whatever public evidence exists.
          </p>
          <p className="mt-5 flex items-center gap-2 font-mono text-[12.5px] text-slate-500">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="text-slate-600">
              <path
                d="M8 15s5.5-4.6 5.5-8.5a5.5 5.5 0 10-11 0C2.5 10.4 8 15 8 15z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="8" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {profile.location}
          </p>
        </div>

        <ul className="reveal grid gap-px overflow-hidden rounded-xl border border-white/[0.07] sm:grid-cols-2">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex min-h-[84px] flex-col justify-center gap-1.5 bg-ink-850/60 px-5 py-4 transition-colors hover:bg-ink-800/80"
              >
                <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-slate-500">
                  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" className="text-slate-600 transition-colors group-hover:text-accent">
                    {c.icon}
                  </svg>
                  {c.label}
                </span>
                <span className="truncate text-[14px] text-slate-300 transition-colors group-hover:text-accent">
                  {c.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
