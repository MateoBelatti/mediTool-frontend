import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/shared/components/Sidebar'
import { Footer } from '@/shared/components/Footer'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
