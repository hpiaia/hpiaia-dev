import { useSyncExternalStore } from 'react'

// Command prompt color schemes, named after the `color` attribute codes they mimic
export type Theme = {
  key: string
  label: string
  code: string
  fg: string
  dim: string
  bold: string
  bg: string
  led: string
}

export const themes: Theme[] = [
  {
    key: 'gray',
    label: 'Gray',
    code: '07',
    fg: '#c0c0c0',
    dim: '#808080',
    bold: '#ffffff',
    bg: '#000000',
    led: '#f2f2f2',
  },
  {
    key: 'green',
    label: 'Green',
    code: '0A',
    fg: '#55ff55',
    dim: '#00aa00',
    bold: '#ccffcc',
    bg: '#000000',
    led: '#39ff14',
  },
  {
    key: 'blue',
    label: 'Blue',
    code: '1F',
    fg: '#ffffff',
    dim: '#aaaaaa',
    bold: '#ffff55',
    bg: '#0000a8',
    led: '#4aa8ff',
  },
  {
    key: 'amber',
    label: 'Amber',
    code: '06',
    fg: '#ffb000',
    dim: '#aa7000',
    bold: '#ffe0a0',
    bg: '#000000',
    led: '#ffb000',
  },
]

export const defaultTheme = 'gray'

const listeners = new Set<() => void>()

export function currentTheme() {
  const key = localStorage.getItem('theme')
  return themes.some((t) => t.key === key) ? (key as string) : defaultTheme
}

export const theme = (key: string) => themes.find((t) => t.key === key) ?? themes[0]

export function setTheme(key: string) {
  if (!themes.some((t) => t.key === key)) return
  localStorage.setItem('theme', key)
  listeners.forEach((fn) => fn())
}

export function subscribeTheme(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export const useTheme = () => useSyncExternalStore(subscribeTheme, currentTheme, () => defaultTheme)

export function xtermTheme(key: string) {
  const t = theme(key)
  return {
    background: t.bg,
    foreground: t.fg,
    cursor: t.fg,
    cursorAccent: t.bg,
    selectionBackground: t.fg,
    selectionForeground: t.bg,
    brightWhite: t.bold,
    brightBlack: t.dim,
  }
}
