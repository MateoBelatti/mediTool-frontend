import { Search, Calendar as CalendarIcon, Plus, X } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import styles from './TurnosFilters.module.css'

interface TurnosFiltersProps {
  fecha: string
  onFechaChange: (date: string) => void
  pacienteSearch: string
  onPacienteSearchChange: (search: string) => void
  onNewTurnoClick: () => void
}

export const TurnosFilters = ({
  fecha,
  onFechaChange,
  pacienteSearch,
  onPacienteSearchChange,
  onNewTurnoClick,
}: TurnosFiltersProps) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.headerTop}>
        <h2 className={styles.title}>Turnos</h2>
        <Button
          onClick={onNewTurnoClick}
          leftIcon={<Plus size={18} />}
          size="sm"
          className={styles.newButton}
        >
          Nuevo Turno
        </Button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>
              <CalendarIcon size={16} />
              <span>Fecha</span>
            </label>
            {fecha && (
              <button
                type="button"
                onClick={() => onFechaChange('')}
                className={styles.clearDateBtn}
                title="Mostrar todos los turnos"
              >
                <X size={12} />
                <span>Ver todos</span>
              </button>
            )}
          </div>
          <input
            type="date"
            value={fecha}
            onChange={(e) => onFechaChange(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>
            <Search size={16} />
            <span>Buscar Paciente</span>
          </label>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Nombre o DNI..."
              value={pacienteSearch}
              onChange={(e) => onPacienteSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
