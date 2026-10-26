import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shared/components/Sidebar'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const isCompact = useMediaQuery('(max-width: 1200px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isCompact)
  const [prevIsCompact, setPrevIsCompact] = useState(isCompact)

  if (isCompact !== prevIsCompact) {
    setPrevIsCompact(isCompact)
    if (isCompact) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`${styles.contentWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
