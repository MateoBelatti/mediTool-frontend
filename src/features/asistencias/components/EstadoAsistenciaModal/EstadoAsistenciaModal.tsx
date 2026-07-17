import React from 'react'
import { type Turno, EstadoTurno } from '@/features/turnos/types/turnos.types'
import { X, Check, XCircle, Clock, Calendar, Ban } from 'lucide-react'
import styles from './EstadoAsistenciaModal.module.css'

interface EstadoAsistenciaModalProps {
  isOpen: boolean
  onClose: () => void
  turno: Turno | null
  onSave: (estado: EstadoTurno) => void
}

export const EstadoAsistenciaModal: React.FC<EstadoAsistenciaModalProps> = ({
  isOpen,
  onClose,
  turno,
  onSave,
}) => {
  if (!isOpen || !turno) return null

  const handleEstadoSelect = (estado: EstadoTurno) => {
    onSave(estado)
  }

  const estadoOptions = [
    {
      value: EstadoTurno.Pendiente,
      label: 'Pendiente',
      icon: <Clock size={20} />,
      colorClass: styles.optPendiente,
    },
    {
      value: EstadoTurno.Presente,
      label: 'Presente',
      icon: <Check size={20} />,
      colorClass: styles.optPresente,
    },
    {
      value: EstadoTurno.Ausente,
      label: 'Ausente',
      icon: <XCircle size={20} />,
      colorClass: styles.optAusente,
    },
    {
      value: EstadoTurno.Reprogramado,
      label: 'Reprogramado',
      icon: <Calendar size={20} />,
      colorClass: styles.optReprogramado,
    },
    {
      value: EstadoTurno.Cancelado,
      label: 'Cancelado',
      icon: <Ban size={20} />,
      colorClass: styles.optCancelado,
    },
  ]

  const dateStr = new Date(turno.fechaHora).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const timeStr = new Date(turno.fechaHora).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const pacienteNombre = turno.paciente
    ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
    : `Paciente #${turno.pacienteId}`

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Estado de Asistencia</h3>
            <p className={styles.subtitle}>
              {pacienteNombre} • {dateStr} {timeStr}
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.instruction}>Selecciona el estado del turno:</p>
          <div className={styles.optionsList}>
            {estadoOptions.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.optionBtn} ${opt.colorClass} ${turno.estado === opt.value ? styles.selected : ''}`}
                onClick={() => handleEstadoSelect(opt.value)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
