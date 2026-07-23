import { Users, FileText, Calendar } from 'lucide-react'
import styles from './StatCards.module.css'

export const StatCards = () => {
  return (
    <div className={styles.cardsContainer}>
      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.primary}`}>
          <Users size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>12</p>
          <p className={styles.cardLabel}>Pacientes Hoy</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.warning}`}>
          <FileText size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>3</p>
          <p className={styles.cardLabel}>Informes Pendientes</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.iconWrapper} ${styles.success}`}>
          <Calendar size={24} />
        </div>
        <div className={styles.cardContent}>
          <p className={styles.cardValue}>5</p>
          <p className={styles.cardLabel}>Reuniones Semanales</p>
        </div>
      </div>
    </div>
  )
}
