import { Moon, Sun } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useTheme } from '@/shared/theme'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      leftIcon={isDark ? <Sun size={16} /> : <Moon size={16} />}
      aria-pressed={isDark}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {isDark ? 'Modo claro' : 'Modo oscuro'}
    </Button>
  )
}
