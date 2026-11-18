import { useState } from 'react'
import { Plus, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import styles from './ReunionesFilters.module.css'

interface ReunionesFiltersProps {
  fechaDesde: string
  fechaHasta: string
  onFechaDesdeChange: (date: string) => void
  onFechaHastaChange: (date: string) => void
  tituloSearch: string
  onTituloSearchChange: (search: string) => void
  onNewReunionClick: () => void
}

export const ReunionesFilters = ({
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  tituloSearch,
  onTituloSearchChange,
  onNewReunionClick,
}: ReunionesFiltersProps) => {
  const [showDateFilters, setShowDateFilters] = useState(false)

  const hasActiveDateFilters = Boolean(fechaDesde || fechaHasta)

  const handleClearDateFilters = () => {
    onFechaDesdeChange('')
    onFechaHastaChange('')
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Reuniones</h1>

        <div className={styles.actionsBar}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={tituloSearch}
              onChange={(e) => onTituloSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button
            type="button"
            className={`${styles.filterButton} ${hasActiveDateFilters ? styles.filterButtonActive : ''}`}
            onClick={() => setShowDateFilters((prev) => !prev)}
            aria-label="Abrir filtros de fecha"
          >
            <SlidersHorizontal size={15} />
            <span>Filtros</span>
            {hasActiveDateFilters && <span className={styles.filterDot} />}
          </button>

          <Button
            onClick={onNewReunionClick}
            leftIcon={<Plus size={18} />}
            className={styles.newButton}
          >
            Nueva reunión
          </Button>
        </div>
      </div>

      {showDateFilters && (
        <div className={styles.dateFilterDropdown}>
          <div className={styles.dateGroup}>
            <span className={styles.dateLabel}>Desde:</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesdeChange(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.dateGroup}>
            <span className={styles.dateLabel}>Hasta:</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHastaChange(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          {hasActiveDateFilters && (
            <button
              type="button"
              onClick={handleClearDateFilters}
              className={styles.clearFiltersBtn}
            >
              <X size={14} />
              <span>Limpiar fechas</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
