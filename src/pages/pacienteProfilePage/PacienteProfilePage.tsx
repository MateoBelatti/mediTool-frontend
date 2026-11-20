import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Edit,
  GraduationCap,
} from 'lucide-react'
import { pacienteService } from '@/features/pacientes/services/paciente.service'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/components/Button/Button'
import { PatientFormModal } from '@/features/pacientes/components/PatientFormModal'
import { HistorialPaciente } from '@/features/pacientes/components/HistorialPaciente/HistorialPaciente'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import { useProfesionales } from '@/features/pacientes/hooks/useProfesionales'
import { DocumentosPaciente } from '@/features/documentos/components/DocumentosPaciente/DocumentosPaciente'
import type { PacienteFormData } from '@/features/pacientes/schemas/paciente.schema'
import { Modal } from '@/shared/components/Modal/Modal'
import styles from './PacienteProfilePage.module.css'

export const PacienteProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  const [activeTab, setActiveTab] = useState<
    'info' | 'historial' | 'documentos'
  >('info')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [pacienteToUnlink, setPacienteToUnlink] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const { update: updatePaciente, isUpdating } = usePacientes()
  const { desvincularPaciente, isDesvinculando } = useProfesionales(
    Number(user?.id)
  )

  const {
    data: paciente,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['paciente', id],
    queryFn: () => pacienteService.getById(Number(id)),
    enabled: !!id,
  })

  const handleEditSubmit = (data: PacienteFormData) => {
    if (paciente) {
      updatePaciente(
        { id: paciente.id, data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['paciente', id] })
          },
        }
      )
    }
  }

  const confirmDesvincular = () => {
    if (user?.id && pacienteToUnlink !== null) {
      desvincularPaciente(
        { id: Number(user.id), pacienteId: pacienteToUnlink },
        {
          onSuccess: () => {
            setPacienteToUnlink(null)
            navigate('/pacientes')
          },
        }
      )
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Cargando perfil del paciente...</div>
  }

  if (error || !paciente) {
    return (
      <div className={styles.error}>
        <p>No se pudo cargar la información del paciente.</p>
        <Button onClick={() => navigate('/pacientes')} variant="secondary">
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate('/pacientes')}
        >
          <ArrowLeft size={20} />
          <span>Volver a Pacientes</span>
        </button>
        <div className={styles.headerActions}>
          {isAdmin && (
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit size={16} />}
            >
              Editar
            </Button>
          )}
          {!isAdmin && (
            <Button
              variant="secondary"
              style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger)',
                borderColor: 'var(--danger)',
              }}
              onClick={() => setPacienteToUnlink(paciente.id)}
            >
              Desvincular
            </Button>
          )}
          <Button
            onClick={() =>
              navigate('/turnos', { state: { pacienteId: paciente.id } })
            }
          >
            Agendar Turno
          </Button>
        </div>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <User size={48} />
          </div>
          <div>
            <h1 className={styles.name}>
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className={styles.dni}>DNI: {paciente.dni || 'No registrado'}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Información General
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'historial' ? styles.active : ''}`}
            onClick={() => setActiveTab('historial')}
          >
            Historial
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'documentos' ? styles.active : ''}`}
            onClick={() => setActiveTab('documentos')}
          >
            Documentos
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'info' && (
            <div className={styles.infoGrid}>
              <div className={styles.infoGroup}>
                <h3>Datos de Contacto</h3>
                <div className={styles.infoRow}>
                  <Phone size={18} />
                  <span>{paciente.telefono || 'No registrado'}</span>
                </div>
                <div className={styles.infoRow}>
                  <Mail size={18} />
                  <span>{paciente.email || 'No registrado'}</span>
                </div>
                <div className={styles.infoRow}>
                  <MapPin size={18} />
                  <span>{paciente.direccion || 'No registrado'}</span>
                </div>
              </div>

              <div className={styles.infoGroup}>
                <h3>Datos Médicos / Administrativos</h3>
                <div className={styles.infoRow}>
                  <Calendar size={18} />
                  <span>
                    Nacimiento: {paciente.fechaNacimiento || 'No registrado'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <CreditCard size={18} />
                  <span>
                    Obra Social: {paciente.obraSocial || 'No registrado'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <CreditCard size={18} />
                  <span>
                    Nro Afiliado: {paciente.nroAfiliado || 'No registrado'}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <GraduationCap size={18} />
                  <span>Escuela: {paciente.escuela || 'No registrado'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <HistorialPaciente pacienteId={paciente.id} />
          )}

          {activeTab === 'documentos' && (
            <div className={styles.documentosSection}>
              <DocumentosPaciente pacienteId={paciente.id} />
            </div>
          )}
        </div>
      </div>

      <PatientFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        paciente={paciente}
        isSubmitting={isUpdating}
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
