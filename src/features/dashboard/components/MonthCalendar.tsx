import { Calendar as CalendarIcon } from 'lucide-react'
import Calendar from 'react-calendar'
import styles from './MonthCalendar.module.css'

interface MonthCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export const MonthCalendar = ({
  selectedDate,
  onDateChange,
}: MonthCalendarProps) => {
  // In a real scenario, this would come from an API query via React Query
  const daysWithAppointments = [
    new Date().getDate(),
    new Date().getDate() + 2,
    new Date().getDate() + 5,
  ]

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // Add a dot to days that have appointments (mocked)
    if (view === 'month') {
      const isCurrentMonth = date.getMonth() === new Date().getMonth()
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
          next2Label={null} // Hide the double arrows
          prev2Label={null}
        />
      </div>
    </div>
  )
}
