import type { MetadataRoute } from 'next'

import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { apps, pathOf } from '@/lib/apps'
import { siteUrl, unindexed } from '@/lib/seo'

// lastmod is the date the content last changed, not the build time, so search engines can trust it
const lastModified = new Date(site.updated)

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = apps.filter((a) => !unindexed.includes(a.key)).map((a) => `${siteUrl}${pathOf(a.key)}`)
  const jobs = resume.jobs.map((job) => `${siteUrl}${pathOf('work', job.slug)}`)
  return [...pages, ...jobs, `${siteUrl}/resume.pdf`].map((url) => ({ url, lastModified }))
}
