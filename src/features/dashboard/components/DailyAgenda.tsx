import { ListTodo, CalendarX2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './DailyAgenda.module.css'
import type { Turno } from '../../turnos/types/turnos.types'

interface DailyAgendaProps {
  selectedDate: Date
  turnosDelDia?: Turno[]
}

export const DailyAgenda = ({
  selectedDate,
  turnosDelDia = [],
}: DailyAgendaProps) => {
  const fechaFormateada = format(selectedDate, "EEEE d 'de' MMMM", {
    locale: es,
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <ListTodo size={20} className={styles.icon} />
          <h3>Agenda Diaria</h3>
        </div>
        <span className={styles.selectedDateText}>
          {fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}
        </span>
      </div>

      {turnosDelDia.length > 0 ? (
        <div className={styles.agendaList}>
          {turnosDelDia.map((turno) => {
            const time = new Date(turno.fechaHora).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            const isFijo = !!turno.turnoFijoId
            const patientName = turno.paciente
              ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
              : `Paciente ${turno.pacienteId}`

            return (
              <div
                key={turno.id}
                className={`${styles.agendaItem} ${isFijo ? styles.fijo : ''}`}
              >
                <div className={styles.timeColumn}>
                  <span className={styles.timeText}>{time}</span>
                  <span className={styles.durationText}>
                    {turno.duracionMin} min
                  </span>
                </div>
                <div className={styles.detailsColumn}>
                  <p className={styles.patientName}>{patientName}</p>
                  <span
                    className={`${styles.appointmentType} ${isFijo ? styles.fijo : ''}`}
                  >
                    {isFijo ? 'Turno Fijo' : 'Turno Normal'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <CalendarX2 size={48} strokeWidth={1} />
          <p>No hay turnos programados para este día.</p>
        </div>
      )}
    </div>
  )
}
