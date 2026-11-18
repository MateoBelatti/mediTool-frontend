import { Button } from '@/shared/components/Button/Button'
import { EstadoTurno } from '../../types/turnos.types'
import styles from './TurnosFiltersBar.module.css'

interface TurnosFiltersBarProps {
  estado: EstadoTurno | ''
  onEstadoChange: (estado: EstadoTurno | '') => void
  fechaDesde: string
  onFechaDesdeChange: (fecha: string) => void
  fechaHasta: string
  onFechaHastaChange: (fecha: string) => void
  onDesdeHoy: () => void
  onLimpiar: () => void
}

export const TurnosFiltersBar = ({
  estado,
  onEstadoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  onDesdeHoy,
  onLimpiar,
}: TurnosFiltersBarProps) => {
  const hasActiveFilters = Boolean(estado || fechaDesde || fechaHasta)

  return (
    <div className={styles.filtersBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="filtro-estado">Estado</label>
        <select
          id="filtro-estado"
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as EstadoTurno | '')}
          className={styles.filterInput}
        >
          <option value="">Todos</option>
          <option value={EstadoTurno.Pendiente}>Pendiente</option>
          <option value={EstadoTurno.Presente}>Presente</option>
          <option value={EstadoTurno.Ausente}>Ausente</option>
          <option value={EstadoTurno.Cancelado}>Cancelado</option>
          <option value={EstadoTurno.Reprogramado}>Reprogramado</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="filtro-desde">Desde</label>
        <input
          id="filtro-desde"
          type="date"
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="filtro-hasta">Hasta</label>
        <input
          id="filtro-hasta"
          type="date"
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
          className={styles.filterInput}
        />
      </div>

      <div className={styles.filterActions}>
        <Button variant="outline" size="sm" onClick={onDesdeHoy}>
          Desde hoy
        </Button>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLimpiar}
            style={{
              color: 'var(--danger)',
              borderColor: 'var(--danger)',
            }}
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
