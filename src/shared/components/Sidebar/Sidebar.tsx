import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  StickyNote,
  ClipboardCheck,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Activity,
  Stethoscope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import styles from './Sidebar.module.css'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import {
  COMPACT_LAYOUT_QUERY,
  useMediaQuery,
} from '@/shared/hooks/useMediaQuery'

interface GeneralItem {
  icon: LucideIcon
  label: string
  path: string
  adminOnly?: boolean
}

const GENERAL_ITEMS: GeneralItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Pacientes', path: '/pacientes' },
  {
    icon: Stethoscope,
    label: 'Profesionales',
    path: '/profesionales',
    adminOnly: true,
  },
  { icon: CalendarDays, label: 'Turnos', path: '/turnos' },
  { icon: StickyNote, label: 'Reuniones', path: '/reuniones' },
  { icon: ClipboardCheck, label: 'Asistencia', path: '/asistencia' },
  { icon: BarChart2, label: 'Informes', path: '/informes' },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const isCompact = useMediaQuery(COMPACT_LAYOUT_QUERY)

  // Close sidebar on route change for compact screens
  useEffect(() => {
    if (isCompact) {
      setIsOpen(false)
    }
  }, [location.pathname, setIsOpen, isCompact])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    if (isCompact) {
      setIsOpen(false)
    }
    logout()
  }

  const toolsItems = [
    { icon: Settings, label: 'Configuración', path: '/configuracion' },
    { icon: LogOut, label: 'Salir', onClick: handleLogout },
  ]

  return (
    <>
      <button
        className={`${styles.mobileToggle} ${isOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Overlay for compact when sidebar is open */}
      {isOpen && isCompact && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Activity className={styles.logoIcon} size={28} />
            <h2>MediTool</h2>
          </div>
          <span className={styles.badge}>3</span>
        </div>

        <nav className={styles.navigation}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>General</h3>
            <div className={styles.itemsContainer}>
              {GENERAL_ITEMS.filter((item) => !item.adminOnly || isAdmin).map(
                (item) => (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                  />
                )
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Herramientas</h3>
            <div className={styles.itemsContainer}>
              {toolsItems.map((item) => (
                <SidebarItem key={item.path || item.label} {...item} />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
