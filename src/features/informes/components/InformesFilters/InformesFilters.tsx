import React from 'react'
import { Search, Calendar as CalendarIcon, Plus } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import styles from './InformesFilters.module.css'

interface InformesFiltersProps {
  fechaDesde: string
  fechaHasta: string
  onFechaDesdeChange: (date: string) => void
  onFechaHastaChange: (date: string) => void
  pacienteSearch: string
  onPacienteSearchChange: (search: string) => void
  onNewInformeClick: () => void
}

export const InformesFilters = ({
  fechaDesde,
  fechaHasta,
  onFechaDesdeChange,
  onFechaHastaChange,
  pacienteSearch,
  onPacienteSearchChange,
  onNewInformeClick,
}: InformesFiltersProps) => {
  return (
    <div className={styles.filtersContainer}>
      <h2 className={styles.title}>Informes</h2>

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

      <Button
        onClick={onNewInformeClick}
        leftIcon={<Plus size={18} />}
        size="sm"
      >
        Nuevo Informe
      </Button>
    </div>
  )
}
