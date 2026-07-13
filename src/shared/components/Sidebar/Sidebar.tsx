import React, { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import styles from './Sidebar.module.css'

const GENERAL_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Pacientes', path: '/pacientes' },
  { icon: CalendarDays, label: 'Turnos', path: '/turnos' },
  { icon: StickyNote, label: 'Notas', path: '/notas' },
  { icon: ClipboardCheck, label: 'Asistencia', path: '/asistencia' },
  { icon: BarChart2, label: 'Informes', path: '/informes' },
]

const TOOLS_ITEMS = [
  { icon: Settings, label: 'Configuración', path: '/configuracion' },
  { icon: LogOut, label: 'Salir', path: '/login' },
]

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Close sidebar on route change for mobile
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [location.pathname])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button
        className={`${styles.mobileToggle} ${isOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar} />}

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
              {GENERAL_ITEMS.map((item) => (
                <SidebarItem key={item.path} {...item} />
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Herramientas</h3>
            <div className={styles.itemsContainer}>
              {TOOLS_ITEMS.map((item) => (
                <SidebarItem key={item.path} {...item} />
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
