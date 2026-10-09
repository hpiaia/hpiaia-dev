import { useSyncExternalStore } from 'react'

export function useMedia(query: string) {
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
