import { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TurnosHeader } from '@/features/turnos/components/TurnosHeader/TurnosHeader'
import { TurnosSidebar } from '@/features/turnos/components/TurnosSidebar/TurnosSidebar'
import { TurnosFijosPanel } from '@/features/turnos/components/TurnosFijosPanel/TurnosFijosPanel'
import { TurnosSueltosPanel } from '@/features/turnos/components/TurnosSueltosPanel/TurnosSueltosPanel'
import { TurnoDetailModal } from '@/features/turnos/components/TurnoDetailModal/TurnoDetailModal'
import { TurnoFormModal } from '@/features/turnos/components/TurnoFormModal/TurnoFormModal'
import { EditTurnoFijoModal } from '@/features/turnos-fijos/components/EditTurnoFijoModal/EditTurnoFijoModal'
import {
  useAgendaTurnos,
  useHistorialTurnoFijo,
  useResumenPorTurnoFijo,
} from '@/features/turnos/hooks/useTurnos'
import { useTurnosFijosByProfesional } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import type { Turno } from '@/features/turnos/types/turnos.types'
import type { TurnoFijo } from '@/features/turnos-fijos/types/turnos-fijos.types'
import styles from './TurnosPage.module.css'

const DESDE_TODOS = '2000-01-01T00:00:00'
const HASTA_TODOS = '2099-12-31T23:59:59'

