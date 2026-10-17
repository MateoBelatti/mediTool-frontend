import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  type Notificacion,
  TipoNotificacion,
} from '../../types/notificaciones.types'
import styles from './NotificationItem.module.css'

interface NotificationItemProps {
  notificacion: Notificacion
  onMarkAsRead: (id: number) => void
  onClosePopover?: () => void
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notificacion,
  onMarkAsRead,
  onClosePopover,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!notificacion.leida) {
      onMarkAsRead(notificacion.id)
    }

    if (notificacion.tipo === TipoNotificacion.TurnosSinAsistencia) {
      onClosePopover?.()
      navigate('/asistencia')
    }
  }

  const renderIcon = () => {
    switch (notificacion.tipo) {
      case TipoNotificacion.TurnosSinAsistencia:
        return (
          <div
            className={`${styles.iconWrapper} ${styles.iconTurnosSinAsistencia}`}
          >
            <ClipboardCheck size={16} />
          </div>
        )
      case TipoNotificacion.RecordatorioEnviado:
        return (
          <div
            className={`${styles.iconWrapper} ${styles.iconRecordatorioEnviado}`}
          >
            <CheckCircle2 size={16} />
          </div>
        )
      case TipoNotificacion.ErrorRecordatorio:
        return (
          <div
            className={`${styles.iconWrapper} ${styles.iconErrorRecordatorio}`}
          >
            <AlertTriangle size={16} />
          </div>
        )
      case TipoNotificacion.Sistema:
      default:
        return (
          <div className={`${styles.iconWrapper} ${styles.iconSistema}`}>
            <Info size={16} />
          </div>
        )
    }
  }

  const timeAgo = formatDistanceToNow(new Date(notificacion.fechaCreacion), {
    addSuffix: true,
    locale: es,
  })

  return (
    <div
      className={`${styles.item} ${!notificacion.leida ? styles.unread : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {renderIcon()}

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h4 className={styles.title} title={notificacion.titulo}>
            {notificacion.titulo}
          </h4>
          {!notificacion.leida && <span className={styles.unreadDot} />}
        </div>

        <p className={styles.message}>{notificacion.mensaje}</p>

        <div className={styles.footerRow}>
          <span className={styles.time}>{timeAgo}</span>
          {notificacion.tipo === TipoNotificacion.TurnosSinAsistencia && (
            <span className={styles.actionHint}>
              Ir a asistencias <ChevronRight size={12} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
