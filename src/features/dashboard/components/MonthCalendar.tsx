import { Calendar as CalendarIcon } from 'lucide-react'
import Calendar from 'react-calendar'
import styles from './MonthCalendar.module.css'
import type { Turno } from '../../turnos/types/turnos.types'

interface MonthCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  turnosDelMes?: Turno[]
}

export const MonthCalendar = ({
  selectedDate,
  onDateChange,
  turnosDelMes = [],
}: MonthCalendarProps) => {
  const daysWithAppointments = turnosDelMes.map((t) =>
    new Date(t.fechaHora).getDate()
  )

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
      if (isCurrentMonth && daysWithAppointments.includes(date.getDate())) {
        return <div className={styles.hasAppointmentDot} />
      }
    }
    return null
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
