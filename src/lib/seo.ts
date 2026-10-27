import type { Metadata } from 'next'
import type { Graph, Person, ProfilePage, Thing, WebSite } from 'schema-dts'

import { findAlbum } from '@/content/albums'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { type AppKey, pathOf } from '@/lib/apps'
import { plain } from '@/lib/markdown'
import { clip as clipTo, companies, year } from '@/lib/utils'

export const siteUrl = 'https://hpiaia.dev'

const clip = (text: string) => clipTo(text, 158)

export const findJob = (slug?: string) => resume.jobs.find((j) => j.slug === slug)

// Search titles stay plain; the retro window titles ("About Me - WordPad") are for the desktop only
const titles: Record<AppKey, string> = {
  about: site.title,
  work: 'Work history',
  cv: 'Resume',
  terminal: 'Command prompt',
  skills: 'Skills',
  contact: 'Contact',
  music: 'Music',
  winamp: 'Winamp',
  credits: 'About this site',
  display: 'Display settings',
  trash: 'Recycle bin',
}

const descriptions: Record<AppKey, string> = {
  about: site.description,
  work: `Work history of ${site.name}: ${resume.jobs
    .slice(0, 4)
    .map(companies)
    .join(', ')} and more, with roles, dates and results.`,
  cv: `${site.name}'s resume as a one-page PDF: ${resume.role.toLowerCase()}, TypeScript, Node.js, Go, AWS and Terraform.`,
  terminal: `A DOS-style command prompt with ${site.name}'s bio, skills and links. Try dir, type about.txt or ls.`,
  skills: `Skills of ${site.name}: ${resume.skills
    .map(([, tools]) => tools.split(', ').slice(0, 3).join(', '))
    .join(', ')}, plus education and languages.`,
  contact: `Contact ${site.name}: email, GitHub, LinkedIn and SoundCloud.`,
  music: `sprnv4: music production by ${site.name}, on SoundCloud.`,
  winamp: `Winamp, playing the albums on ${site.name}'s bedroom wall: Kyuss, Alice in Chains, Radiohead, Deftones and Queens of the Stone Age.`,
  credits: `About hpiaia97, the retro desktop behind hpiaia.dev: how it was built and who made the 3D model, fonts and sounds.`,
  display: 'Display settings for the hpiaia97 desktop.',
  trash: 'The hpiaia97 recycle bin.',
}

// Pages set their own openGraph, which replaces the layout's wholesale, so the shared parts live here
export const share = {
  openGraph: {
    type: 'profile',
    siteName: 'hpiaia.dev',
    locale: 'en_US',
    firstName: 'Humberto',
    lastName: 'Piaia',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${site.name}, ${resume.role}` }],
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
} satisfies Pick<Metadata, 'openGraph' | 'twitter'>

export const ownHeading: AppKey[] = ['about', 'work']

export const unindexed: AppKey[] = ['display', 'trash']

export function pageTitle(key: AppKey, sub?: string) {
  const job = key === 'work' && findJob(sub)
  if (job) return `${companies(job)}: ${job.title}`
  const album = key === 'winamp' && findAlbum(sub)
  if (album) return `${album.title} by ${album.artist}`
  return titles[key]
}

export function pageDescription(key: AppKey, sub?: string) {
  const album = key === 'winamp' && findAlbum(sub)
  if (album)
    return clip(
      `${album.title} (${album.year}) by ${album.artist}, on Winamp: ${album.tracks
        .slice(0, 4)
        .map((t) => t.title)
        .join(', ')} and more.`,
    )
  const job = key === 'work' && findJob(sub)
  if (!job) return clip(descriptions[key])
  const to = job.to === 'now' ? 'present' : year(job.to)
  return clip(`${job.title} at ${companies(job)}, ${year(job.from)}–${to}. ${plain(job.bullets[0])}`)
}

export const documentTitle = (key: AppKey, sub?: string) =>
  key === 'about' && !sub ? site.title : `${pageTitle(key, sub)} · ${site.name}`

const validSub = (key: AppKey, sub?: string) =>
  (key === 'work' && !!findJob(sub)) || (key === 'winamp' && !!findAlbum(sub))

export const canonical = (key: AppKey, sub?: string) => pathOf(key, validSub(key, sub) ? sub : undefined)

const person: Person = {
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: site.name,
  url: siteUrl,
  image: `${siteUrl}${site.avatar}`,
  jobTitle: resume.role,
  description: site.description,
  address: { '@type': 'PostalAddress', addressRegion: 'Santa Catarina', addressCountry: 'BR' },
  worksFor: {
    '@type': 'Organization',
    name: resume.jobs[0].companies[0].name,
    url: 'url' in resume.jobs[0].companies[0] ? resume.jobs[0].companies[0].url : undefined,
  },
  alumniOf: resume.education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school })),
  knowsAbout: resume.skills.flatMap(([, tools]) => tools.split(', ')),
  knowsLanguage: resume.languages.map(([lang]) => lang),
  sameAs: site.links.filter((l) => l.href.startsWith('https://') && !l.href.startsWith(siteUrl)).map((l) => l.href),
}

export function jsonLd(home: boolean) {
  const website: WebSite = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'hpiaia.dev',
    inLanguage: 'en',
    publisher: { '@id': `${siteUrl}/#person` },
  }
  const profile: ProfilePage = {
    '@type': 'ProfilePage',
    '@id': `${siteUrl}/#profile`,
    url: siteUrl,
    name: site.title,
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: { '@id': `${siteUrl}/#person` },
  }
  const graph: Thing[] = home ? [person, website, profile] : [person, website]
  const data: Graph = { '@context': 'https://schema.org', '@graph': graph }
  // Escape "<" so nothing inside the data can close the script tag
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
