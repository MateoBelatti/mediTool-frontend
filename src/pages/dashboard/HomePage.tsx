import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import styles from './HomePage.module.css'

import { StatCards } from '../../features/dashboard/components/StatCards'
import { QuickActions } from '../../features/dashboard/components/QuickActions'
import { MonthCalendar } from '../../features/dashboard/components/MonthCalendar'
import { DailyAgenda } from '../../features/dashboard/components/DailyAgenda'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useAgendaTurnos } from '../../features/turnos/hooks/useTurnos'
import { useReunionesByProfesionalId } from '../../features/reuniones/hooks/useReuniones'
import { isSameDay, format, isTomorrow, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'

import 'react-calendar/dist/Calendar.css'

export const HomePage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const currentMonthStart = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  )
  const currentMonthEnd = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  )

  const formatDate = (d: Date) => {
    const tzOffset = d.getTimezoneOffset() * 60000
    const localISOTime = new Date(d.getTime() - tzOffset)
      .toISOString()
      .slice(0, 10)
    return localISOTime
  }

  const { data: agendaTurnosData } = useAgendaTurnos({
    desde: formatDate(currentMonthStart),
    hasta: formatDate(currentMonthEnd),
    profesionalId: profesionalId!,
    page: 1,
    pageSize: 1000,
  })

  const { data: reunionesData } = useReunionesByProfesionalId(profesionalId!)

  const turnosDelMes = useMemo(
    () => agendaTurnosData?.items || [],
    [agendaTurnosData?.items]
  )

  const turnosDelDia = useMemo(() => {
    return turnosDelMes.filter((t) => {
      const turnoDate = new Date(t.fechaHora)
      return isSameDay(turnoDate, selectedDate)
    })
  }, [turnosDelMes, selectedDate])

  const nextTurno = useMemo(() => {
    const now = new Date()
    const turnosHoy = turnosDelMes
      .filter((t) => {
        const turnoDate = new Date(t.fechaHora)
        return isSameDay(turnoDate, now) && turnoDate > now
      })
      .sort(
        (a, b) =>
          new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
      )
    return turnosHoy[0]
  }, [turnosDelMes])

  let nextAppointmentText = 'Sin próximos turnos hoy'
  if (nextTurno) {
    const time = new Date(nextTurno.fechaHora).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    const diffMs =
      new Date(nextTurno.fechaHora).getTime() - new Date().getTime()
    const diffMins = Math.round(diffMs / 60000)
    const patientName = nextTurno.paciente
      ? `${nextTurno.paciente.nombre} ${nextTurno.paciente.apellido}`
      : `Paciente ${nextTurno.pacienteId}`
    nextAppointmentText = `Próximo turno en ${diffMins} min (${time}): ${patientName}`
  }

  let turnosLabel = 'Pacientes Hoy'
  const today = new Date()
  if (!isSameDay(selectedDate, today)) {
    if (isTomorrow(selectedDate)) {
      turnosLabel = 'Pacientes Mañana'
    } else if (isYesterday(selectedDate)) {
      turnosLabel = 'Pacientes Ayer'
    } else {
      turnosLabel = `Pacientes el ${format(selectedDate, "d 'de' MMMM", { locale: es })}`
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Bienvenido, {user?.name || 'Doctor'}</h2>
        <div className={styles.nextAppointment}>
          <Clock size={18} />
          <span>{nextAppointmentText}</span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.statCardsWrapper}>
          <StatCards
            turnosHoy={turnosDelDia.length}
            reunionesSemanales={reunionesData?.length || 0}
            turnosLabel={turnosLabel}
          />
        </div>

        <div className={styles.calendarWrapper}>
          <MonthCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            turnosDelMes={turnosDelMes}
          />
        </div>

        <div className={styles.agendaWrapper}>
          <DailyAgenda
            selectedDate={selectedDate}
            turnosDelDia={turnosDelDia}
          />
        </div>

        <div className={styles.actionsWrapper}>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
