import React from 'react'
import { Calendar, Users, MapPin, Pencil } from 'lucide-react'
import type { ReunionResponseDto } from '../../schemas/reuniones.schema'
import styles from './ReunionesGrid.module.css'

interface ReunionesGridProps {
  reuniones: ReunionResponseDto[]
  isLoading: boolean
  onEditClick: (reunion: ReunionResponseDto) => void
  tituloSearch: string
}

export const ReunionesGrid = ({
  reuniones,
  isLoading,
  onEditClick,
  tituloSearch,
}: ReunionesGridProps) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando reuniones...</p>
      </div>
    )
  }

  // Filtrado local por título
  const reunionesFiltradas =
    reuniones?.filter((reunion) => {
      if (!tituloSearch) return true
      const searchLower = tituloSearch.toLowerCase()
      return reunion.titulo.toLowerCase().includes(searchLower)
    }) || []

  if (reunionesFiltradas.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <Users size={48} className={styles.emptyIcon} />
        <p>No se encontraron reuniones para los filtros seleccionados.</p>
      </div>
    )
  }

  const formatFechaHora = (fechaString: string) => {
    const date = new Date(fechaString)
    return {
      fecha: date.toLocaleDateString(),
      hora: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  }

  return (
    <div className={styles.listContainer}>
      {reunionesFiltradas.map((reunion) => {
        const { fecha, hora } = formatFechaHora(reunion.fechaHora)
        return (
          <div key={reunion.id} className={styles.listItem}>
            <div className={styles.itemMainInfo}>
              <div className={styles.reunionInfo}>
                <span className={styles.reunionTitle}>{reunion.titulo}</span>
              </div>
              <div className={styles.datetimeInfo}>
                <div className={styles.infoCol}>
                  <Calendar size={16} className={styles.icon} />
                  <span>
                    {fecha} a las {hora}
                  </span>
                </div>
                <div className={styles.infoCol}>
                  <MapPin size={16} className={styles.icon} />
                  <span>{reunion.modalidad || 'No definida'}</span>
                </div>
              </div>
            </div>

            <div className={styles.itemBadges}>
              <button
                className={styles.editButton}
                onClick={(e) => {
                  e.stopPropagation()
                  onEditClick(reunion)
                }}
                aria-label="Editar reunión"
              >
                <Pencil size={18} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
