import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shared/components/Sidebar'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)

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
