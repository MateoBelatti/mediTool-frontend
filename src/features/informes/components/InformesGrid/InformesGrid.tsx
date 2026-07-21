import React from 'react'
import { FileText, User as UserIcon, Calendar, Pencil } from 'lucide-react'
import type { InformeResponseDto } from '../../schemas/informes.schema'
import styles from './InformesGrid.module.css'

interface PacienteData {
  nombre: string
  apellido: string
  dni?: string
}

// Extendemos InformeResponseDto localmente para incluir los datos del paciente enriquecidos
export interface InformeWithPaciente extends InformeResponseDto {
  pacienteData?: PacienteData
}

interface InformesGridProps {
  informes: InformeWithPaciente[]
  isLoading: boolean
  onEditClick: (informe: InformeWithPaciente) => void
  pacienteSearch: string
}

export const InformesGrid = ({
  informes,
  isLoading,
  onEditClick,
  pacienteSearch,
}: InformesGridProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando informes...</p>
      </div>
    )
  }

  // Filtrado local por paciente (nombre, apellido o dni)
  const informesFiltrados =
    informes?.filter((informe) => {
      if (!pacienteSearch) return true
      const searchLower = pacienteSearch.toLowerCase()
      const paciente = informe.pacienteData
      if (!paciente) return false

      const fullName =
        `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase()
      return (
        fullName.includes(searchLower) ||
        (paciente.dni && paciente.dni.includes(searchLower))
      )
    }) || []

  if (informesFiltrados.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <FileText size={48} className={styles.emptyIcon} />
        <p>No se encontraron informes para los filtros seleccionados.</p>
      </div>
    )
  }

  const formatFecha = (fechaString: string) => {
    // Si viene solo como yyyy-mm-dd
    if (fechaString.length === 10) {
      const [year, month, day] = fechaString.split('-')
      return `${day}/${month}/${year}`
    }
    const date = new Date(fechaString)
    return date.toLocaleDateString()
  }

  return (
    <div className={styles.listContainer}>
      {informesFiltrados.map((informe) => (
        <div key={informe.id} className={styles.listItem}>
          <div className={styles.itemMainInfo}>
            <div className={styles.pacienteInfo}>
              <UserIcon size={18} className={styles.icon} />
              <span className={styles.pacienteName}>
                {informe.pacienteData
                  ? `${informe.pacienteData.nombre || ''} ${informe.pacienteData.apellido || ''}`
                  : 'Paciente Desconocido'}
              </span>
            </div>
            <div className={styles.datetimeInfo}>
              <div className={styles.infoCol}>
                <Calendar size={16} className={styles.icon} />
                <span>{formatFecha(informe.fecha)}</span>
              </div>
              <div className={styles.infoCol}>
                <FileText size={16} className={styles.icon} />
                <span>{informe.tipo || 'Sin tipo'}</span>
              </div>
            </div>
          </div>

          <div className={styles.itemBadges}>
            {informe.estado && (
              <span className={styles.estadoBadge}>{informe.estado}</span>
            )}
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation()
                onEditClick(informe)
              }}
              aria-label="Editar informe"
            >
              <Pencil size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
