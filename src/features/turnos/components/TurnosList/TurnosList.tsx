import React from 'react'
import { CalendarClock, User as UserIcon, Clock } from 'lucide-react'
import type { Turno } from '../../types/turnos.types'
import { EstadoTurno } from '../../types/turnos.types'
import styles from './TurnosList.module.css'

interface TurnosListProps {
  turnos: Turno[]
  isLoading: boolean
  onTurnoClick: (turno: Turno) => void
  pacienteSearch: string
}

const ESTADO_LABELS: Record<EstadoTurno, string> = {
  [EstadoTurno.Pendiente]: 'Pendiente',
  [EstadoTurno.Presente]: 'Presente',
  [EstadoTurno.Cancelado]: 'Cancelado',
  [EstadoTurno.Reprogramado]: 'Reprogramado',
  [EstadoTurno.Ausente]: 'Ausente',
}

const ESTADO_COLORS: Record<EstadoTurno, string> = {
  [EstadoTurno.Pendiente]: styles.estadoPendiente,
  [EstadoTurno.Presente]: styles.estadoPresente,
  [EstadoTurno.Cancelado]: styles.estadoCancelado,
  [EstadoTurno.Reprogramado]: styles.estadoReprogramado,
  [EstadoTurno.Ausente]: styles.estadoAusente,
}

export const TurnosList = ({
  turnos,
  isLoading,
  onTurnoClick,
  pacienteSearch,
}: TurnosListProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando turnos...</p>
      </div>
    )
  }

  // Filtrado local por paciente (nombre, apellido o dni)
  const turnosFiltrados =
    turnos?.filter((turno) => {
      if (!pacienteSearch) return true
      const searchLower = pacienteSearch.toLowerCase()
      const paciente = turno.paciente
      if (!paciente) return false

      const fullName =
        `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase()
      return (
        fullName.includes(searchLower) ||
        (paciente.dni && paciente.dni.includes(searchLower))
      )
    }) || []

  if (turnosFiltrados.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <CalendarClock size={48} className={styles.emptyIcon} />
        <p>No se encontraron turnos para los filtros seleccionados.</p>
      </div>
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
    <div className={styles.listContainer}>
      {turnosFiltrados.map((turno) => (
        <div
          key={turno.id}
          className={styles.listItem}
          onClick={() => {
            console.log('Turno clickeado:', turno)
            console.log('Paciente del turno:', turno.paciente)
            onTurnoClick(turno)
          }}
        >
          <div className={styles.itemMainInfo}>
            <div className={styles.pacienteInfo}>
              <UserIcon size={18} className={styles.icon} />
              <span className={styles.pacienteName}>
                {turno.paciente
                  ? `${turno.paciente.nombre || ''} ${turno.paciente.apellido || ''}`
                  : 'Paciente Desconocido'}
              </span>
            </div>
            <div className={styles.datetimeInfo}>
              <div className={styles.infoCol}>
                <CalendarClock size={16} className={styles.icon} />
                <span>{formatFecha(turno.fechaHora)}</span>
              </div>
              <div className={styles.infoCol}>
                <Clock size={16} className={styles.icon} />
                <span>
                  {formatHora(turno.fechaHora)} ({turno.duracionMin} min)
                </span>
              </div>
            </div>
          </div>

          <div className={styles.itemBadges}>
            {turno.turnoFijoId && (
              <span className={styles.fijoBadge}>Turno Fijo</span>
            )}
            <span
              className={`${styles.estadoBadge} ${ESTADO_COLORS[turno.estado]}`}
            >
              {ESTADO_LABELS[turno.estado]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
