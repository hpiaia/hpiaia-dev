import { site } from '@/content/site'

export type File = { name: string; lines: string[] } | { name: string; href: string }

export const home: File[] = [
  { name: 'about.txt', lines: site.about },
  { name: 'skills.txt', lines: site.skills },
  { name: 'now.txt', lines: site.now },
]

export const links: File[] = site.links.map((link) => ({ name: link.label, href: link.href }))

export function resolve(path: string): File | File[] | undefined {
  const clean = path.replace(/^~\/?/, '').replace(/\/$/, '')
  if (clean === '' || clean === '.') return [...home, { name: 'links', href: '' }]
  if (clean === 'links') return links
  if (clean.startsWith('links/')) return links.find((f) => f.name === clean.slice(6))
  return home.find((f) => f.name === clean)
}

export function completions(partial: string) {
  if (partial.startsWith('links/')) return links.map((f) => `links/${f.name}`).filter((n) => n.startsWith(partial))
  return [...home.map((f) => f.name), 'links/'].filter((n) => n.startsWith(partial))
}
