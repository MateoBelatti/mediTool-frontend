import { useNavigate } from 'react-router-dom'
import {
  CalendarPlus,
  UserPlus,
  FileText,
  LayoutDashboard,
  Zap,
} from 'lucide-react'
import styles from './QuickActions.module.css'

export const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Zap size={20} className={styles.icon} />
        <h3>Acciones Rápidas</h3>
      </div>

      <div className={styles.actionsGrid}>
        <button
          className={styles.actionBtn}
          onClick={() => navigate('/turnos', { state: { openNewModal: true } })}
        >
          <div className={`${styles.iconWrapper} ${styles.blue}`}>
            <CalendarPlus size={20} />
          </div>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>Nuevo Turno</span>
            <span className={styles.btnSubtitle}>Programar consulta</span>
          </div>
        </button>

        <button
          className={styles.actionBtn}
          onClick={() =>
            navigate('/pacientes', { state: { openNewModal: true } })
          }
        >
          <div className={`${styles.iconWrapper} ${styles.green}`}>
            <UserPlus size={20} />
          </div>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>Nuevo Paciente</span>
            <span className={styles.btnSubtitle}>Alta en sistema</span>
          </div>
        </button>

        <button
          className={styles.actionBtn}
          onClick={() =>
            navigate('/informes', { state: { openNewModal: true } })
          }
        >
          <div className={`${styles.iconWrapper} ${styles.purple}`}>
            <FileText size={20} />
          </div>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>Nuevo Informe</span>
            <span className={styles.btnSubtitle}>Redactar documento</span>
          </div>
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => navigate('/pacientes')}
        >
          <div className={`${styles.iconWrapper} ${styles.orange}`}>
            <LayoutDashboard size={20} />
          </div>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>Mis Pacientes</span>
            <span className={styles.btnSubtitle}>Ver directorio</span>
          </div>
        </button>
      </div>
    </div>
  )
}
