import { useSyncExternalStore } from 'react'

export type Theme = {
  key: string
  label: string
  fg: string
  dim: string
  bold: string
  screen: string
  glow: string
  image: string
}

const tint = 'grayscale(1) invert(1) brightness(0.9) sepia(1)'

export const themes: Theme[] = [
  {
    key: 'gray',
    label: 'gray',
    fg: '#d6d6d2',
    dim: '#7f7f7c',
    bold: '#ffffff',
    screen: '#070707',
    glow: '220 220 215',
    image: 'grayscale(1) invert(1) brightness(0.95) contrast(1.1)',
  },
  {
    key: 'green',
    label: 'green',
    fg: '#9dff9f',
    dim: '#4f9a57',
    bold: '#d8ffd9',
    screen: '#040a06',
    glow: '120 255 140',
    image: `${tint} hue-rotate(65deg) saturate(3) contrast(1.1)`,
  },
  {
    key: 'blue',
    label: 'blue',
    fg: '#7fc8ff',
    dim: '#3f7399',
    bold: '#cfeaff',
    screen: '#03060b',
    glow: '110 190 255',
    image: `${tint} hue-rotate(170deg) saturate(3) contrast(1.1)`,
  },
  {
    key: 'red',
    label: 'red',
    fg: '#ff6b5e',
    dim: '#99433a',
    bold: '#ffc9c2',
    screen: '#0b0303',
    glow: '255 110 95',
    image: `${tint} hue-rotate(-30deg) saturate(3) contrast(1.1)`,
  },
]

export const defaultTheme = 'green'

const listeners = new Set<() => void>()

export function currentTheme() {
  const key = localStorage.getItem('theme')
  return themes.some((t) => t.key === key) ? (key as string) : defaultTheme
}

export const theme = (key: string) => themes.find((t) => t.key === key) ?? themes[1]

export function applyTheme(key = currentTheme()) {
  const t = theme(key)
  const root = document.documentElement
  root.dataset.theme = t.key
  root.style.setProperty('--color-ph', t.fg)
  root.style.setProperty('--color-dim', t.dim)
  root.style.setProperty('--color-screen', t.screen)
  root.style.setProperty('--glow-rgb', t.glow)
  root.style.setProperty('--image-filter', t.image)
}

export function setTheme(key: string) {
  if (!themes.some((t) => t.key === key)) return
  localStorage.setItem('theme', key)
  applyTheme(key)
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
    background: '#00000000',
    foreground: t.fg,
    cursor: t.fg,
    cursorAccent: t.screen,
    selectionBackground: t.fg,
    selectionForeground: t.screen,
    brightWhite: t.bold,
    brightBlack: t.dim,
  }
}
