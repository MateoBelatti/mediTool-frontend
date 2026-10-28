import { useSyncExternalStore } from 'react'

export const COMPACT_LAYOUT_QUERY =
  '(max-width: 1200px), (hover: none), (pointer: coarse)'

export const useMediaQuery = (query: string): boolean => {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {}
      const mediaQueryList = window.matchMedia(query)
      mediaQueryList.addEventListener('change', callback)
      return () => {
        mediaQueryList.removeEventListener('change', callback)
      }
    },
    () =>
      typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
    () => false
  )
}
