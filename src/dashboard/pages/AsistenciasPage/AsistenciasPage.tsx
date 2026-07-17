import React, { useState } from 'react'
import type { Turno } from '@/features/turnos/types/turnos.types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AsistenciasGrid } from '@/features/asistencias/components/AsistenciasGrid/AsistenciasGrid'
import { useAgendaTurnos } from '@/features/turnos/hooks/useTurnos'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import styles from './AsistenciasPage.module.css'

export const AsistenciasPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  // State for the selected month
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calculate the first and last day of the selected month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  const formatDate = (d: Date) => d.toISOString().split('T')[0]

  // Fetch turnos for the whole month
  const { data: turnosData, isLoading } = useAgendaTurnos({
    desde: formatDate(firstDayOfMonth),
    hasta: formatDate(lastDayOfMonth),
    profesionalId,
  })

  const { pacientes } = usePacientes()

  // Enrich turnos with paciente data if missing, just like in TurnosPage
  const turnos = React.useMemo(() => {
    if (!turnosData || !pacientes) return turnosData
    return turnosData.map((turno: Turno) => {
      if (!turno.paciente && turno.pacienteId) {
        const foundPaciente = pacientes.find((p) => p.id === turno.pacienteId)
        if (foundPaciente) {
          return { ...turno, paciente: foundPaciente }
        }
      }
      return turno
    })
  }, [turnosData, pacientes])

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const monthNames = [
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

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Asistencias</h1>
          <p className={styles.subtitle}>
            Control de asistencias mensual de tus pacientes
          </p>
        </div>

        <div className={styles.monthSelector}>
          <button
            onClick={handlePreviousMonth}
            className={styles.navButton}
            aria-label="Mes anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className={styles.currentMonth}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={handleNextMonth}
            className={styles.navButton}
            aria-label="Mes siguiente"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>Cargando asistencias...</div>
        ) : (
          <AsistenciasGrid
            turnos={turnos || []}
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
          />
        )}
      </div>
    </div>
  )
}
