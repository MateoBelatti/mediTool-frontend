import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './MonthSelector.module.css'

interface MonthSelectorProps {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
}

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const MonthSelector = ({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: MonthSelectorProps) => {
  const monthName = MESES[currentDate.getMonth()]
  const year = currentDate.getFullYear()

  return (
    <div className={styles.monthBox}>
      <button
        type="button"
        onClick={onPreviousMonth}
        className={styles.navButton}
        title="Mes anterior"
        aria-label="Mes anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <span className={styles.monthLabel}>
        {monthName} {year}
      </span>

      <button
        type="button"
        onClick={onNextMonth}
        className={styles.navButton}
        title="Mes siguiente"
        aria-label="Mes siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
