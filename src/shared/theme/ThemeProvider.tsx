import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext, type Theme } from './theme-context'

const STORAGE_KEY = 'meditool-theme'

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getStoredTheme = (): Theme | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

const persistTheme = (theme: Theme) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    return
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(
    () => getStoredTheme() ?? getSystemTheme()
  )
  const [hasUserPreference, setHasUserPreference] = useState(
    () => getStoredTheme() !== null
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (hasUserPreference) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setThemeState(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [hasUserPreference])

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next)
    setHasUserPreference(true)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
    setHasUserPreference(true)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
