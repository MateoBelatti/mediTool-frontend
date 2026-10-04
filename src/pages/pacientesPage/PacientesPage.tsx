import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '../../features/pacientes/hooks/usePacientes'
import { PatientList } from '../../features/pacientes/components/PatientList'
import { PatientFormModal } from '../../features/pacientes/components/PatientFormModal'
import type { Paciente } from '../../features/pacientes/types/paciente.types'
import type { PacienteFormData } from '../../features/pacientes/schemas/paciente.schema'
import styles from './PacientesPage.module.css'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Pagination } from '@/shared/components/Pagination/Pagination'

export const PacientesPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  // Admins always see 'todos', Profesionales always see 'mis-pacientes'
  const [activeTab, setActiveTab] = useState<'mis-pacientes' | 'todos'>(
    isAdmin ? 'todos' : 'mis-pacientes'
  )

  useEffect(() => {
    if (isAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('todos')
    } else {
      setActiveTab('mis-pacientes')
    }
  }, [isAdmin])

  type SortField = 'nombre' | 'apellido' | 'obraSocial' | 'dni'
  type SortOrder = 'asc' | 'desc'

  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('nombre')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  )

  const [page, setPage] = useState(1)
  const pageSize = 12 // Using 12 for grid

  // Reset page when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [searchTerm, sortField, sortOrder, activeTab])

  // Hooks
  const {
    pacientes: todosLosPacientesPage,
    isLoadingPacientes: isLoadingTodos,
    pacientesVinculados: pacientesVinculadosPage,
    isLoadingVinculados: isLoadingMisPacientes,
    create: createPaciente,
    isCreating,
    update: updatePaciente,
    isUpdating,
  } = usePacientes(undefined, {
    page,
    pageSize,
    searchTerm,
    sortBy: sortField,
    sortOrder,
  })

  const handleOpenModal = (paciente?: Paciente) => {
    setSelectedPaciente(paciente || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPaciente(null)
  }

  const handleSubmit = (data: PacienteFormData) => {
    if (selectedPaciente) {
      updatePaciente(
        { id: selectedPaciente.id, data },
        {
          onSuccess: () => handleCloseModal(),
        }
      )
    } else {
      createPaciente(data, {
        onSuccess: () => handleCloseModal(),
      })
    }
  }

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openNewModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleOpenModal()
      navigate(location.pathname, { replace: true, state: {} })
      return
    }

    if (location.state?.openPacienteId) {
      const pId = location.state.openPacienteId
      const foundPaciente =
        pacientesVinculadosPage?.items?.find((p) => p.id === pId) ||
        todosLosPacientesPage?.items?.find((p) => p.id === pId)

      if (foundPaciente) {
        handleOpenModal(foundPaciente)
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [
    location.state,
    pacientesVinculadosPage,
    todosLosPacientesPage,
    navigate,
    location.pathname,
  ])

  const isLoading =
    activeTab === 'mis-pacientes' ? isLoadingMisPacientes : isLoadingTodos

  const currentPageResult =
    activeTab === 'mis-pacientes'
      ? pacientesVinculadosPage
      : todosLosPacientesPage

  const currentPacientes = currentPageResult?.items || []
  const totalPages = currentPageResult?.totalPages || 1

  return (
    <div className={styles.pageContainer}>
      <div className={styles.filtersContainer}>
        <h2 className={styles.title}>Pacientes</h2>

        <div className={styles.controlsSection}>
          <div
            className={styles.filterGroup}
            style={{ flex: 1, minWidth: '250px' }}
          >
            <label className={styles.label}>
              <Search size={16} />
              <span>Buscar Paciente</span>
            </label>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>
              <span>Ordenar por</span>
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <option value="nombre">Nombre</option>
              <option value="apellido">Apellido</option>
              <option value="dni">DNI</option>
              <option value="obraSocial">Obra Social</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.label}>
              <span>Orden</span>
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus size={18} />}
          size="sm"
        >
          Nuevo Paciente
        </Button>
      </div>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>Cargando pacientes...</div>
        ) : (
          <>
            <PatientList
              pacientes={currentPacientes}
              onEdit={isAdmin ? handleOpenModal : undefined}

              isAdmin={isAdmin}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        paciente={selectedPaciente}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  )
}
