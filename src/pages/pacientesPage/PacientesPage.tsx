import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '../../features/pacientes/hooks/usePacientes'
import { useProfesionales } from '../../features/pacientes/hooks/useProfesionales'
import { PatientList } from '../../features/pacientes/components/PatientList'
import { PatientFormModal } from '../../features/pacientes/components/PatientFormModal'
import type { Paciente } from '../../features/pacientes/types/paciente.types'
import type { PacienteFormData } from '../../features/pacientes/schemas/paciente.schema'
import styles from './PacientesPage.module.css'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'

export const PacientesPage: React.FC = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? Number(user.id) : undefined

  const [activeTab, setActiveTab] = useState<'mis-pacientes' | 'todos'>(
    'mis-pacientes'
  )
  const [searchDni, setSearchDni] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  )

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
  } = usePacientes(undefined, { page: 1, pageSize: 100 })

  const { vincularPaciente, isVinculando } = useProfesionales(profesionalId)

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

  React.useEffect(() => {
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

  const handleVincular = (pacienteId: number) => {
    if (profesionalId) {
      vincularPaciente({ id: profesionalId, pacienteId })
    }
  }

  const isLoading =
    activeTab === 'mis-pacientes' ? isLoadingMisPacientes : isLoadingTodos
  const currentPacientes =
    activeTab === 'mis-pacientes'
      ? pacientesVinculadosPage?.items
      : todosLosPacientesPage?.items

  const filteredPacientes = currentPacientes?.filter(
    (p) =>
      searchDni.trim() === '' || (p.dni && p.dni.includes(searchDni.trim()))
  )

  return (
    <div className={styles.pageContainer}>
      <div className={styles.filtersContainer}>
        <h2 className={styles.title}>Pacientes</h2>

        <div className={styles.controlsSection}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>
              <span>Vista</span>
            </label>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'mis-pacientes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('mis-pacientes')}
              >
                Mis Pacientes
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'todos' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('todos')}
              >
                Todos
              </button>
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
                placeholder="DNI..."
                value={searchDni}
                onChange={(e) => setSearchDni(e.target.value)}
                className={styles.searchInput}
              />
            </div>
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
          <PatientList
            pacientes={filteredPacientes || []}
            modo={activeTab}
            onEdit={activeTab === 'mis-pacientes' ? handleOpenModal : undefined}
            onVincular={activeTab === 'todos' ? handleVincular : undefined}
            isVinculando={isVinculando}
          />
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
