export type AppKey =
  'about' | 'work' | 'cv' | 'terminal' | 'skills' | 'contact' | 'music' | 'winamp' | 'credits' | 'display'

export type App = {
  key: AppKey
  title: string
  label: string
  size: [number, number]
  side: 'left' | 'right'
}

export const apps: App[] = [
  { key: 'about', title: 'About Me - WordPad', label: 'About Me', size: [720, 620], side: 'left' },
  { key: 'work', title: 'Exploring - Work', label: 'Work', size: [880, 600], side: 'left' },
  { key: 'cv', title: 'resume.pdf', label: 'Resume', size: [860, 880], side: 'left' },
  { key: 'terminal', title: 'Command Prompt', label: 'Terminal', size: [740, 480], side: 'left' },
  { key: 'skills', title: 'Skills', label: 'Skills', size: [660, 440], side: 'left' },
  { key: 'contact', title: 'Say Hi', label: 'Say Hi', size: [460, 420], side: 'left' },
  { key: 'music', title: 'Media Player', label: 'Music', size: [540, 480], side: 'right' },
  { key: 'winamp', title: 'Winamp', label: 'Winamp', size: [680, 476], side: 'right' },
  { key: 'credits', title: 'About hpiaia97', label: 'Help', size: [500, 520], side: 'right' },
  { key: 'display', title: 'Display Properties', label: 'Display', size: [420, 520], side: 'right' },
]

export const app = (key: AppKey) => apps.find((a) => a.key === key) as App

// URL path for a window. The resume app lives at /cv since /resume serves the pdf itself
export function pathOf(key: AppKey, sub?: string) {
  if (key === 'about' && !sub) return '/'
  return `/${key}${sub ? `/${sub}` : ''}`
}

export function parsePath(segments: string[] = []): { key: AppKey; sub?: string } | null {
  const [first, sub] = segments
  const found = apps.find((a) => a.key === first)
  return found ? { key: found.key, sub } : null
}
