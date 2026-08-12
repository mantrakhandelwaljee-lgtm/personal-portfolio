import type { Project, MediaItem } from '@/lib/projects'

type Props = {
  item: MediaItem
  project: Project
  vertical?: boolean
}

export function ProjectMedia({ item, project, vertical }: Props) {
  if (item.kind === 'note') {
    return (
      <article
        className={`flex shrink-0 flex-col justify-center gap-5 ${
          vertical
            ? 'w-full rounded-2xl px-8 py-14 md:px-12 md:py-20'
            : 'h-[60vh] min-h-[360px] w-[42vw] min-w-[320px] rounded-2xl px-10 py-12 md:px-14'
        }`}
        style={{ backgroundColor: project.color, color: project.onColor }}
      >
        <h2 className="font-serif text-2xl leading-tight md:text-3xl lg:text-4xl">
          {item.heading}
        </h2>
        <p className="max-w-md text-sm leading-relaxed opacity-80 md:text-base lg:text-lg">
          {item.body}
        </p>
      </article>
    )
  }

  const isWide = 'wide' in item && item.wide

  const horizontalWidth = isWide
    ? 'w-[78vw] min-w-[560px] max-w-[1100px]'
    : 'w-[56vw] min-w-[380px] max-w-[800px]'

  if (item.kind === 'video') {
    return (
      <figure className={`shrink-0 ${vertical ? 'w-full' : horizontalWidth}`}>
        <div
          className={`overflow-hidden rounded-2xl bg-muted ${
            vertical ? 'aspect-video' : 'h-[60vh] min-h-[360px]'
          }`}
        >
          <video
            className="h-full w-full object-cover object-top"
            src={item.src}
            poster={item.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        </div>
        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/40">
          {item.caption}
        </p>
      </figure>
    )
  }

  // Image
  return (
    <figure className={`shrink-0 ${vertical ? 'w-full' : horizontalWidth}`}>
      <div
        className={`overflow-hidden rounded-2xl bg-muted ${
          vertical ? 'aspect-video' : 'h-[60vh] min-h-[360px]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src || '/placeholder.svg'}
          alt={item.alt}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground/40">
        {item.caption}
      </p>
    </figure>
  )
}
