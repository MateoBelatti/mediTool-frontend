import { X } from 'lucide-react'
import { EstadoTurno } from '@/features/turnos/types/turnos.types'
import type { HistorialFiltros } from '../../types/historial.types'
import styles from './HistorialFilters.module.css'

interface HistorialFiltersProps {
  filtros: HistorialFiltros
  onChange: (cambios: Partial<HistorialFiltros>) => void
  onClear: () => void
}

const ESTADOS: EstadoTurno[] = [
  EstadoTurno.Pendiente,
  EstadoTurno.Presente,
  EstadoTurno.Ausente,
  EstadoTurno.Reprogramado,
  EstadoTurno.Cancelado,
]

export const HistorialFilters = ({
  filtros,
  onChange,
  onClear,
}: HistorialFiltersProps) => {
  const hasActiveFilters = Boolean(
    filtros.tipo !== 'todos' ||
    filtros.estado ||
    filtros.desde ||
    filtros.hasta ||
    filtros.soloConInforme
  )

  return (
    <div className={styles.card}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Tipo</span>
          <select
            value={filtros.tipo}
            onChange={(e) =>
              onChange({
                tipo: e.target.value as HistorialFiltros['tipo'],
              })
            }
          >
            <option value="todos">Todos</option>
            <option value="turno">Turnos</option>
            <option value="informe">Informes</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>Estado del turno</span>
          <select
            value={filtros.estado}
            onChange={(e) =>
              onChange({ estado: e.target.value as HistorialFiltros['estado'] })
            }
          >
            <option value="">Todos</option>
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={filtros.soloConInforme}
            onChange={(e) => onChange({ soloConInforme: e.target.checked })}
          />
          <span>Solo con informe</span>
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
