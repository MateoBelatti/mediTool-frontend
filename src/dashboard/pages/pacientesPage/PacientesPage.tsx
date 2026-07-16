import React, { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '../../../features/pacientes/hooks/usePacientes'
import { useProfesionales } from '../../../features/pacientes/hooks/useProfesionales'
import { PatientList } from '../../../features/pacientes/components/PatientList'
import { PatientFormModal } from '../../../features/pacientes/components/PatientFormModal'
import type { Paciente } from '../../../features/pacientes/types/paciente.types'
import type { PacienteFormData } from '../../../features/pacientes/schemas/paciente.schema'
import styles from './PacientesPage.module.css'
import { Plus, Search } from 'lucide-react'

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
    pacientes: todosLosPacientes,
    isLoadingPacientes: isLoadingTodos,
    create: createPaciente,
    isCreating,
    update: updatePaciente,
    isUpdating,
  } = usePacientes()

  const {
    pacientesVinculados,
    isLoadingPacientes: isLoadingMisPacientes,
    vincularPaciente,
    isVinculando,
  } = useProfesionales(profesionalId)

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

  const handleVincular = (pacienteId: number) => {
    if (profesionalId) {
      vincularPaciente({ id: profesionalId, pacienteId })
    }
  }

  const isLoading =
    activeTab === 'mis-pacientes' ? isLoadingMisPacientes : isLoadingTodos
  const currentPacientes =
    activeTab === 'mis-pacientes' ? pacientesVinculados : todosLosPacientes

  const filteredPacientes = currentPacientes?.filter(
    (p) =>
      searchDni.trim() === '' || (p.dni && p.dni.includes(searchDni.trim()))
  )

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1>Pacientes</h1>
          <p>
            Gestiona los datos de tus pacientes y vincula nuevos a tu lista.
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>
          <Plus size={20} />
          <span>Nuevo Paciente</span>
        </button>
      </div>

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
          Todos los Pacientes
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por DNI..."
            value={searchDni}
            onChange={(e) => setSearchDni(e.target.value)}
            className={styles.searchInput}
          />
        </div>

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
