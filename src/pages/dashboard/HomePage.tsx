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
import { ReunionDetailModal } from '@/features/reuniones/components/ReunionDetailModal/ReunionDetailModal'
import { TurnoFormModal } from '@/features/turnos/components/TurnoFormModal/TurnoFormModal'
import {
  isSameDay,
  format,
  isTomorrow,
  isYesterday,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { es } from 'date-fns/locale'
import type { ReunionResponseDto } from '@/features/reuniones/schemas/reuniones.schema'

import { NotificationBell } from '@/features/notificaciones'
import 'react-calendar/dist/Calendar.css'

export const HomePage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isTurnoModalOpen, setIsTurnoModalOpen] = useState(false)
  const [reunionSeleccionada, setReunionSeleccionada] =
    useState<ReunionResponseDto | null>(null)

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

  const { data: agendaTurnosData } = useAgendaTurnos({
    desde: `${format(currentMonthStart, 'yyyy-MM-dd')}T00:00:00`,
    hasta: `${format(currentMonthEnd, 'yyyy-MM-dd')}T23:59:59`,
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

  const reunionesDelDia = useMemo(() => {
    return (reunionesData || []).filter((r) =>
      isSameDay(new Date(r.fechaHora), selectedDate)
    )
  }, [reunionesData, selectedDate])

  const reunionesSemanales = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { locale: es })
    const weekEnd = endOfWeek(now, { locale: es })

    return (reunionesData || []).filter((r) => {
      const fecha = new Date(r.fechaHora)
      return fecha >= weekStart && fecha <= weekEnd
    })
  }, [reunionesData])

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
    const patientName = nextTurno.paciente
      ? `${nextTurno.paciente.nombre} ${nextTurno.paciente.apellido}`
      : `Paciente ${nextTurno.pacienteId}`
    nextAppointmentText = `Próximo turno a las ${time} - ${patientName}`
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
        <h2 className={styles.headerTitle}>
          Bienvenido, {user?.name || 'Doctor'}
        </h2>
        <div className={styles.bellWrapper}>
          <NotificationBell />
        </div>
        <div className={styles.nextAppointment}>
          <Clock size={18} />
          <span>{nextAppointmentText}</span>
        </div>
      </header>

      <div className={styles.dashboardGrid}>
        <div className={styles.statCardsWrapper}>
          <StatCards
            turnosHoy={turnosDelDia.length}
            reunionesSemanales={reunionesSemanales.length}
            turnosLabel={turnosLabel}
          />
        </div>

        <div className={styles.calendarWrapper}>
          <MonthCalendar
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            turnosDelMes={turnosDelMes}
            reunionesDelMes={reunionesData}
          />
        </div>

        <div className={styles.agendaWrapper}>
          <DailyAgenda
            selectedDate={selectedDate}
            turnosDelDia={turnosDelDia}
            reunionesDelDia={reunionesDelDia}
            onAddTurno={() => setIsTurnoModalOpen(true)}
            onReunionClick={setReunionSeleccionada}
          />
        </div>

        <div className={styles.actionsWrapper}>
          <QuickActions />
        </div>
      </div>

      <TurnoFormModal
        isOpen={isTurnoModalOpen}
        onClose={() => setIsTurnoModalOpen(false)}
        defaultFecha={selectedDate}
      />

      <ReunionDetailModal
        isOpen={reunionSeleccionada !== null}
        onClose={() => setReunionSeleccionada(null)}
        reunion={reunionSeleccionada}
      />
    </div>
  )
}
