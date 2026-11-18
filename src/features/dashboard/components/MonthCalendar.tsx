import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './MonthCalendar.module.css'
import type { Turno } from '../../turnos/types/turnos.types'
import type { ReunionResponseDto } from '../../reuniones/schemas/reuniones.schema'

interface MonthCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  turnosDelMes?: Turno[]
  reunionesDelMes?: ReunionResponseDto[]
}

interface DayEvents {
  turnos: number
  reuniones: number
}

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const MonthCalendar = ({
  selectedDate,
  onDateChange,
  turnosDelMes = [],
  reunionesDelMes = [],
}: MonthCalendarProps) => {
  const [monthOffset, setMonthOffset] = useState(0)

  const viewDate = useMemo(
    () => addMonths(startOfMonth(selectedDate), monthOffset),
    [selectedDate, monthOffset]
  )

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [viewDate])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, DayEvents>()

    const count = (date: Date, key: keyof DayEvents) => {
      const dayKey = format(date, 'yyyy-MM-dd')
      const current = map.get(dayKey) ?? { turnos: 0, reuniones: 0 }
      current[key] += 1
      map.set(dayKey, current)
    }

    turnosDelMes.forEach((turno) => count(new Date(turno.fechaHora), 'turnos'))
    reunionesDelMes.forEach((reunion) =>
      count(new Date(reunion.fechaHora), 'reuniones')
    )

    return map
  }, [turnosDelMes, reunionesDelMes])

  const handleDayClick = (day: Date) => {
    setMonthOffset(0)
    onDateChange(day)
  }

  const handleToday = () => {
    setMonthOffset(0)
    onDateChange(new Date())
  }

  const monthLabel = capitalize(
    format(viewDate, "MMMM 'de' yyyy", { locale: es })
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <CalendarDays size={20} className={styles.icon} />
          <h3>Calendario</h3>
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setMonthOffset((prev) => prev - 1)}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => setMonthOffset((prev) => prev + 1)}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={styles.monthBar}>
        <p className={styles.monthLabel}>{monthLabel}</p>
        <button
          type="button"
          className={styles.todayButton}
          onClick={handleToday}
        >
          Hoy
        </button>
      </div>

      <div className={styles.weekDays}>
        {WEEK_DAYS.map((weekDay) => (
          <span key={weekDay} className={styles.weekDay}>
            {weekDay}
          </span>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((day) => {
          const events = eventsByDay.get(format(day, 'yyyy-MM-dd'))
          const hasTurno = !!events?.turnos
          const hasReunion = !!events?.reuniones
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, viewDate)
          const isWeekend = [0, 6].includes(day.getDay())

          const classNames = [
            styles.day,
            !isCurrentMonth && styles.otherMonth,
            isCurrentMonth && isWeekend && styles.weekend,
            isToday(day) && styles.today,
            isSelected && styles.selected,
          ]
            .filter(Boolean)
            .join(' ')

          const eventSummary = [
            events?.turnos ? `${events.turnos} turno(s)` : null,
            events?.reuniones ? `${events.reuniones} reunión(es)` : null,
          ]
            .filter(Boolean)
            .join(' · ')

          return (
            <button
              key={day.toISOString()}
              type="button"
              className={classNames}
              onClick={() => handleDayClick(day)}
              aria-label={format(day, "EEEE d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
              aria-pressed={isSelected}
              aria-current={isToday(day) ? 'date' : undefined}
              title={eventSummary || undefined}
            >
              <span className={styles.dayNumber}>{format(day, 'd')}</span>
              <span className={styles.dots} aria-hidden="true">
                {hasTurno && (
                  <span className={`${styles.dot} ${styles.turnoDot}`} />
                )}
                {hasReunion && (
                  <span className={`${styles.dot} ${styles.reunionDot}`} />
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.turnoDot}`} />
          Turnos
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.reunionDot}`} />
          Reuniones
        </span>
      </div>
    </div>
  )
}
