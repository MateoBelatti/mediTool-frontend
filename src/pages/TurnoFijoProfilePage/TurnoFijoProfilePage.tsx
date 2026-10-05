import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTurnosFijosByProfesional } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import { useHistorialTurnoFijo } from '@/features/turnos/hooks/useTurnos'
import { TurnosList } from '@/features/turnos/components/TurnosList/TurnosList'
import { TurnoDetailModal } from '@/features/turnos/components/TurnoDetailModal/TurnoDetailModal'
import { EditTurnoFijoModal } from '@/features/turnos-fijos/components/EditTurnoFijoModal/EditTurnoFijoModal'
import { Button } from '@/shared/components/Button/Button'
import { ArrowLeft, Edit } from 'lucide-react'
import type { Turno } from '@/features/turnos/types/turnos.types'
import { EstadoTurno } from '@/features/turnos/types/turnos.types'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import styles from './TurnoFijoProfilePage.module.css'

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export const TurnoFijoProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  const turnoFijoId = parseInt(id || '0')

  const { data: turnosFijosData, isLoading: isLoadingFijos } = useTurnosFijosByProfesional(profesionalId!)
  const turnoFijo = turnosFijosData?.find((t) => t.id === turnoFijoId)

  const { pacientes: pacientesPage, pacientesVinculados } = usePacientes(undefined, { page: 1, pageSize: 100 })
  const pacientes = pacientesPage?.items || pacientesVinculados?.items
  const paciente = pacientes?.find(p => p.id === turnoFijo?.pacienteId) || (turnoFijo as any)?.paciente

  const { data: historial, isLoading: isLoadingHistorial } = useHistorialTurnoFijo(turnoFijoId)

  const [estadoFilter, setEstadoFilter] = useState<EstadoTurno | ''>('')
  const [fechaDesdeFilter, setFechaDesdeFilter] = useState('')
  const [fechaHastaFilter, setFechaHastaFilter] = useState('')
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleDesdeHoy = () => {
    const today = new Date()
    // Local date string YYYY-MM-DD
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setFechaDesdeFilter(`${yyyy}-${mm}-${dd}`)
    setFechaHastaFilter('') // clear end date just in case
  }

  const handleLimpiarFiltros = () => {
    setEstadoFilter('')
    setFechaDesdeFilter('')
    setFechaHastaFilter('')
  }

  const filteredHistorial = useMemo(() => {
    if (!historial) return []
    let result = [...historial]

    if (estadoFilter) {
      result = result.filter(t => t.estado === estadoFilter)
    }

    if (fechaDesdeFilter) {
      result = result.filter(t => t.fechaHora.split('T')[0] >= fechaDesdeFilter)
    }

    if (fechaHastaFilter) {
      result = result.filter(t => t.fechaHora.split('T')[0] <= fechaHastaFilter)
    }

    result.sort((a, b) => {
      const dateA = new Date(a.fechaHora).getTime()
      const dateB = new Date(b.fechaHora).getTime()
      return dateA - dateB
    })

    return result
  }, [historial, estadoFilter, fechaDesdeFilter, fechaHastaFilter])

  if (isLoadingFijos) {
    return <div className={styles.loading}>Cargando información...</div>
  }

  if (!turnoFijo) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorState}>Regla de turno fijo no encontrada</div>
        <Button onClick={() => navigate('/turnos')}>Volver a Turnos</Button>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={() => navigate('/turnos')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className={styles.title}>Turno Fijo: {paciente?.nombre} {paciente?.apellido}</h1>
            <p className={styles.subtitle}>
              Todos los {DIAS_SEMANA[turnoFijo.diaSemana]}s a las {turnoFijo.hora.substring(0, 5)} ({turnoFijo.duracionMin} min)
              {!turnoFijo.activo && <span className={styles.badgeInactivo}>Inactivo</span>}
            </p>
          </div>
        </div>
        <div className={styles.headerRight} style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </Button>
          <Button leftIcon={<Edit size={18} />} onClick={() => setIsEditModalOpen(true)}>
            Editar Regla
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filtersContainer}>

        <div className={styles.filterGroup}>
          <label>Estado</label>
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value as any)} className={styles.input}>
            <option value="">Todos</option>
            <option value={EstadoTurno.Pendiente}>Pendiente</option>
            <option value={EstadoTurno.Presente}>Presente</option>
            <option value={EstadoTurno.Ausente}>Ausente</option>
            <option value={EstadoTurno.Cancelado}>Cancelado</option>
            <option value={EstadoTurno.Reprogramado}>Reprogramado</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Desde</label>
          <input type="date" value={fechaDesdeFilter} onChange={(e) => setFechaDesdeFilter(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.filterGroup}>
          <label>Hasta</label>
          <input type="date" value={fechaHastaFilter} onChange={(e) => setFechaHastaFilter(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.filterGroup} style={{ flexDirection: 'row', alignItems: 'flex-end', paddingBottom: '2px', gap: '0.5rem' }}>
          <Button variant="outline" onClick={handleDesdeHoy} size="sm">
            Mostrar desde hoy
          </Button>
          {(estadoFilter || fechaDesdeFilter || fechaHastaFilter) && (
            <Button variant="outline" onClick={handleLimpiarFiltros} size="sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>
              Limpiar
            </Button>
          )}
        </div>
      </div>
      )}

      <div className={styles.listContainer}>
        <TurnosList
          turnos={filteredHistorial}
          isLoading={isLoadingHistorial}
          onTurnoClick={setSelectedTurno}
          pacienteSearch=""
          hideFijoBadge={true}
        />
      </div>

      <EditTurnoFijoModal 
        turnoFijo={turnoFijo} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />

      <TurnoDetailModal
        turno={selectedTurno}
        isOpen={!!selectedTurno}
        onClose={() => setSelectedTurno(null)}
      />
    </div>
  )
}
