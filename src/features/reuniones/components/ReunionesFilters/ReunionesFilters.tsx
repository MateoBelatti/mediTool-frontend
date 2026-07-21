import React from 'react'
import { Search, Calendar as CalendarIcon, Plus } from 'lucide-react'
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
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.topSection}>
        <h2 className={styles.title}>Reuniones</h2>
        <Button
          onClick={onNewReunionClick}
          leftIcon={<Plus size={18} />}
          size="sm"
        >
          Nueva Reunión
        </Button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>
            <CalendarIcon size={16} />
            <span>Rango de Fechas</span>
          </label>
          <div className={styles.dateInputs}>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => onFechaDesdeChange(e.target.value)}
              className={styles.input}
            />
            <span className={styles.separator}>hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => onFechaHastaChange(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>
            <Search size={16} />
            <span>Buscar Reunión</span>
          </label>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={tituloSearch}
              onChange={(e) => onTituloSearchChange(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
