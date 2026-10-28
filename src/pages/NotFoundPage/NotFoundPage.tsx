import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          La página que buscás no existe o fue movida.
        </p>
        <Link to="/" className={styles.link}>
          <Home size={18} />
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
