import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import {
  profesionalCreateSchema,
  type ProfesionalFormData,
} from '../../schemas/profesional.schema'
import styles from './ProfesionalFormModal.module.css'

interface ProfesionalFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProfesionalFormData) => void
  isSubmitting?: boolean
  apiError?: string | null
}

const getEmptyFormValues = (): ProfesionalFormData => ({
  nombre: '',
  apellido: '',
  prestacion: '',
  matricula: '',
  email: '',
  telefono: '',
  registroPrestadores: '',
  password: '',
})

export const ProfesionalFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  apiError,
}: ProfesionalFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfesionalFormData>({
    resolver: zodResolver(profesionalCreateSchema),
    defaultValues: getEmptyFormValues(),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getEmptyFormValues())
    }
  }, [isOpen, reset])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo profesional">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        noValidate
      >
        {apiError && (
          <p className={styles.apiError} role="alert">
            {apiError}
          </p>
        )}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="profesional-nombre">Nombre *</label>
            <input
              id="profesional-nombre"
              type="text"
              placeholder="Ej. Ana"
              className={styles.input}
              {...register('nombre')}
            />
            {errors.nombre && (
              <span className={styles.error}>{errors.nombre.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-apellido">Apellido *</label>
            <input
              id="profesional-apellido"
              type="text"
              placeholder="Ej. Gómez"
              className={styles.input}
              {...register('apellido')}
            />
            {errors.apellido && (
              <span className={styles.error}>{errors.apellido.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-email">Email</label>
            <input
              id="profesional-email"
              type="email"
              placeholder="Ej. ana@correo.com"
              className={styles.input}
              {...register('email')}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-telefono">Teléfono</label>
            <input
              id="profesional-telefono"
              type="tel"
              placeholder="Ej. +54 9 11 1234-5678"
              className={styles.input}
              {...register('telefono')}
            />
            {errors.telefono && (
              <span className={styles.error}>{errors.telefono.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-matricula">Matrícula</label>
            <input
              id="profesional-matricula"
              type="text"
              placeholder="Ej. MP 12345"
              className={styles.input}
              {...register('matricula')}
            />
            {errors.matricula && (
              <span className={styles.error}>{errors.matricula.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-prestacion">Prestación</label>
            <input
              id="profesional-prestacion"
              type="text"
              placeholder="Ej. Kinesiología"
              className={styles.input}
              {...register('prestacion')}
            />
            {errors.prestacion && (
              <span className={styles.error}>{errors.prestacion.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-registro">
              Registro de prestadores
            </label>
            <input
              id="profesional-registro"
              type="text"
              placeholder="Ej. 123456"
              className={styles.input}
              {...register('registroPrestadores')}
            />
            {errors.registroPrestadores && (
              <span className={styles.error}>
                {errors.registroPrestadores.message}
              </span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="profesional-password">Contraseña *</label>
            <input
              id="profesional-password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              className={styles.input}
              {...register('password')}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password.message}</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Crear profesional
          </Button>
        </div>
      </form>
    </Modal>
  )
}
