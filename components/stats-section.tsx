const stats = [
  { label: "Years designing", value: "6+", bg: "bg-brand-green", fg: "text-brand-black" },
  { label: "Projects shipped", value: "48", bg: "bg-brand-blue", fg: "text-white" },
  { label: "Happy clients", value: "30", bg: "bg-brand-red", fg: "text-white" },
  { label: "Awards", value: "5", bg: "bg-brand-yellow", fg: "text-brand-black" },
]

const achievements = [
  { title: "Awwwards — Site of the Day", org: "2024", color: "bg-brand-red" },
  { title: "CSS Design Awards — Special Kudos", org: "2023", color: "bg-brand-blue" },
  { title: "FWA of the Day", org: "2023", color: "bg-brand-green" },
  { title: "Speaker — Config by Figma", org: "2022", color: "bg-brand-yellow" },
]

const activity = [
  { when: "2 days ago", what: "Shipped a design system for a fintech dashboard", tag: "Design" },
  { when: "1 week ago", what: "Launched a motion-first portfolio for a photographer", tag: "Dev" },
  { when: "3 weeks ago", what: "Prototyped an AI writing tool interface", tag: "Product" },
  { when: "1 month ago", what: "Ran a workshop on expressive UI systems", tag: "Talk" },
]

export function StatsSection() {
  return (
    <section
      id="stats"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-16 md:py-24"
    >
      <div className="mb-10 flex items-center gap-4">
        <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground/40">
          02 — By the numbers
        </span>
        <span className="h-px flex-1 bg-foreground/15" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`brand-block flex aspect-[4/3] flex-col justify-between p-5 ${s.bg} ${s.fg}`}
          >
            <span className="font-display text-4xl font-bold md:text-6xl">
              {s.value}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest opacity-80">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Achievements + Activity */}
      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wide">
            Achievements
          </h3>
          <ul className="space-y-4">
            {achievements.map((a) => (
              <li key={a.title} className="flex items-start gap-4">
                <span
                  className={`mt-1.5 size-3 shrink-0 rounded-full ${a.color}`}
                  aria-hidden
                />
                <div>
                  <p className="font-medium leading-snug">{a.title}</p>
                  <p className="text-sm text-foreground/50">{a.org}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-6 font-display text-xl font-bold uppercase tracking-wide">
            Recent activity
          </h3>
          <ul className="space-y-5">
            {activity.map((item) => (
              <li
                key={item.what}
                className="border-l-2 border-foreground/15 pl-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-xs font-semibold uppercase tracking-widest text-brand-blue">
                    {item.tag}
                  </span>
                  <span className="text-xs text-foreground/40">{item.when}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                  {item.what}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
