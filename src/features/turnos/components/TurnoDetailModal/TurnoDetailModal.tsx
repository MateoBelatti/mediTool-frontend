import React, { useState } from 'react'
import { CalendarClock, User as UserIcon, Clock, Edit2 } from 'lucide-react'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { type Turno, EstadoTurno } from '../../types/turnos.types'
import {
  useCambiarEstadoTurno,
  useReprogramarTurno,
} from '../../hooks/useTurnos'
import styles from './TurnoDetailModal.module.css'

interface TurnoDetailModalProps {
  turno: Turno | null
  isOpen: boolean
  onClose: () => void
}

const ESTADO_LABELS: Record<EstadoTurno, string> = {
  [EstadoTurno.Pendiente]: 'Pendiente',
  [EstadoTurno.Presente]: 'Presente',
  [EstadoTurno.Cancelado]: 'Cancelado',
  [EstadoTurno.Reprogramado]: 'Reprogramado',
  [EstadoTurno.Ausente]: 'Ausente',
}

export const TurnoDetailModal = ({
  turno,
  isOpen,
  onClose,
}: TurnoDetailModalProps) => {
  const cambiarEstadoMutation = useCambiarEstadoTurno()
  const reprogramarMutation = useReprogramarTurno()

  const [isReprogramando, setIsReprogramando] = useState(false)
  const [nuevaFechaHora, setNuevaFechaHora] = useState('')

  if (!turno) return null

  const handleEstadoChange = (nuevoEstado: EstadoTurno) => {
    cambiarEstadoMutation.mutate(
      { id: turno.id, nuevoEstado },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleReprogramar = () => {
    if (!nuevaFechaHora) return
    reprogramarMutation.mutate(
      { id: turno.id, nuevaFechaHora },
      {
        onSuccess: () => {
          setIsReprogramando(false)
          onClose()
        },
      }
    )
  }

  const formatHora = (fechaString: string) => {
    const date = new Date(fechaString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatFecha = (fechaString: string) => {
    const date = new Date(fechaString)
    return date.toLocaleDateString()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Turno">
      <div className={styles.container}>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <UserIcon className={styles.icon} />
            <div>
              <p className={styles.label}>Paciente</p>
              <p className={styles.value}>
                {turno.paciente?.nombre} {turno.paciente?.apellido}
              </p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <CalendarClock className={styles.icon} />
            <div>
              <p className={styles.label}>Fecha</p>
              <p className={styles.value}>{formatFecha(turno.fechaHora)}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Clock className={styles.icon} />
            <div>
              <p className={styles.label}>Horario y Duración</p>
              <p className={styles.value}>
                {formatHora(turno.fechaHora)} - {turno.duracionMin} minutos
              </p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.statusBadge}>
              {ESTADO_LABELS[turno.estado]}
            </div>
          </div>
        </div>

        {isReprogramando ? (
          <div className={styles.reprogramarSection}>
            <h3 className={styles.sectionTitle}>Reprogramar Turno</h3>
            <div className={styles.inputGroup}>
              <label>Nueva Fecha y Hora</label>
              <input
                type="datetime-local"
                value={nuevaFechaHora}
                onChange={(e) => setNuevaFechaHora(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.actions}>
              <Button
                variant="outline"
                onClick={() => setIsReprogramando(false)}
                disabled={reprogramarMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReprogramar}
                isLoading={reprogramarMutation.isPending}
              >
                Confirmar Reprogramación
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.actionsSection}>
            <h3 className={styles.sectionTitle}>Acciones</h3>
            <div className={styles.buttonGrid}>
              {turno.estado === EstadoTurno.Pendiente && (
                <>
                  <Button
                    variant="primary"
                    onClick={() => handleEstadoChange(EstadoTurno.Presente)}
                    isLoading={cambiarEstadoMutation.isPending}
                  >
                    Marcar Presente
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsReprogramando(true)}
                    leftIcon={<Edit2 size={16} />}
                  >
                    Reprogramar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleEstadoChange(EstadoTurno.Cancelado)}
                    isLoading={cambiarEstadoMutation.isPending}
                  >
                    Cancelar Turno
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEstadoChange(EstadoTurno.Ausente)}
                    isLoading={cambiarEstadoMutation.isPending}
                  >
                    Marcar Ausente
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
