const links = [
  { label: "About", href: "#about" },
  { label: "Numbers", href: "#stats" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.18em]"
        >
          <span className="flex gap-1" aria-hidden>
            <span className="size-3 rounded-sm bg-brand-green" />
            <span className="size-3 rounded-sm bg-brand-red" />
            <span className="size-3 rounded-sm bg-brand-blue" />
          </span>
          MK
        </a>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-5 md:gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="font-display text-xs font-medium uppercase tracking-widest text-foreground/60 transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
