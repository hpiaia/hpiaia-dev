import { site } from '@/content/site'

// A tiny C: drive. Paths are stored without the drive, segments joined by backslashes: '' is C:\
export type Entry =
  | { kind: 'dir'; name: string }
  | { kind: 'file'; name: string; lines: string[] }
  | { kind: 'link'; name: string; href: string; alias: string }

export const home = site.user.toUpperCase()

// Long names get the 8.3 treatment, SOUNDCLOUD becomes SOUNDC~1
const short = (name: string) => (name.length > 8 ? `${name.slice(0, 6)}~1` : name).toUpperCase()

export const links: Extract<Entry, { kind: 'link' }>[] = site.links.map((l) => ({
  kind: 'link',
  name: `${short(l.label)}.${l.href.endsWith('.pdf') ? 'PDF' : 'URL'}`,
  href: l.href,
  alias: l.label,
}))

const dirs: Record<string, Entry[]> = {
  '': [{ kind: 'dir', name: home }],
  [home]: [
    { kind: 'file', name: 'ABOUT.TXT', lines: site.about },
    { kind: 'file', name: 'SKILLS.TXT', lines: site.skills.map(([k, v]) => `${k.padEnd(12)}${v}`) },
    { kind: 'file', name: 'NOW.TXT', lines: site.now },
    { kind: 'dir', name: 'LINKS' },
  ],
  [`${home}\\LINKS`]: links,
}

export function normalize(path: string, cwd = home): string {
  let raw = path.replace(/\//g, '\\').toUpperCase()
  if (raw === '~' || raw.startsWith('~\\')) raw = `\\${home}${raw.slice(1)}`
  raw = raw.replace(/^C:/, '')
  const segments = raw.startsWith('\\') ? [] : cwd.split('\\').filter(Boolean)
  for (const segment of raw.split('\\')) {
    if (segment === '' || segment === '.') continue
    // DOS lets `cd ..` at the root quietly stay put
    if (segment === '..') segments.pop()
    else segments.push(segment)
  }
  return segments.join('\\')
}

export const isDir = (path: string) => path in dirs
export const list = (path: string) => dirs[path] ?? []
export const display = (path: string) => `C:\\${path}`

export function resolve(path: string, cwd = home): { path: string; entry?: Entry } | undefined {
  const clean = normalize(path, cwd)
  if (isDir(clean)) return { path: clean }
  const slash = clean.lastIndexOf('\\')
  const dir = slash === -1 ? '' : clean.slice(0, slash)
  const name = clean.slice(slash + 1)
  const entry = dirs[dir]?.find((e) => e.name === name || (e.kind === 'link' && e.alias.toUpperCase() === name))
  return entry ? { path: clean, entry } : undefined
}

export function contents(entry: Entry) {
  if (entry.kind === 'file') return entry.lines
  if (entry.kind === 'link') return ['[InternetShortcut]', `URL=${entry.href}`]
  return []
}

export function size(entry: Entry) {
  const text = contents(entry)
    .join('\r\n')
    .replace(/\x1b\[[0-9;]*m/g, '')
  return new TextEncoder().encode(text).length
}

export function completions(partial: string, cwd = home) {
  const slash = Math.max(partial.lastIndexOf('\\'), partial.lastIndexOf('/'))
  const prefix = partial.slice(0, slash + 1)
  const dir = normalize(prefix || '.', cwd)
  const start = partial.slice(slash + 1).toUpperCase()
  return list(dir)
    .filter((e) => e.name.startsWith(start))
    .map((e) => `${prefix}${e.name}${e.kind === 'dir' ? '\\' : ''}`)
}
