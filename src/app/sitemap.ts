import type { MetadataRoute } from 'next'

import { resume } from '@/content/resume'
import { apps, pathOf } from '@/lib/apps'
import { siteUrl, unindexed } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = apps
    .filter((a) => !unindexed.includes(a.key))
    .map((a) => ({ url: `${siteUrl}${pathOf(a.key)}`, priority: a.key === 'about' ? 1 : 0.7 }))
  const jobs = resume.jobs.map((job) => ({ url: `${siteUrl}${pathOf('work', job.slug)}`, priority: 0.6 }))
  return [...pages, ...jobs, { url: `${siteUrl}/resume.pdf`, priority: 0.8 }]
}
