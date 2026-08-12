import Link from "next/link"
import { projects } from "@/lib/projects"

export function WorkGrid() {
  return (
    <section
      id="work"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-16 md:py-24"
    >
      <div className="mb-10 flex items-center gap-4">
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground/40">
          03 — Selected work
        </span>
        <span className="h-px flex-1 bg-foreground/15" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className={`brand-block group relative flex aspect-[16/10] flex-col justify-between overflow-hidden p-6 transition-transform hover:-translate-y-1 ${
              i === 0 || i === 3 ? "md:col-span-2" : ""
            }`}
            style={{ backgroundColor: p.color, color: p.onColor }}
          >
            <span className="font-display text-xs font-semibold uppercase tracking-widest opacity-70">
              {p.role} · {p.year}
            </span>
            <span className="font-display text-2xl font-bold leading-tight md:text-3xl">
              {p.title}
            </span>
            <span
              aria-hidden
              className="absolute right-5 top-5 font-display text-sm opacity-0 transition-opacity group-hover:opacity-80"
            >
              ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
