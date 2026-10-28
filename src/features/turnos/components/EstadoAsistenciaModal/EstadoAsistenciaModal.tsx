import React from 'react'
import { type Turno, EstadoTurno } from '@/features/turnos/types/turnos.types'
import { X, Check, XCircle, Clock, Calendar, Ban } from 'lucide-react'
import styles from './EstadoAsistenciaModal.module.css'

interface EstadoAsistenciaModalProps {
  isOpen: boolean
  onClose: () => void
  turno: Turno | null
  onSave: (
    estado: EstadoTurno,
    justificada?: boolean,
    observaciones?: string
  ) => void
}

export const EstadoAsistenciaModal: React.FC<EstadoAsistenciaModalProps> = ({
  isOpen,
  onClose,
  turno,
  onSave,
}) => {
  const [selectedEstado, setSelectedEstado] =
    React.useState<EstadoTurno | null>(null)
  const [justificada, setJustificada] = React.useState(
    turno?.justificada || false
  )
  const [observaciones, setObservaciones] = React.useState(
    turno?.observaciones || ''
  )

  React.useEffect(() => {
    if (turno) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedEstado(turno.estado as unknown as EstadoTurno)

      setJustificada(turno.justificada || false)

      setObservaciones(turno.observaciones || '')
    }
  }, [turno])

  if (!isOpen || !turno) return null

  const getAllowedStates = (currentState: string): EstadoTurno[] => {
    switch (currentState) {
      case 'Pendiente':
      case 'Reprogramado':
        return [
          EstadoTurno.Presente,
          EstadoTurno.Ausente,
          EstadoTurno.Cancelado,
        ]
      case 'Presente':
      case 'Ausente':
        return [EstadoTurno.Presente, EstadoTurno.Ausente]
      default:
        return []
    }
  }

  const allowedStates = getAllowedStates(turno.estado)

  const handleSaveClick = () => {
    if (selectedEstado) {
      onSave(selectedEstado, justificada, observaciones)
      onClose()
    }
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
  ].filter((opt) => allowedStates.includes(opt.value as EstadoTurno))

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
          {allowedStates.length > 0 ? (
            <>
              <p className={styles.instruction}>
                Selecciona el estado del turno:
              </p>
              <div className={styles.optionsList}>
                {estadoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`${styles.optionBtn} ${opt.colorClass} ${selectedEstado === opt.value ? styles.selected : ''}`}
                    onClick={() => setSelectedEstado(opt.value)}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>

              {selectedEstado === EstadoTurno.Ausente && (
                <div
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={justificada}
                      onChange={(e) => setJustificada(e.target.checked)}
                    />
                    Ausencia Justificada
                  </label>
                  <textarea
                    placeholder="Observaciones (opcional)"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      resize: 'vertical',
                    }}
                    rows={3}
                  />
                </div>
              )}

              <button
                onClick={handleSaveClick}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Guardar
              </button>
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px 0' }}>
              El estado actual ({turno.estado}) no permite ser modificado.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
