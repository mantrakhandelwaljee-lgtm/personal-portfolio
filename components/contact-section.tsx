export function ContactSection() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-24 px-5 pb-8 pt-16 md:pt-24"
    >
      <div className="brand-block relative overflow-hidden bg-brand-black px-6 py-14 text-white md:px-14 md:py-20">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          04 — Contact
        </p>
        <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-bold leading-tight md:text-6xl">
          Let&apos;s build something worth looking at.
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:hello@mantra.design"
            className="rounded-full bg-brand-yellow px-6 py-3 font-display text-xs font-semibold uppercase tracking-widest text-brand-black transition-transform hover:-translate-y-0.5"
          >
            hello@mantra.design
          </a>
          <a
            href="#top"
            className="rounded-full border border-white/25 px-6 py-3 font-display text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            Back to top
          </a>
        </div>

        <span
          aria-hidden
          className="absolute -bottom-10 right-4 font-display text-[22vw] font-bold leading-none text-white/[0.04] md:text-[12rem]"
        >
          MK
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-foreground/50 md:flex-row">
        <span>© {new Date().getFullYear()} Mantra Khandelwal</span>
        <span className="font-display uppercase tracking-widest">
          Designer &amp; Developer
        </span>
      </div>
    </section>
  )
}
