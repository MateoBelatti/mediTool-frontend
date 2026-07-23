import { useState } from 'react'
import { Clock } from 'lucide-react'
import styles from './HomePage.module.css'

import { StatCards } from '../../features/dashboard/components/StatCards'
import { MonthCalendar } from '../../features/dashboard/components/MonthCalendar'
import { DailyAgenda } from '../../features/dashboard/components/DailyAgenda'
import { QuickNotes } from '../../features/dashboard/components/QuickNotes'
import 'react-calendar/dist/Calendar.css' // Default react-calendar styles (will be overridden by our CSS)

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Bienvenido, Dr. Mateo</h2>
        <div className={styles.nextAppointment}>
          <Clock size={18} />
          <span>Próximo turno en 15 min: Juan Pérez</span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.statCardsWrapper}>
          <StatCards />
        </div>

        <div className={styles.calendarWrapper}>
          <MonthCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>

        <div className={styles.agendaWrapper}>
          <DailyAgenda selectedDate={selectedDate} />
        </div>

        <div className={styles.notesWrapper}>
          <QuickNotes />
        </div>
      </div>
    </div>
  )
}
