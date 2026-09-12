import type { Experience } from '../data/profile'

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <ol className="relative m-0 list-none space-y-8 p-0">
      {/* Spine */}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-accent/40 via-white/[0.08] to-transparent"
      />

      {items.map((item) => (
        <li key={`${item.org}-${item.period}`} className="reveal relative pl-8">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[7px] h-[11px] w-[11px] rounded-full border-2 border-accent/70 bg-ink-900"
          />

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="text-[15.5px] font-semibold text-slate-100">{item.role}</h4>
            {item.tag && (
              <span className="rounded border border-accent/30 bg-accent/[0.08] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
                {item.tag}
              </span>
            )}
          </div>

          <p className="mt-1 text-[14px] text-slate-400">{item.org}</p>

          <p className="mt-1 font-mono text-[11.5px] text-slate-600">
            {item.period}
            {item.location && ` · ${item.location}`}
          </p>

          <ul className="mt-3.5 space-y-2">
            {item.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-[14px] leading-relaxed text-slate-400">
                <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-slate-700" />
                {p}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
