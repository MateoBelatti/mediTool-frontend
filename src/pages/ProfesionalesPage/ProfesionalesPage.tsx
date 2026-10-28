import { useState } from 'react'
import { isAxiosError } from 'axios'
import { AlertCircle, CheckCircle2, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import { useProfesionales } from '../../features/pacientes/hooks/useProfesionales'
import { ProfesionalList } from '../../features/pacientes/components/ProfesionalList/ProfesionalList'
import { ProfesionalFormModal } from '../../features/pacientes/components/ProfesionalFormModal/ProfesionalFormModal'
import type { ProfesionalFormData } from '../../features/pacientes/schemas/profesional.schema'
import styles from './ProfesionalesPage.module.css'

interface ApiErrorBody {
  message?: unknown
  details?: unknown
  errors?: unknown
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback

  const data: unknown = error.response?.data
  if (!data || typeof data !== 'object') return fallback

  const body = data as ApiErrorBody

  if (typeof body.message === 'string' && body.message.trim().length > 0) {
    return body.message
  }

  if (Array.isArray(body.details)) {
    const detail = body.details.find(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0
    )
    if (detail) return detail
  }

  if (body.errors && typeof body.errors === 'object') {
    const messages = Object.values(
      body.errors as Record<string, unknown>
    ).flatMap((value) => (Array.isArray(value) ? value : [value]))
    const message = messages.find(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0
    )
    if (message) return message
  }

  return fallback
}

export const ProfesionalesPage = () => {
  const {
    profesionales,
    isLoadingProfesionales,
    errorProfesionales,
    refetchProfesionales,
    create,
    isCreating,
  } = useProfesionales()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleOpenModal = () => {
    setApiError(null)
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setApiError(null)
  }

  const handleCreate = (data: ProfesionalFormData) => {
    setApiError(null)
    create(data, {
      onSuccess: () => {
        setIsModalOpen(false)
        setSuccessMessage('Profesional creado correctamente.')
      },
      onError: (error) => {
        setApiError(
          getApiErrorMessage(
            error,
            'No se pudo crear el profesional. Intentá nuevamente.'
          )
        )
      },
    })
  }

  const listError = errorProfesionales
    ? getApiErrorMessage(
        errorProfesionales,
        'No se pudieron cargar los profesionales.'
      )
    : null

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Profesionales</h1>
          <p className={styles.subtitle}>
            Gestión de los profesionales del consultorio.
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          leftIcon={<Plus size={18} />}
          size="sm"
        >
          Nuevo profesional
        </Button>
      </header>

      {successMessage && (
        <div className={styles.successMessage} role="status">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
          <button
            type="button"
            className={styles.dismissButton}
            onClick={() => setSuccessMessage(null)}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.content}>
        {isLoadingProfesionales ? (
          <div className={styles.loading} role="status">
            Cargando profesionales...
          </div>
        ) : listError ? (
          <div className={styles.errorState} role="alert">
            <AlertCircle size={32} className={styles.errorIcon} />
            <p>{listError}</p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={() => {
                void refetchProfesionales()
              }}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <ProfesionalList profesionales={profesionales ?? []} />
        )}
      </div>

      <ProfesionalFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
        apiError={apiError}
      />
    </div>
  )
}
