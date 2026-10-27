import type { Metadata } from 'next'
import type { BreadcrumbList, Graph, Organization, Person, ProfilePage, Thing, WebPage, WebSite } from 'schema-dts'

import { findAlbum } from '@/content/albums'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { type AppKey, pathOf } from '@/lib/apps'
import { clip as clipTo, companies, year } from '@/lib/utils'

// Vercel redirects the apex to www, so www is the host every canonical, sitemap and schema URL uses
export const siteUrl = 'https://www.hpiaia.dev'

const clip = (text: string) => clipTo(text, 158)

const findJob = (slug?: string) => resume.jobs.find((j) => j.slug === slug)

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
  cv: `${site.name}'s resume as a PDF: ${resume.role.toLowerCase()}, TypeScript, Node.js, Go, AWS and Terraform.`,
  terminal: `A DOS-style command prompt with ${site.name}'s bio, skills and links. Try dir, type about.txt or ls.`,
  skills: `Skills of ${site.name}: ${resume.skills
    .slice(0, 4)
    .map(([, tools]) => tools.split(', ').slice(0, 2).join(', '))
    .join(', ')} and more, plus education and languages.`,
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
  twitter: { card: 'summary_large_image', creator: '@hpiaiadev', images: ['/opengraph-image'] },
} satisfies Pick<Metadata, 'openGraph' | 'twitter'>

export const ownHeading: AppKey[] = ['about', 'work']

// Settings, toys and the pdf viewer: nothing a search result should land on (/resume.pdf is indexed instead of /cv)
export const unindexed: AppKey[] = ['cv', 'terminal', 'music', 'winamp', 'display', 'trash']

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
  return clip(`${job.title} at ${companies(job)}, ${year(job.from)}–${to}: ${job.summary}`)
}

export const documentTitle = (key: AppKey, sub?: string) =>
  key === 'about' && !sub ? site.title : `${pageTitle(key, sub)} · ${site.name}`

// The page's h1 when the window has no heading of its own: the retro window title stays as chrome
export const pageHeading = (key: AppKey, sub?: string) => `${site.name}: ${pageTitle(key, sub)}`

const validSub = (key: AppKey, sub?: string) =>
  (key === 'work' && !!findJob(sub)) || (key === 'winamp' && !!findAlbum(sub))

export const canonical = (key: AppKey, sub?: string) => pathOf(key, validSub(key, sub) ? sub : undefined)

const slugify = (name: string) => name.toLowerCase().replace(/\W+/g, '-')
const orgId = (name: string) => `${siteUrl}/#org-${slugify(name)}`
const personRef = { '@id': `${siteUrl}/#person` }
const websiteRef = { '@id': `${siteUrl}/#website` }

const organizations: Organization[] = resume.jobs.flatMap((job) =>
  job.companies.map((c: { name: string; url?: string }) => ({
    '@type': 'Organization',
    '@id': orgId(c.name),
    name: c.name,
    ...(c.url && { url: c.url }),
  })),
)

const person: Person = {
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: site.name,
  givenName: 'Humberto',
  familyName: 'Piaia',
  url: `${siteUrl}/`,
  image: `${siteUrl}${site.avatar}`,
  jobTitle: resume.role,
  description: site.description,
  address: { '@type': 'PostalAddress', addressRegion: 'Santa Catarina', addressCountry: 'BR' },
  worksFor: resume.jobs[0].companies.map((c) => ({ '@id': orgId(c.name) })),
  alumniOf: resume.education.map((e) => ({
    '@type': 'CollegeOrUniversity',
    name: e.school,
    url: 'https://www.uffs.edu.br',
  })),
  knowsAbout: resume.skills.flatMap(([, tools]) => tools.split(', ')),
  knowsLanguage: resume.languages.map(([lang]) => lang),
  sameAs: site.links.filter((l) => l.href.startsWith('https://') && !l.href.startsWith(siteUrl)).map((l) => l.href),
}

const website: WebSite = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: 'hpiaia.dev',
  inLanguage: 'en',
  publisher: personRef,
}

function breadcrumbs(key: AppKey, sub?: string): BreadcrumbList {
  const job = key === 'work' ? findJob(sub) : undefined
  const trail = [
    { name: 'Home', path: '/' },
    { name: titles[key], path: pathOf(key) },
    ...(job ? [{ name: companies(job), path: pathOf(key, job.slug) }] : []),
  ]
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${siteUrl}${t.path}`,
    })),
  }
}

// The full Person and its employers ride on every page, tied together by @id, so each page stands on its own
export function jsonLd(key: AppKey, sub?: string) {
  const home = key === 'about'
  const path = canonical(key, sub)
  const url = `${siteUrl}${path}`
  const page: ProfilePage | WebPage = home
    ? {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profile`,
        url: `${siteUrl}/`,
        name: site.title,
        inLanguage: 'en',
        dateModified: site.updated,
        isPartOf: websiteRef,
        mainEntity: personRef,
      }
    : {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: documentTitle(key, sub),
        description: pageDescription(key, sub),
        inLanguage: 'en',
        dateModified: site.updated,
        isPartOf: websiteRef,
        about: personRef,
        breadcrumb: breadcrumbs(key, sub),
      }
  const graph: Thing[] = [person, ...organizations, website, page]
  const data: Graph = { '@context': 'https://schema.org', '@graph': graph }
  // Escape "<" so nothing inside the data can close the script tag
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
