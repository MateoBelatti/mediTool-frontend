import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import {
  InformeCreateSchema,
  type InformeCreateDto,
} from '../../schemas/informes.schema'
import { useCreateInforme, useUpdateInforme } from '../../hooks/useInformes'
import type { InformeWithPaciente } from '../InformesGrid/InformesGrid'
import styles from './InformeFormModal.module.css'

interface InformeFormModalProps {
  isOpen: boolean
  onClose: () => void
  informeToEdit?: InformeWithPaciente | null
}

export const InformeFormModal = ({
  isOpen,
  onClose,
  informeToEdit,
}: InformeFormModalProps) => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0
  const { pacientes } = usePacientes()

  const createMutation = useCreateInforme()
  const updateMutation = useUpdateInforme()

  const form = useForm<InformeCreateDto>({
    resolver: zodResolver(InformeCreateSchema),
    defaultValues: {
      profesionalId,
      fecha: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      tipo: '',
      contenido: '',
      estado: 'Pendiente',
    },
  })

  useEffect(() => {
    if (informeToEdit) {
      form.reset({
        pacienteId: informeToEdit.pacienteId || undefined,
        profesionalId: informeToEdit.profesionalId,
        fecha: informeToEdit.fecha.split('T')[0],
        tipo: informeToEdit.tipo || '',
        contenido: informeToEdit.contenido || '',
        estado: informeToEdit.estado || 'Pendiente',
      })
    } else {
      form.reset({
        profesionalId,
        fecha: new Date().toISOString().split('T')[0],
        tipo: '',
        contenido: '',
        estado: 'Pendiente',
      })
    }
  }, [informeToEdit, isOpen, form, profesionalId])

  const onSubmit = (data: InformeCreateDto) => {
    const formattedData = {
      ...data,
      pacienteId: data.pacienteId ? Number(data.pacienteId) : undefined,
      profesionalId,
    }

    if (informeToEdit) {
      updateMutation.mutate(
        { id: informeToEdit.id, data: formattedData },
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
      title={informeToEdit ? 'Editar Informe' : 'Crear Nuevo Informe'}
    >
      <div className={styles.formContainer}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Paciente (Opcional)</label>
            <select
              {...form.register('pacienteId', { valueAsNumber: true })}
              className={styles.input}
            >
              <option value="">Seleccione un paciente...</option>
              {pacientes?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido} {p.dni && `(${p.dni})`}
                </option>
              ))}
            </select>
            {form.formState.errors.pacienteId && (
              <span className={styles.error}>
                {form.formState.errors.pacienteId.message}
              </span>
            )}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Fecha</label>
              <input
                type="date"
                {...form.register('fecha')}
                className={styles.input}
              />
              {form.formState.errors.fecha && (
                <span className={styles.error}>
                  {form.formState.errors.fecha.message}
                </span>
              )}
            </div>
            <div className={styles.field}>
              <label>Estado</label>
              <select {...form.register('estado')} className={styles.input}>
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label>Tipo de Informe</label>
            <input
              type="text"
              placeholder="Ej. Evaluación inicial, Seguimiento..."
              {...form.register('tipo')}
              className={styles.input}
            />
            {form.formState.errors.tipo && (
              <span className={styles.error}>
                {form.formState.errors.tipo.message}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label>Contenido</label>
            <textarea
              placeholder="Escribe el contenido del informe aquí..."
              {...form.register('contenido')}
              className={styles.textarea}
              rows={6}
            />
            {form.formState.errors.contenido && (
              <span className={styles.error}>
                {form.formState.errors.contenido.message}
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
              {informeToEdit ? 'Guardar Cambios' : 'Crear Informe'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
