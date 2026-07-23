import { ListTodo, CalendarX2 } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './DailyAgenda.module.css'

interface DailyAgendaProps {
  selectedDate: Date
}

// Interfaz mock, eventualmente vendrá de DTOs del backend
interface MockTurno {
  id: string
  paciente: string
  horaInicio: string
  duracionMinutos: number
  tipo: 'NORMAL' | 'FIJO'
  fecha: Date
}

const mockTurnos: MockTurno[] = [
  {
    id: '1',
    paciente: 'Juan Pérez',
    horaInicio: '09:00',
    duracionMinutos: 30,
    tipo: 'NORMAL',
    fecha: new Date(),
  },
  {
    id: '2',
    paciente: 'Ana Gómez',
    horaInicio: '09:30',
    duracionMinutos: 45,
    tipo: 'FIJO',
    fecha: new Date(),
  },
  {
    id: '3',
    paciente: 'Carlos López',
    horaInicio: '10:30',
    duracionMinutos: 30,
    tipo: 'NORMAL',
    fecha: new Date(),
  },
]

export const DailyAgenda = ({ selectedDate }: DailyAgendaProps) => {
  // Filtramos los turnos por la fecha seleccionada (mock logic)
  const turnosDelDia = mockTurnos.filter((t) =>
    isSameDay(t.fecha, selectedDate)
  )

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
          {turnosDelDia.map((turno) => (
            <div
              key={turno.id}
              className={`${styles.agendaItem} ${turno.tipo === 'FIJO' ? styles.fijo : ''}`}
            >
              <div className={styles.timeColumn}>
                <span className={styles.timeText}>{turno.horaInicio}</span>
                <span className={styles.durationText}>
                  {turno.duracionMinutos} min
                </span>
              </div>
              <div className={styles.detailsColumn}>
                <p className={styles.patientName}>{turno.paciente}</p>
                <span
                  className={`${styles.appointmentType} ${turno.tipo === 'FIJO' ? styles.fijo : ''}`}
                >
                  {turno.tipo === 'FIJO' ? 'Turno Fijo' : 'Turno Normal'}
                </span>
              </div>
            </div>
          ))}
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
