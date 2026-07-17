import React, { useState } from 'react'
import { TurnosFilters } from '@/features/turnos/components/TurnosFilters/TurnosFilters'
import { TurnosList } from '@/features/turnos/components/TurnosList/TurnosList'
import { TurnoDetailModal } from '@/features/turnos/components/TurnoDetailModal/TurnoDetailModal'
import { TurnoFormModal } from '@/features/turnos/components/TurnoFormModal/TurnoFormModal'
import { useAgendaTurnos } from '@/features/turnos/hooks/useTurnos'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import type { Turno } from '@/features/turnos/types/turnos.types'
import styles from './TurnosPage.module.css'

export const TurnosPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  // Default dates: From beginning of month to end of month (or just 30 days)
  const today = new Date()
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const formatDate = (d: Date) => d.toISOString().split('T')[0]

  const [fechaDesde, setFechaDesde] = useState(formatDate(today))
  const [fechaHasta, setFechaHasta] = useState(formatDate(nextMonth))
  const [pacienteSearch, setPacienteSearch] = useState('')

  const { data: turnosData, isLoading } = useAgendaTurnos({
    desde: fechaDesde,
    hasta: fechaHasta,
    profesionalId,
  })

  const { pacientes } = usePacientes()

  // Enrich turnos with paciente data if it's null from the backend
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

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  return (
    <div className={styles.pageContainer}>
      <TurnosFilters
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onFechaDesdeChange={setFechaDesde}
        onFechaHastaChange={setFechaHasta}
        pacienteSearch={pacienteSearch}
        onPacienteSearchChange={setPacienteSearch}
        onNewTurnoClick={() => setIsFormModalOpen(true)}
      />

      <div className={styles.listContainer}>
        <TurnosList
          turnos={turnos || []}
          isLoading={isLoading}
          onTurnoClick={setSelectedTurno}
          pacienteSearch={pacienteSearch}
        />
      </div>

      {/* Modals */}
      <TurnoDetailModal
        turno={selectedTurno}
        isOpen={!!selectedTurno}
        onClose={() => setSelectedTurno(null)}
      />

      <TurnoFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
    </div>
  )
}
