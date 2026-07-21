import React, { useState, useMemo } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useReunionesByProfesionalId } from '@/features/reuniones/hooks/useReuniones'
import { ReunionesFilters } from '@/features/reuniones/components/ReunionesFilters/ReunionesFilters'
import { ReunionesGrid } from '@/features/reuniones/components/ReunionesGrid/ReunionesGrid'
import { ReunionFormModal } from '@/features/reuniones/components/ReunionFormModal/ReunionFormModal'
import type { ReunionResponseDto } from '@/features/reuniones/schemas/reuniones.schema'
import styles from './ReunionesPage.module.css'

export const ReunionesPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0

  const { data: reuniones, isLoading: isLoadingReuniones } =
    useReunionesByProfesionalId(profesionalId)

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [tituloSearch, setTituloSearch] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reunionToEdit, setReunionToEdit] = useState<ReunionResponseDto | null>(
    null
  )

  // Filtrado de servidor (fechas) - implementado localmente por simplicidad
  const reunionesFiltradas = useMemo(() => {
    if (!reuniones) return []
    let filtered = reuniones

    if (fechaDesde) {
      const desdeDate = new Date(fechaDesde)
      filtered = filtered.filter((r) => new Date(r.fechaHora) >= desdeDate)
    }

    if (fechaHasta) {
      const hastaDate = new Date(fechaHasta)
      // Ajustamos hastaDate para incluir todo el día
      hastaDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((r) => new Date(r.fechaHora) <= hastaDate)
    }

    return filtered
  }, [reuniones, fechaDesde, fechaHasta])

  const handleNewReunion = () => {
    setReunionToEdit(null)
    setIsModalOpen(true)
  }

  const handleEditReunion = (reunion: ReunionResponseDto) => {
    setReunionToEdit(reunion)
    setIsModalOpen(true)
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.content}>
        <ReunionesFilters
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          onFechaDesdeChange={setFechaDesde}
          onFechaHastaChange={setFechaHasta}
          tituloSearch={tituloSearch}
          onTituloSearchChange={setTituloSearch}
          onNewReunionClick={handleNewReunion}
        />

        <ReunionesGrid
          reuniones={reunionesFiltradas}
          isLoading={isLoadingReuniones}
          onEditClick={handleEditReunion}
          tituloSearch={tituloSearch}
        />
      </div>

      <ReunionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reunionToEdit={reunionToEdit}
      />
    </div>
  )
}
