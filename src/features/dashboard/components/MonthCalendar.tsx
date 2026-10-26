import { Calendar as CalendarIcon } from 'lucide-react'
import Calendar from 'react-calendar'
import { isSameDay, isSameMonth } from 'date-fns'
import styles from './MonthCalendar.module.css'
import type { Turno } from '../../turnos/types/turnos.types'
import type { ReunionResponseDto } from '../../reuniones/schemas/reuniones.schema'

interface MonthCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  turnosDelMes?: Turno[]
  reunionesDelMes?: ReunionResponseDto[]
}

export const MonthCalendar = ({
  selectedDate,
  onDateChange,
  turnosDelMes = [],
  reunionesDelMes = [],
}: MonthCalendarProps) => {
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month' || !isSameMonth(date, selectedDate)) {
      return null
    }

    const hasTurno = turnosDelMes.some((t) =>
      isSameDay(new Date(t.fechaHora), date)
    )
    const hasReunion = reunionesDelMes.some((r) =>
      isSameDay(new Date(r.fechaHora), date)
    )

    if (!hasTurno && !hasReunion) {
      return null
    }

    return (
      <div className={styles.dots}>
        {hasTurno && <span className={styles.hasTurnoDot} />}
        {hasReunion && <span className={styles.hasReunionDot} />}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CalendarIcon size={20} className={styles.icon} />
        <h3>Calendario Mensual</h3>
      </div>
      <div className={styles.calendarWrapper}>
        <Calendar
          onChange={(value) => onDateChange(value as Date)}
          value={selectedDate}
          tileContent={tileContent}
          next2Label={null}
          prev2Label={null}
        />
      </div>
    </div>
  )
}
