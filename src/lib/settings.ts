import { useSyncExternalStore } from 'react'

import { wallpapers } from '@/lib/wallpapers'

export const appearances = ['light', 'dark'] as const
export const views = ['screen', 'desk'] as const

export type Appearance = (typeof appearances)[number]
export type Wallpaper = (typeof wallpapers)[number]
export type View = (typeof views)[number]

type Settings = { appearance: Appearance; wallpaper: Wallpaper; view: View; sound: 'on' | 'off' }

const defaults: Settings = { appearance: 'light', wallpaper: 'teal', view: 'screen', sound: 'on' }
const allowed: { [K in keyof Settings]: readonly Settings[K][] } = {
  appearance: appearances,
  wallpaper: wallpapers,
  view: views,
  sound: ['on', 'off'],
}

const listeners = new Set<() => void>()

function read<K extends keyof Settings>(key: K): Settings[K] {
  const value = localStorage.getItem(key) as Settings[K] | null
  return value && allowed[key].includes(value) ? value : defaults[key]
}

export function applySettings() {
  const root = document.documentElement
  root.dataset.appearance = read('appearance')
  root.dataset.wallpaper = read('wallpaper')
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  localStorage.setItem(key, value)
  applySettings()
  listeners.forEach((fn) => fn())
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function useSetting<K extends keyof Settings>(key: K) {
  return useSyncExternalStore(
    subscribe,
    () => read(key),
    () => defaults[key],
  )
}
