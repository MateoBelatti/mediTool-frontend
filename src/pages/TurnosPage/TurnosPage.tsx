import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TurnosFilters } from '@/features/turnos/components/TurnosFilters/TurnosFilters'
import { TurnosList } from '@/features/turnos/components/TurnosList/TurnosList'
import { TurnoDetailModal } from '@/features/turnos/components/TurnoDetailModal/TurnoDetailModal'
import { TurnoFormModal } from '@/features/turnos/components/TurnoFormModal/TurnoFormModal'
import { useAgendaTurnos } from '@/features/turnos/hooks/useTurnos'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import type { Turno } from '@/features/turnos/types/turnos.types'
import { useTurnosFijosByProfesional } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import { TurnosFijosList } from '@/features/turnos-fijos/components/TurnosFijosList/TurnosFijosList'
import type { TurnoFijo } from '@/features/turnos-fijos/types/turnos-fijos.types'
import styles from './TurnosPage.module.css'

const DESDE_TODOS = '2000-01-01T00:00:00'
const HASTA_TODOS = '2099-12-31T23:59:59'

export const TurnosPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  const [activeTab, setActiveTab] = useState<'sueltos' | 'fijos'>('fijos')
  const [fecha, setFecha] = useState('')
  const [pacienteSearch, setPacienteSearch] = useState('')

  const desde = fecha ? `${fecha}T00:00:00` : DESDE_TODOS
  const hasta = fecha ? `${fecha}T23:59:59` : HASTA_TODOS

  const { data: turnosDataPage, isLoading: isLoadingTurnos } = useAgendaTurnos({
    desde,
    hasta,
    profesionalId: profesionalId!,
    page: 1,
    pageSize: 100,
  })

  const { data: turnosFijosData, isLoading: isLoadingFijos } =
    useTurnosFijosByProfesional(profesionalId!)

  const { pacientes: pacientesPage, pacientesVinculados } = usePacientes(
    undefined,
    { page: 1, pageSize: 100 }
  )

  const turnosData = turnosDataPage?.items
  const pacientes = pacientesPage?.items || pacientesVinculados?.items

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

  const turnosSueltos = React.useMemo(() => {
    return turnos?.filter((t) => t.turnoFijoId == null) || []
  }, [turnos])

  const turnosFijos = React.useMemo(() => {
    if (!turnosFijosData || !pacientes) return turnosFijosData
    return turnosFijosData.map((turnoFijo: TurnoFijo) => {
      if (!turnoFijo.paciente && turnoFijo.pacienteId) {
        const foundPaciente = pacientes.find(
          (p) => p.id === turnoFijo.pacienteId
        )
        if (foundPaciente) {
          return { ...turnoFijo, paciente: foundPaciente }
        }
      }
      return turnoFijo
    })
  }, [turnosFijosData, pacientes])

  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (location.state?.openNewModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
      return
    }

    if (location.state?.editTurnoId && turnos) {
      const tId = location.state.editTurnoId
      const foundTurno = turnos.find((t: Turno) => t.id === tId)
      if (foundTurno) {
        setSelectedTurno(foundTurno)
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [location.state, turnos, navigate, location.pathname])

  return (
    <div className={styles.pageContainer}>
      <TurnosFilters
        fecha={fecha}
        onFechaChange={setFecha}
        pacienteSearch={pacienteSearch}
        onPacienteSearchChange={setPacienteSearch}
        onNewTurnoClick={() => setIsFormModalOpen(true)}
      />

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'sueltos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('sueltos')}
          >
            Turnos Sueltos
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'fijos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('fijos')}
          >
            Turnos Fijos (Reglas)
          </button>
        </div>
      </div>

      <div className={styles.listContainer}>
        {activeTab === 'sueltos' ? (
          <TurnosList
            turnos={turnosSueltos}
            isLoading={isLoadingTurnos}
            onTurnoClick={setSelectedTurno}
            pacienteSearch={pacienteSearch}
          />
        ) : (
          <TurnosFijosList
            turnosFijos={turnosFijos || []}
            isLoading={isLoadingFijos}
            onTurnoFijoClick={(t) => navigate('/turnos-fijos/' + t.id)}
            pacienteSearch={pacienteSearch}
          />
        )}
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
        defaultFecha={fecha ? new Date(`${fecha}T00:00:00`) : undefined}
        initialTab={activeTab === 'fijos' ? 'fijo' : 'suelto'}
      />
    </div>
  )
}
