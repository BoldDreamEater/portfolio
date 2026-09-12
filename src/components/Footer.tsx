import { profile } from '../data/profile'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="shell flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="font-mono text-[11.5px] text-slate-600">
          © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript and Tailwind CSS
        </p>
        <div className="-my-2 flex flex-wrap items-center gap-x-5">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex min-h-[44px] items-center text-[12.5px]">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex min-h-[44px] items-center text-[12.5px]">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="link-underline inline-flex min-h-[44px] items-center text-[12.5px]">
            Email
          </a>
          <a href="#home" className="link-underline inline-flex min-h-[44px] items-center text-[12.5px]">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  )
}
