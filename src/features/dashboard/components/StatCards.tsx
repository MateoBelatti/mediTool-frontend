import { Users, Calendar } from 'lucide-react'
import styles from './StatCards.module.css'

interface StatCardsProps {
  turnosHoy: number
  reunionesSemanales: number
  turnosLabel?: string
}

export const StatCards = ({
  turnosHoy,
  reunionesSemanales,
  turnosLabel = 'Pacientes Hoy',
}: StatCardsProps) => {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.primary}`}>
          <Users size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>{turnosHoy}</p>
          <p className={styles.cardLabel}>{turnosLabel}</p>
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
