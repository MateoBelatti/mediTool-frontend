import { useState, useMemo } from 'react'
import { ROLES, useAuth } from '@/features/auth/hooks/useAuth'
import {
  useReuniones,
  useReunionesByProfesionalId,
} from '@/features/reuniones/hooks/useReuniones'
import { ReunionesFilters } from '@/features/reuniones/components/ReunionesFilters/ReunionesFilters'
import { ReunionesGrid } from '@/features/reuniones/components/ReunionesGrid/ReunionesGrid'
import { ReunionFormModal } from '@/features/reuniones/components/ReunionFormModal/ReunionFormModal'
import { ReunionDetailModal } from '@/features/reuniones/components/ReunionDetailModal/ReunionDetailModal'
import type { ReunionResponseDto } from '@/features/reuniones/schemas/reuniones.schema'
import styles from './ReunionesPage.module.css'

export const ReunionesPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0
  const isAdmin = user?.role === ROLES.ADMIN

  const { data: reunionesAdmin, isLoading: isLoadingAdmin } =
    useReuniones(isAdmin)
  const { data: reunionesPropias, isLoading: isLoadingPropias } =
    useReunionesByProfesionalId(profesionalId, !isAdmin)

  const reuniones = isAdmin ? reunionesAdmin : reunionesPropias
  const isLoadingReuniones = isAdmin ? isLoadingAdmin : isLoadingPropias

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [tituloSearch, setTituloSearch] = useState('')

  // Modal para crear / editar
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [reunionToEdit, setReunionToEdit] = useState<ReunionResponseDto | null>(
    null
  )

  // Modal de detalle con la descripción
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedReunion, setSelectedReunion] =
    useState<ReunionResponseDto | null>(null)

  // Filtrado de servidor (fechas) - implementado localmente
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
    setIsFormModalOpen(true)
  }

  const handleEditReunion = (reunion: ReunionResponseDto) => {
    setReunionToEdit(reunion)
    setIsFormModalOpen(true)
  }

  const handleReunionClick = (reunion: ReunionResponseDto) => {
    setSelectedReunion(reunion)
    setIsDetailModalOpen(true)
  }

  const puedeEditarReunion = (reunion: ReunionResponseDto) =>
    isAdmin || reunion.profesionalId === profesionalId

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
          onReunionClick={handleReunionClick}
          puedeEditar={puedeEditarReunion}
          tituloSearch={tituloSearch}
        />
      </div>

      <ReunionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedReunion(null)
        }}
        reunion={selectedReunion}
        onEdit={handleEditReunion}
        puedeEditar={
          selectedReunion ? puedeEditarReunion(selectedReunion) : false
        }
      />

      <ReunionFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setReunionToEdit(null)
        }}
        reunionToEdit={reunionToEdit}
      />
    </div>
  )
}
