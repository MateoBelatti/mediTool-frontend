import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  ReunionCreateSchema,
  type ReunionCreateDto,
  type ReunionResponseDto,
} from '../../schemas/reuniones.schema'
import { useCreateReunion, useUpdateReunion } from '../../hooks/useReuniones'
import styles from './ReunionFormModal.module.css'

interface ReunionFormModalProps {
  isOpen: boolean
  onClose: () => void
  reunionToEdit?: ReunionResponseDto | null
}

export const ReunionFormModal = ({
  isOpen,
  onClose,
  reunionToEdit,
}: ReunionFormModalProps) => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0

  const createMutation = useCreateReunion()
  const updateMutation = useUpdateReunion()

  const form = useForm<ReunionCreateDto>({
    resolver: zodResolver(ReunionCreateSchema),
    defaultValues: {
      profesionalId,
      titulo: '',
      fechaHora: '',
      modalidad: '',
      descripcion: '',
    },
  })

  useEffect(() => {
    if (reunionToEdit) {
      // Formatear datetime local ("yyyy-MM-ddThh:mm")
      const formattedDate = new Date(reunionToEdit.fechaHora)
      const offset = formattedDate.getTimezoneOffset() * 60000
      const localISOTime = new Date(formattedDate.getTime() - offset)
        .toISOString()
        .slice(0, 16)

      form.reset({
        profesionalId: reunionToEdit.profesionalId,
        titulo: reunionToEdit.titulo,
        fechaHora: localISOTime,
        modalidad: reunionToEdit.modalidad || '',
        descripcion: reunionToEdit.descripcion || '',
      })
    } else {
      form.reset({
        profesionalId,
        titulo: '',
        fechaHora: '',
        modalidad: '',
        descripcion: '',
      })
    }
  }, [reunionToEdit, isOpen, form, profesionalId])

  const onSubmit = (data: ReunionCreateDto) => {
    const formattedData = {
      ...data,
      profesionalId,
    }

    if (reunionToEdit) {
      updateMutation.mutate(
        { id: reunionToEdit.id, data: formattedData },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } else {
      createMutation.mutate(formattedData, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reunionToEdit ? 'Editar Reunión' : 'Crear Nueva Reunión'}
    >
      <div className={styles.formContainer}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Título de la Reunión</label>
            <input
              type="text"
              placeholder="Ej. Reunión de equipo, Supervisión clínica..."
              {...form.register('titulo')}
              className={styles.input}
            />
            {form.formState.errors.titulo && (
              <span className={styles.error}>
                {form.formState.errors.titulo.message}
              </span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Fecha y Hora</label>
              <input
                type="datetime-local"
                {...form.register('fechaHora')}
                className={styles.input}
              />
              {form.formState.errors.fechaHora && (
                <span className={styles.error}>
                  {form.formState.errors.fechaHora.message}
                </span>
              )}
            </div>
            <div className={styles.field}>
              <label>Modalidad</label>
              <select {...form.register('modalidad')} className={styles.input}>
                <option value="">Seleccione...</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrida">Híbrida</option>
              </select>
              {form.formState.errors.modalidad && (
                <span className={styles.error}>
                  {form.formState.errors.modalidad.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label>Descripción / Notas (Opcional)</label>
            <textarea
              placeholder="Añade temas a tratar o enlaces de la reunión..."
              {...form.register('descripcion')}
              className={styles.textarea}
              rows={4}
            />
            {form.formState.errors.descripcion && (
              <span className={styles.error}>
                {form.formState.errors.descripcion.message}
              </span>
            )}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {reunionToEdit ? 'Guardar Cambios' : 'Agendar Reunión'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
