import { Outlet } from 'react-router-dom'
import styles from './MainLayout.module.css'

export const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>MediTool</h1>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} MediTool. All rights reserved.</p>
      </footer>
    </div>
  )
}
