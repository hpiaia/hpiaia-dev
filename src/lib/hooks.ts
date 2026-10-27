import { useEffect, useSyncExternalStore } from 'react'

import { keyDown, keyUp, warm } from '@/lib/keys'
import { getSetting } from '@/lib/settings'

function useMedia(query: string) {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useMobile = () => useMedia('(pointer: coarse), (hover: none)')
export const usePortrait = () => useMedia('(max-aspect-ratio: 1/1)')

export function useClock() {
  return useSyncExternalStore(
    (fn) => {
      const timer = setInterval(fn, 10_000)
      return () => clearInterval(timer)
    },
    () => new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
    () => '',
  )
}

// Capture phase, so inputs that stop propagation (the terminal, Find) still click
export function useKeyboardSounds() {
  useEffect(() => {
    const sound = (play: (key: string) => void) => (e: KeyboardEvent) => {
      if (getSetting('sound') === 'on' && !e.metaKey && !e.ctrlKey && !e.repeat) play(e.key)
    }
    const down = sound(keyDown)
    const up = sound(keyUp)
    window.addEventListener('keydown', down, true)
    window.addEventListener('keyup', up, true)
    window.addEventListener('pointerdown', warm, { once: true })
    return () => {
      window.removeEventListener('keydown', down, true)
      window.removeEventListener('keyup', up, true)
      window.removeEventListener('pointerdown', warm)
    }
  }, [])
}
