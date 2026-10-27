import type { Metadata } from 'next'

import { Computer } from '@/components/Computer'
import { albums } from '@/content/albums'
import { resume } from '@/content/resume'
import { apps, parsePath } from '@/lib/apps'
import { canonical, jsonLd, pageDescription, pageTitle, share, unindexed } from '@/lib/seo'

type Props = { params: Promise<{ page?: string[] }> }

export const dynamicParams = false

export function generateStaticParams() {
  return [
    { page: [] },
    ...apps.map((a) => ({ page: [a.key] })),
    ...resume.jobs.map((job) => ({ page: ['work', job.slug] })),
    ...albums.map((album) => ({ page: ['winamp', album.slug] })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key, sub } = parsePath((await params).page) ?? { key: 'about' as const }
  const home = key === 'about'
  const title = pageTitle(key, sub)
  const description = pageDescription(key, sub)
  const url = canonical(key, sub)
  return {
    // The home title is already complete, so it skips the "· Humberto Piaia" template
    title: home ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: { ...share.openGraph, title, description, url },
    twitter: { ...share.twitter, title, description },
    ...(unindexed.includes(key) && { robots: { index: false, follow: true } }),
  }
}

export default async function Home({ params }: Props) {
  const route = parsePath((await params).page) ?? { key: 'about' as const }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(route.key === 'about') }} />
      <Computer initial={route} />
    </>
  )
}
