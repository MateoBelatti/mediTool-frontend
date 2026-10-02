import { Users, FileText, Calendar } from 'lucide-react'
import styles from './StatCards.module.css'

interface StatCardsProps {
  turnosHoy: number
  informesPendientes: number
  reunionesSemanales: number
}

export const StatCards = ({
  turnosHoy,
  informesPendientes,
  reunionesSemanales,
}: StatCardsProps) => {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.primary}`}>
          <Users size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>{turnosHoy}</p>
          <p className={styles.cardLabel}>Pacientes Hoy</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.warning}`}>
          <FileText size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>{informesPendientes}</p>
          <p className={styles.cardLabel}>Informes Pendientes</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <Calendar size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>{reunionesSemanales}</p>
          <p className={styles.cardLabel}>Reuniones Semanales</p>
        </div>
      </div>
    </div>
  )
}
