import { site } from '@/content/site'

export type File = { name: string; lines: string[] } | { name: string; href: string }

export const home: File[] = [
  { name: 'about.txt', lines: site.about },
  { name: 'skills.txt', lines: site.skills },
  { name: 'now.txt', lines: site.now },
]

export const links: File[] = site.links.map((link) => ({ name: link.label, href: link.href }))

const dirs: Record<string, File[]> = {
  '': [...home, { name: 'links', href: '' }],
  links,
}

export const root = `/home/${site.user}`

export function normalize(path: string, cwd = ''): string | undefined {
  const absolute = path.startsWith('~') || path.startsWith('/')
  const stripped = path.replace(/^~/, '').replace(new RegExp(`^${root}`), '')
  const segments = absolute ? [] : cwd.split('/').filter(Boolean)
  for (const segment of stripped.split('/')) {
    if (segment === '' || segment === '.') continue
    if (segment === '..') {
      if (!segments.length) return undefined
      segments.pop()
      continue
    }
    segments.push(segment)
  }
  return segments.join('/')
}

export function isDir(path: string) {
  return path in dirs
}

export function resolve(path: string, cwd = ''): File | File[] | undefined {
  const clean = normalize(path, cwd)
  if (clean === undefined) return undefined
  if (isDir(clean)) return dirs[clean]
  const slash = clean.lastIndexOf('/')
  const dir = slash === -1 ? '' : clean.slice(0, slash)
  return dirs[dir]?.find((f) => f.name === clean.slice(slash + 1))
}

export function completions(partial: string, cwd = '') {
  const slash = partial.lastIndexOf('/')
  const prefix = partial.slice(0, slash + 1)
  const dir = normalize(prefix, cwd)
  if (dir === undefined || !isDir(dir)) return []
  return dirs[dir]
    .map((f) => `${prefix}${f.name}${'href' in f && !f.href ? '/' : ''}`)
    .filter((n) => n.startsWith(partial))
}

export function pwd(cwd: string) {
  return cwd ? `${root}/${cwd}` : root
}

export function tilde(cwd: string) {
  return cwd ? `~/${cwd}` : '~'
}
