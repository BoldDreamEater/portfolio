import type { ProjectStatus } from '../data/projects'

const TONE: Record<ProjectStatus, { dot: string; text: string; pulse: boolean }> = {
  active: { dot: 'bg-signal', text: 'text-signal', pulse: true },
  complete: { dot: 'bg-accent', text: 'text-accent', pulse: false },
  prototype: { dot: 'bg-amber-400', text: 'text-amber-300', pulse: false },
  archived: { dot: 'bg-slate-500', text: 'text-slate-400', pulse: false },
}

export function StatusDot({ status, label }: { status: ProjectStatus; label: string }) {
  const tone = TONE[status]
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider ${tone.text}`}>
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        {tone.pulse && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone.dot}`} />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${tone.dot}`} />
      </span>
      {label}
    </span>
  )
}
