import { albums } from '@/content/albums'
import { type Game, games } from '@/content/games'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import type { AppKey } from '@/lib/apps'
import { plain } from '@/lib/markdown'
import { companies, period, wrap } from '@/lib/utils'

// What `start` does with a file: open an app (at a sub page) or try to run a game
export type Launch = { app: AppKey; sub?: string } | { game: Game }

// A tiny C: drive. Paths are stored without the drive, segments joined by backslashes: '' is C:\
// `long` is the Windows long name, shown by dir; `alias` is what `start` also answers to
export type Entry =
  | { kind: 'dir'; name: string }
  | { kind: 'file'; name: string; lines: string[]; long?: string; alias?: string; launch?: Launch }
  | { kind: 'link'; name: string; href: string; alias: string }

export const home = site.user.toUpperCase()

// Long names get the 8.3 treatment: SOUNDCLOUD becomes SOUNDC~1, Last Chaos becomes LASTCH~1
const short = (name: string) => {
  const clean = name.replace(/[^a-z0-9]/gi, '').toUpperCase()
  return clean.length > 8 ? `${clean.slice(0, 6)}~1` : clean
}

export const links: Extract<Entry, { kind: 'link' }>[] = site.links.map((l) => ({
  kind: 'link',
  name: `${short(l.label)}.${l.href.endsWith('.pdf') ? 'PDF' : 'URL'}`,
  href: l.href,
  alias: l.label,
}))

const location = resume.contacts.find((c) => c.key === 'Location')?.text
const column = (label: string, text: string) =>
  wrap(text, 52).map((line, i) => `${i ? '' : `  ${label}`}`.padEnd(20) + line)

// The same words as the About Me window
const about = [
  site.name,
  `${resume.role} · ${location}`,
  '',
  ...site.bio.flatMap((p) => [...wrap(p), '']),
  ...site.now.map((line) => `${line.split(': ')[0].padEnd(9)}${line.split(': ')[1]}`),
]

// The same rows as the Skills window
const skills = [
  'Technical',
  ...resume.skills.flatMap(([area, tools]) => column(area, tools)),
  '',
  'Education',
  ...resume.education.flatMap((e) => column(e.field, `${e.school}, ${e.from}-${e.to}`)),
  '',
  'Spoken languages',
  ...resume.languages.flatMap(([lang, level]) => column(lang, level)),
]

const jobs: Entry[] = resume.jobs.map((job) => ({
  kind: 'file',
  name: `${short(job.slug)}.TXT`,
  long: `${companies(job)}.txt`,
  alias: job.slug,
  launch: { app: 'work', sub: job.slug },
  lines: [
    companies(job),
    `${job.title} · ${period(job.from, job.to)}`,
    '',
    ...job.bullets.flatMap((b) => wrap(`- ${plain(b)}`, 72, '  ')),
  ],
}))

// Desktop shortcuts to games that live on a CD nobody inserted
const shortcuts: Entry[] = games.map((game) => ({
  kind: 'file',
  name: `${short(game.title)}.LNK`,
  long: `${game.title}.lnk`,
  alias: game.label.replace(/\s+/g, '').toLowerCase(),
  launch: { game },
  lines: ['[Shortcut]', `Target=D:\\${short(game.title)}.EXE`],
}))

// The albums Winamp plays, one playlist each
const playlists: Entry[] = albums.map((album) => ({
  kind: 'file',
  name: `${short(album.title)}.M3U`,
  long: `${album.artist} - ${album.title}.m3u`,
  alias: album.slug,
  launch: { app: 'winamp', sub: album.slug },
  lines: [
    '#EXTM3U',
    ...album.tracks.flatMap((t) => [
      `#EXTINF:${t.seconds},${album.artist} - ${t.title}`,
      `https://youtu.be/${t.youtube}`,
    ]),
  ],
}))

const dirs: Record<string, Entry[]> = {
  '': [{ kind: 'dir', name: home }],
  [home]: [
    { kind: 'file', name: 'ABOUT.TXT', lines: about },
    { kind: 'file', name: 'SKILLS.TXT', lines: skills },
    { kind: 'file', name: 'NOW.TXT', lines: site.now },
    { kind: 'dir', name: 'WORK' },
    { kind: 'dir', name: 'GAMES' },
    { kind: 'dir', name: 'MUSIC' },
    { kind: 'dir', name: 'LINKS' },
  ],
  [`${home}\\WORK`]: jobs,
  [`${home}\\GAMES`]: shortcuts,
  [`${home}\\MUSIC`]: playlists,
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
  const entry = dirs[dir]?.find(
    (e) => e.kind !== 'dir' && (e.name === name || e.name.split('.')[0] === name || e.alias?.toUpperCase() === name),
  )
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
