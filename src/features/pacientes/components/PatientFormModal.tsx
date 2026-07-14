import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pacienteSchema,
  type PacienteFormData,
} from '../schemas/paciente.schema'
import type { Paciente } from '../types/paciente.types'
import styles from './PatientFormModal.module.css'
import { X } from 'lucide-react'

interface PatientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PacienteFormData) => void
  paciente?: Paciente | null
  isSubmitting?: boolean
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  paciente,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      dni: '',
      direccion: '',
      telefono: '',
      email: '',
      obraSocial: '',
      nroAfiliado: '',
    },
  })

  useEffect(() => {
    if (paciente && isOpen) {
      reset({
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        fechaNacimiento: paciente.fechaNacimiento || '',
        dni: paciente.dni || '',
        direccion: paciente.direccion || '',
        telefono: paciente.telefono || '',
        email: paciente.email || '',
        obraSocial: paciente.obraSocial || '',
        nroAfiliado: paciente.nroAfiliado || '',
      })
    } else if (isOpen && !paciente) {
      reset({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        dni: '',
        direccion: '',
        telefono: '',
        email: '',
        obraSocial: '',
        nroAfiliado: '',
      })
    }
  }, [paciente, isOpen, reset])

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{paciente ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre *</label>
              <input
                type="text"
                {...register('nombre')}
                placeholder="Ej. Juan"
              />
              {errors.nombre && (
                <span className={styles.error}>{errors.nombre.message}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Apellido *</label>
              <input
                type="text"
                {...register('apellido')}
                placeholder="Ej. Pérez"
              />
              {errors.apellido && (
                <span className={styles.error}>{errors.apellido.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>DNI</label>
              <input
                type="text"
                {...register('dni')}
                placeholder="Ej. 12345678"
              />
              {errors.dni && (
                <span className={styles.error}>{errors.dni.message}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Fecha de Nacimiento</label>
              <input type="date" {...register('fechaNacimiento')} />
              {errors.fechaNacimiento && (
                <span className={styles.error}>
                  {errors.fechaNacimiento.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                {...register('telefono')}
                placeholder="Ej. +54 9 11 1234-5678"
              />
              {errors.telefono && (
                <span className={styles.error}>{errors.telefono.message}</span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="Ej. juan@correo.com"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email.message}</span>
              )}
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Dirección</label>
              <input
                type="text"
                {...register('direccion')}
                placeholder="Ej. Av. Siempre Viva 123"
              />
              {errors.direccion && (
                <span className={styles.error}>{errors.direccion.message}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Obra Social</label>
              <input
                type="text"
                {...register('obraSocial')}
                placeholder="Ej. OSDE"
              />
              {errors.obraSocial && (
                <span className={styles.error}>
                  {errors.obraSocial.message}
                </span>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Nro. Afiliado</label>
              <input
                type="text"
                {...register('nroAfiliado')}
                placeholder="Ej. 123456789"
              />
              {errors.nroAfiliado && (
                <span className={styles.error}>
                  {errors.nroAfiliado.message}
                </span>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
