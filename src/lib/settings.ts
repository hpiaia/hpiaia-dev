import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { defaultFont, fonts } from '@/lib/fonts'
import { defaultTheme, themes } from '@/lib/theme'
import { settingsKey, wallpapers } from '@/lib/settings-script'

export const appearances = ['light', 'dark'] as const
export const views = ['screen', 'desk'] as const

export type Appearance = (typeof appearances)[number]
export type Wallpaper = (typeof wallpapers)[number]
export type View = (typeof views)[number]

type Settings = {
  appearance: Appearance
  wallpaper: Wallpaper
  view: View
  sound: 'on' | 'off'
  colors: string
  font: string
}

const defaults: Settings = {
  appearance: 'light',
  wallpaper: 'teal',
  view: 'screen',
  sound: 'on',
  colors: defaultTheme,
  font: defaultFont,
}

const allowed: { [K in keyof Settings]: readonly Settings[K][] } = {
  appearance: appearances,
  wallpaper: wallpapers,
  view: views,
  sound: ['on', 'off'],
  colors: themes.map((t) => t.key),
  font: fonts.map((f) => f.key),
}

// Saved values are checked on the way in, so a stale or hand-edited entry falls back to the default
function valid(saved: unknown): Partial<Settings> {
  const entries = Object.entries((saved ?? {}) as Record<string, unknown>)
  return Object.fromEntries(
    entries.filter(([key, value]) =>
      (allowed[key as keyof Settings] as readonly unknown[] | undefined)?.includes(value),
    ),
  )
}

export const useSettings = create<Settings>()(
  persist(() => defaults, {
    name: settingsKey,
    storage: createJSONStorage(() => localStorage),
    merge: (saved, current) => ({ ...current, ...valid(saved) }),
  }),
)

export const useSetting = <K extends keyof Settings>(key: K) => useSettings((s) => s[key])
export const getSetting = <K extends keyof Settings>(key: K) => useSettings.getState()[key]
export const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) =>
  useSettings.setState({ [key]: value })

// The scheme and wallpaper are CSS selectors on <html>; the inline script in the layout sets them before paint
if (typeof document !== 'undefined') {
  const apply = ({ appearance, wallpaper }: Settings) => {
    document.documentElement.dataset.appearance = appearance
    document.documentElement.dataset.wallpaper = wallpaper
  }
  apply(useSettings.getState())
  useSettings.subscribe(apply)
}
