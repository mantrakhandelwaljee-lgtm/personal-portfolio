import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectView } from "@/components/project-view"
import { getProject, projects } from "@/lib/projects"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return { title: "Not found" }
  return {
    title: `${project.title} — Mantra Khandelwal`,
    description: project.tagline,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  return <ProjectView project={project} />
}
