import { useState, useMemo } from 'react'
import { Filter, Edit, Plus } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { TurnoCuadranteCard } from '../TurnoCuadranteCard/TurnoCuadranteCard'
import { TurnosFiltersBar } from '../TurnosFiltersBar/TurnosFiltersBar'
import { MonthSelector } from '../MonthSelector/MonthSelector'
import type { TurnoFijo } from '@/features/turnos-fijos/types/turnos-fijos.types'
import {
  type Turno,
  EstadoTurno,
  type ResumenAsistenciaDto,
} from '../../types/turnos.types'
import styles from './TurnosFijosPanel.module.css'

const DIAS_SEMANA_NOMBRES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

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

const formatDiaSemanaPlural = (diaIndex: number) => {
  const dia = DIAS_SEMANA_NOMBRES[diaIndex]
  if (!dia) return ''
  if (dia.toLowerCase().endsWith('s')) {
    return dia.toUpperCase()
  }
  return `${dia.toUpperCase()}S`
}

interface TurnosFijosPanelProps {
  selectedRegla: TurnoFijo | null
  historial?: Turno[]
  isLoadingHistorial: boolean
  resumenAsistencia?: ResumenAsistenciaDto
  onTurnoClick: (turno: Turno) => void
  onEditReglaClick: () => void
  onNewReglaClick: () => void
}

export const TurnosFijosPanel = ({
  selectedRegla,
  historial = [],
  isLoadingHistorial,
  onTurnoClick,
  onEditReglaClick,
  onNewReglaClick,
}: TurnosFijosPanelProps) => {
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

  // Filtrado general de los turnos de la regla
  const filteredHistorial = useMemo(() => {
    if (!historial) return []
    let result = [...historial]

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
  }, [historial, estadoFilter, fechaDesdeFilter, fechaHastaFilter])

  // Turnos agrupados/filtrados por el mes seleccionado
  const turnosDelMes = useMemo(() => {
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    return filteredHistorial.filter((t) => {
      const d = new Date(t.fechaHora)
      return d.getMonth() === month && d.getFullYear() === year
    })
  }, [filteredHistorial, currentDate])

  // Métricas de asistencia para el mes seleccionado
  const totalTurnosMes = turnosDelMes.length
  const totalAsistenciasMes = turnosDelMes.filter(
    (t) => t.estado === EstadoTurno.Presente
  ).length
  const progresoPorcentaje =
    totalTurnosMes > 0
      ? Math.min(100, Math.round((totalAsistenciasMes / totalTurnosMes) * 100))
      : 0

  if (!selectedRegla) {
    return (
      <div className={styles.noSelectionCard}>
        <p>Seleccioná una regla de la izquierda o creá una nueva.</p>
        <Button onClick={onNewReglaClick} leftIcon={<Plus size={16} />}>
          Nueva regla
        </Button>
      </div>
    )
  }

  const paciente = selectedRegla.paciente

  return (
    <div className={styles.cardContainer}>
      {/* Header fijo superior */}
      <div className={styles.headerSection}>
        <div className={styles.cardHeader}>
          <div className={styles.cardHeaderInfo}>
            <h2 className={styles.pacienteTitle}>
              {paciente
                ? `${paciente.nombre} ${paciente.apellido}`
                : `Regla #${selectedRegla.id}`}
            </h2>

            <div className={styles.chipsRow}>
              <span className={styles.chip}>
                TODOS LOS {formatDiaSemanaPlural(selectedRegla.diaSemana)}
              </span>
              <span className={styles.chip}>
                {selectedRegla.hora.substring(0, 5)}
              </span>
              <span className={styles.chip}>
                {selectedRegla.duracionMin} MIN
              </span>
              {!selectedRegla.activo && (
                <span className={styles.chipInactivo}>INACTIVA</span>
              )}
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
                leftIcon={<Edit size={16} />}
                onClick={onEditReglaClick}
              >
                Editar regla
              </Button>
            </div>

            {/* Cuadrito de mes abajo de filtros y editar regla */}
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

        {/* Sección de Asistencia (del mes seleccionado) */}
        <div className={styles.asistenciaSection}>
          <div className={styles.asistenciaHeader}>
            <span className={styles.asistenciaTitle}>Asistencia</span>
            <span className={styles.asistenciaCount}>
              {totalAsistenciasMes} de {totalTurnosMes} turnos
            </span>
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progresoPorcentaje}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grilla de cuadrantes contenida con scroll */}
      <div className={styles.cuadrantesSection}>
        {isLoadingHistorial ? (
          <div className={styles.loadingCuadrantes}>Cargando turnos...</div>
        ) : turnosDelMes.length === 0 ? (
          <div className={styles.emptyCuadrantes}>
            No hay turnos registrados en {MESES_NOMBRES[currentDate.getMonth()]}{' '}
            de {currentDate.getFullYear()}.
          </div>
        ) : (
          <div className={styles.cuadrantesGrid}>
            {turnosDelMes.map((turno) => (
              <TurnoCuadranteCard
                key={turno.id}
                turno={turno}
                onClick={onTurnoClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