export const TurnosPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  // Pestaña activa (por defecto Fijos)
  const [activeTab, setActiveTab] = useState<'fijos' | 'sueltos'>('fijos')

  // Búsqueda en sidebar
  const [pacienteSearch, setPacienteSearch] = useState('')

  // Selección en Fijos y Sueltos
  const [selectedTurnoFijoId, setSelectedTurnoFijoId] = useState<number | null>(
    null
  )
  const [selectedPacienteSueltoId, setSelectedPacienteSueltoId] = useState<
    number | 'todos'
  >('todos')

  // Modales
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isEditFijoModalOpen, setIsEditFijoModalOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  // Pacientes
  const { pacientes: pacientesPage, pacientesVinculados } = usePacientes(
    undefined,
    { page: 1, pageSize: 100 }
  )
  const pacientesList = pacientesPage?.items || pacientesVinculados?.items

  // ================= 1. TURNOS FIJOS (REGLAS) =================
  const { data: turnosFijosData, isLoading: isLoadingFijos } =
    useTurnosFijosByProfesional(profesionalId!)

  const turnosFijos = useMemo(() => {
    if (!turnosFijosData) return []
    return turnosFijosData.map((regla: TurnoFijo) => {
      if (!regla.paciente && regla.pacienteId && pacientesList) {
        const found = pacientesList.find((p) => p.id === regla.pacienteId)
        if (found) {
          return { ...regla, paciente: found }
        }
      }
      return regla
    })
  }, [turnosFijosData, pacientesList])

  const turnosFijosFiltrados = useMemo(() => {
    if (!pacienteSearch.trim()) return turnosFijos
    const term = pacienteSearch.toLowerCase().trim()
    return turnosFijos.filter((regla) => {
      const nombreCompleto =
        `${regla.paciente?.nombre || ''} ${regla.paciente?.apellido || ''}`.toLowerCase()
      const dni = regla.paciente?.dni?.toLowerCase() || ''
      return nombreCompleto.includes(term) || dni.includes(term)
    })
  }, [turnosFijos, pacienteSearch])

  // Regla fija activa (la seleccionada o primera disponible)
  const effectiveTurnoFijoId = useMemo(() => {
    if (
      selectedTurnoFijoId &&
      turnosFijosFiltrados.some((r) => r.id === selectedTurnoFijoId)
    ) {
      return selectedTurnoFijoId
    }
    return turnosFijosFiltrados[0]?.id ?? null
  }, [selectedTurnoFijoId, turnosFijosFiltrados])

  const selectedRegla = useMemo(() => {
    return turnosFijos.find((r) => r.id === effectiveTurnoFijoId) || null
  }, [turnosFijos, effectiveTurnoFijoId])

  const { data: historialRegla, isLoading: isLoadingHistorial } =
    useHistorialTurnoFijo(effectiveTurnoFijoId)

  const { data: resumenAsistencia } = useResumenPorTurnoFijo(
    effectiveTurnoFijoId || 0
  )

  // ================= 2. TURNOS SUELTOS =================
  const { data: turnosAgendaPage, isLoading: isLoadingTurnosAgenda } =
    useAgendaTurnos({
      desde: DESDE_TODOS,
      hasta: HASTA_TODOS,
      profesionalId: profesionalId!,
      page: 1,
      pageSize: 100,
    })

  const turnosSueltos = useMemo(() => {
    const agenda = turnosAgendaPage?.items
    if (!agenda) return []
    const sueltos = agenda.filter((t) => t.turnoFijoId == null)
    if (!pacientesList) return sueltos

    return sueltos.map((t) => {
      if (!t.paciente && t.pacienteId) {
        const found = pacientesList.find((p) => p.id === t.pacienteId)
        if (found) {
          return { ...t, paciente: found }
        }
      }
      return t
    })
  }, [turnosAgendaPage?.items, pacientesList])

  const pacientesConSueltos = useMemo(() => {
    const map = new Map<
      number,
      { paciente: NonNullable<Turno['paciente']>; count: number }
    >()
    turnosSueltos.forEach((t) => {
      if (t.paciente && t.pacienteId) {
        const current = map.get(t.pacienteId)
        if (current) {
          current.count += 1
        } else {
          map.set(t.pacienteId, { paciente: t.paciente, count: 1 })
        }
      }
    })

    let list = Array.from(map.values())
    if (pacienteSearch.trim()) {
      const term = pacienteSearch.toLowerCase().trim()
      list = list.filter((item) => {
        const fullName =
          `${item.paciente.nombre || ''} ${item.paciente.apellido || ''}`.toLowerCase()
        const dni = item.paciente.dni?.toLowerCase() || ''
        return fullName.includes(term) || dni.includes(term)
      })
    }
    return list
  }, [turnosSueltos, pacienteSearch])

  // Navegación por location.state
  useEffect(() => {
    if (location.state?.openNewModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFormModalOpen(true)
      navigate(location.pathname, { replace: true, state: {} })
      return
    }

    if (location.state?.editTurnoId) {
      const tId = location.state.editTurnoId
      const foundInRegla = historialRegla?.find((t) => t.id === tId)
      const foundInSueltos = turnosSueltos.find((t) => t.id === tId)
      const found = foundInRegla || foundInSueltos
      if (found) {
        setSelectedTurno(found)
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [
    location.state,
    historialRegla,
    turnosSueltos,
    navigate,
    location.pathname,
  ])

  return (
    <div className={styles.pageContainer}>
      <TurnosHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.mainLayout}>
        <TurnosSidebar
          activeTab={activeTab}
          searchTerm={pacienteSearch}
          onSearchChange={setPacienteSearch}
          turnosFijos={turnosFijosFiltrados}
          selectedTurnoFijoId={effectiveTurnoFijoId}
          onSelectTurnoFijo={setSelectedTurnoFijoId}
          isLoadingFijos={isLoadingFijos}
          turnosSueltosCount={turnosSueltos.length}
          pacientesConSueltos={pacientesConSueltos}
          selectedPacienteSueltoId={selectedPacienteSueltoId}
          onSelectPacienteSuelto={setSelectedPacienteSueltoId}
          isLoadingSueltos={isLoadingTurnosAgenda}
          onNewClick={() => setIsFormModalOpen(true)}
        />

        <main className={styles.contentColumn}>
          {activeTab === 'fijos' ? (
            <TurnosFijosPanel
              selectedRegla={selectedRegla}
              historial={historialRegla}
              isLoadingHistorial={isLoadingHistorial}
              resumenAsistencia={resumenAsistencia}
              onTurnoClick={setSelectedTurno}
              onEditReglaClick={() => setIsEditFijoModalOpen(true)}
              onNewReglaClick={() => setIsFormModalOpen(true)}
            />
          ) : (
            <TurnosSueltosPanel
              selectedPacienteId={selectedPacienteSueltoId}
              pacientesConSueltos={pacientesConSueltos}
              turnosSueltos={turnosSueltos}
              isLoading={isLoadingTurnosAgenda}
              onTurnoClick={setSelectedTurno}
              onNewTurnoClick={() => setIsFormModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Modales */}
      <TurnoDetailModal
        turno={selectedTurno}
        isOpen={!!selectedTurno}
        onClose={() => setSelectedTurno(null)}
      />

      {selectedRegla && (
        <EditTurnoFijoModal
          turnoFijo={selectedRegla}
          isOpen={isEditFijoModalOpen}
          onClose={() => setIsEditFijoModalOpen(false)}
        />
      )}

      <TurnoFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialTab={activeTab === 'fijos' ? 'fijo' : 'suelto'}
      />
    </div>
  )
}
