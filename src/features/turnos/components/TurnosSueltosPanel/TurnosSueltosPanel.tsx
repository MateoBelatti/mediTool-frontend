import { useState, useMemo } from 'react'
import { Filter, Plus } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { TurnoCuadranteCard } from '../TurnoCuadranteCard/TurnoCuadranteCard'
import { TurnosFiltersBar } from '../TurnosFiltersBar/TurnosFiltersBar'
import { MonthSelector } from '../MonthSelector/MonthSelector'
import { type Turno, EstadoTurno } from '../../types/turnos.types'
import styles from './TurnosSueltosPanel.module.css'

const MESES_NOMBRES = [
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

interface TurnosSueltosPanelProps {
  selectedPacienteId: number | 'todos'
  pacientesConSueltos: Array<{
    paciente: NonNullable<Turno['paciente']>
    count: number
  }>
  turnosSueltos: Turno[]
  isLoading: boolean
  onTurnoClick: (turno: Turno) => void
  onNewTurnoClick: () => void
}

export const TurnosSueltosPanel = ({
  selectedPacienteId,
  pacientesConSueltos,
  turnosSueltos,
  isLoading,
  onTurnoClick,
  onNewTurnoClick,
}: TurnosSueltosPanelProps) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showFilters, setShowFilters] = useState(false)
  const [estadoFilter, setEstadoFilter] = useState<EstadoTurno | ''>('')
  const [fechaDesdeFilter, setFechaDesdeFilter] = useState('')
  const [fechaHastaFilter, setFechaHastaFilter] = useState('')

  const handlePreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    )
  }

  const handleDesdeHoy = () => {
    const today = new Date()
    setCurrentDate(today)
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    setFechaDesdeFilter(`${yyyy}-${mm}-${dd}`)
    setFechaHastaFilter('')
  }

  const handleLimpiarFiltros = () => {
    setEstadoFilter('')
    setFechaDesdeFilter('')
    setFechaHastaFilter('')
  }

  // Filtrado de turnos sueltos por paciente y filtros
  const filteredTurnos = useMemo(() => {
    let result =
      selectedPacienteId === 'todos'
        ? [...turnosSueltos]
        : turnosSueltos.filter((t) => t.pacienteId === selectedPacienteId)

    if (estadoFilter) {
      result = result.filter((t) => t.estado === estadoFilter)
    }
    if (fechaDesdeFilter) {
      result = result.filter(
        (t) => t.fechaHora.split('T')[0] >= fechaDesdeFilter
      )
    }
    if (fechaHastaFilter) {
      result = result.filter(
        (t) => t.fechaHora.split('T')[0] <= fechaHastaFilter
      )
    }

    result.sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    )
    return result
  }, [
    turnosSueltos,
    selectedPacienteId,
    estadoFilter,
    fechaDesdeFilter,
    fechaHastaFilter,
  ])

  // Turnos agrupados/filtrados por el mes seleccionado
  const turnosDelMes = useMemo(() => {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    return filteredTurnos.filter((t) => {
      const d = new Date(t.fechaHora)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }, [filteredTurnos, currentDate])

  // Título según selección
  const titulo = useMemo(() => {
    if (selectedPacienteId === 'todos') {
      return 'Todos los turnos sueltos'
    }
    const item = pacientesConSueltos.find(
      (p) => p.paciente.id === selectedPacienteId
    )
    return item
      ? `${item.paciente.nombre} ${item.paciente.apellido}`
      : 'Turnos del Paciente'
  }, [selectedPacienteId, pacientesConSueltos])

  return (
    <div className={styles.cardContainer}>
      <div className={styles.headerSection}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderInfo}>
            <h2 className={styles.pacienteTitle}>{titulo}</h2>

            <div className={styles.chipsRow}>
              <span className={styles.chip}>
                {turnosDelMes.length}{' '}
                {turnosDelMes.length === 1
                  ? 'TURNO EN EL MES'
                  : 'TURNOS EN EL MES'}
              </span>
            </div>
          </div>

          <div className={styles.headerRightColumn}>
            <div className={styles.cardHeaderActions}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Filter size={16} />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Ocultar filtros' : 'Filtros'}
              </Button>
              <Button
                size="sm"
                leftIcon={<Plus size={16} />}
                onClick={onNewTurnoClick}
              >
                Nuevo turno
              </Button>
            </div>

            {/* Cuadrito de mes abajo de filtros y nuevo turno */}
            <MonthSelector
              currentDate={currentDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
            />
          </div>
        </div>

        {/* Filtros colapsables */}
        {showFilters && (
          <div className={styles.filtersWrapper}>
            <TurnosFiltersBar
              estado={estadoFilter}
              onEstadoChange={setEstadoFilter}
              fechaDesde={fechaDesdeFilter}
              onFechaDesdeChange={setFechaDesdeFilter}
              fechaHasta={fechaHastaFilter}
              onFechaHastaChange={setFechaHastaFilter}
              onDesdeHoy={handleDesdeHoy}
              onLimpiar={handleLimpiarFiltros}
            />
          </div>
        )}
      </div>

      {/* Grilla de Cuadrantes para Turnos Sueltos con scroll propio */}
      <div className={styles.cuadrantesSection}>
        {isLoading ? (
          <div className={styles.loadingCuadrantes}>Cargando turnos...</div>
        ) : turnosDelMes.length === 0 ? (
          <div className={styles.emptyCuadrantes}>
            No hay turnos sueltos en {MESES_NOMBRES[currentDate.getMonth()]} de{' '}
            {currentDate.getFullYear()}.
          </div>
        ) : (
          <div className={styles.cuadrantesGrid}>
            {turnosDelMes.map((turno) => (
              <TurnoCuadranteCard
                key={turno.id}
                turno={turno}
                onClick={onTurnoClick}
                showHora={true}
                showPaciente={selectedPacienteId === 'todos'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
