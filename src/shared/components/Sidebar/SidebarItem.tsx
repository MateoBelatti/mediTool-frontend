import React from 'react'
import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import styles from './Sidebar.module.css'

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  path: string
  onClick?: () => void
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  path,
  onClick,
}) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `${styles.sidebarItem} ${isActive ? styles.active : ''}`
      }
    >
      <Icon className={styles.icon} size={20} />
      <span className={styles.label}>{label}</span>
    </NavLink>
  )
}
