import type { Metadata } from 'next'

import { Computer } from '@/components/Computer'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { app, apps, parsePath } from '@/lib/apps'

type Props = { params: Promise<{ page?: string[] }> }

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { page: [] },
    ...apps.map((a) => ({ page: [a.key] })),
    ...resume.jobs.map((job) => ({ page: ['work', job.slug] })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = parsePath((await params).page)
  if (!route || route.key === 'about') return {}
  const job = route.key === 'work' && resume.jobs.find((j) => j.slug === route.sub)
  const title = job ? job.companies.map((c) => c.name).join(' & ') : app(route.key).title
  return { title: `${title} · ${site.name}` }
}

export default async function Home({ params }: Props) {
  const route = parsePath((await params).page)
  return <Computer initial={route ?? { key: 'about' }} />
}
