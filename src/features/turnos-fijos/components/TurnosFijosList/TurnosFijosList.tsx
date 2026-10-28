import { CalendarClock, User as UserIcon, Clock } from 'lucide-react'
import type { TurnoFijo } from '../../types/turnos-fijos.types'
import styles from './TurnosFijosList.module.css'

interface TurnosFijosListProps {
  turnosFijos: TurnoFijo[]
  isLoading: boolean
  onTurnoFijoClick: (turnoFijo: TurnoFijo) => void
  pacienteSearch: string
}

const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

export const TurnosFijosList = ({
  turnosFijos,
  isLoading,
  onTurnoFijoClick,
  pacienteSearch,
}: TurnosFijosListProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando turnos fijos...</p>
      </div>
    )
  }

  // Filtrado local por paciente
  const turnosFiltrados =
    turnosFijos?.filter((turno) => {
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
      <div className={styles.emptyState}>
        <CalendarClock size={48} className={styles.emptyIcon} />
        <h3>No hay turnos fijos</h3>
        <p>
          {pacienteSearch
            ? 'No se encontraron reglas que coincidan con la búsqueda.'
            : 'No hay reglas de turnos fijos configuradas.'}
        </p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {turnosFiltrados.map((turno) => (
        <div
          key={turno.id}
          className={`${styles.card} ${turno.activo ? '' : styles.inactivo}`}
          onClick={() => onTurnoFijoClick(turno)}
        >
          <div className={styles.cardHeader}>
            <div className={styles.pacienteInfo}>
              <UserIcon size={18} className={styles.icon} />
              <span className={styles.pacienteNombre}>
                {turno.paciente
                  ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
                  : 'Paciente Desconocido'}
              </span>
            </div>
            {!turno.activo && <span className={styles.badgeInactivo}>Inactivo</span>}
          </div>

          <div className={styles.cardBody}>
            <div className={styles.infoRow}>
              <CalendarClock size={16} className={styles.iconInfo} />
              <span>
                Todos los {DIAS_SEMANA[turno.diaSemana]}s
              </span>
            </div>
            <div className={styles.infoRow}>
              <Clock size={16} className={styles.iconInfo} />
              <span>
                {turno.hora.substring(0, 5)} ({turno.duracionMin} min)
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
