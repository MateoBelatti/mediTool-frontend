import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '../../features/pacientes/hooks/usePacientes'
import { useProfesionales } from '../../features/pacientes/hooks/useProfesionales'
import { PatientList } from '../../features/pacientes/components/PatientList'
import { PatientFormModal } from '../../features/pacientes/components/PatientFormModal'
import type { Paciente } from '../../features/pacientes/types/paciente.types'
import type { PacienteFormData } from '../../features/pacientes/schemas/paciente.schema'
import styles from './PacientesPage.module.css'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { Modal } from '@/shared/components/Modal/Modal'

export const PacientesPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const profesionalId = user?.id ? Number(user.id) : undefined

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

  const [searchDni, setSearchDni] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  )

  const [pacienteToUnlink, setPacienteToUnlink] = useState<number | null>(null)

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

  const { desvincularPaciente, isDesvinculando } =
    useProfesionales(profesionalId)

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

  const confirmDesvincular = () => {
    if (profesionalId && pacienteToUnlink !== null) {
      desvincularPaciente(
        { id: profesionalId, pacienteId: pacienteToUnlink },
        {
          onSuccess: () => setPacienteToUnlink(null),
        }
      )
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
            onEdit={isAdmin ? handleOpenModal : undefined}
            onDesvincular={
              !isAdmin ? (id) => setPacienteToUnlink(id) : undefined
            }
            isAdmin={isAdmin}
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

      <Modal
        isOpen={pacienteToUnlink !== null}
        onClose={() => setPacienteToUnlink(null)}
        title="Confirmar Desvinculación"
      >
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <p>
            ¿Está seguro que desea desvincular a este paciente? Ya no aparecerá
            en su lista de pacientes.
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
          >
            <Button
              onClick={() => setPacienteToUnlink(null)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDesvincular}
              variant="primary"
              disabled={isDesvinculando}
            >
              {isDesvinculando ? 'Desvinculando...' : 'Sí, desvincular'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
