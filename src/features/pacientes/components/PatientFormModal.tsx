import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  pacienteSchema,
  type PacienteFormData,
} from '../schemas/paciente.schema'
import type { Paciente } from '../types/paciente.types'
import styles from './PatientFormModal.module.css'
import { X, Trash2, Plus } from 'lucide-react'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '../hooks/usePacientes'
import { useProfesionales } from '../hooks/useProfesionales'

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
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  const { profesionalesVinculados } = usePacientes(paciente?.id)
  const { profesionales, vincularPaciente, desvincularPaciente } =
    useProfesionales()
  const [selectedProfToLink, setSelectedProfToLink] = useState<number | ''>('')

  const handleLinkProf = () => {
    if (selectedProfToLink && paciente) {
      vincularPaciente({
        id: Number(selectedProfToLink),
        pacienteId: paciente.id,
      })
      setSelectedProfToLink('')
    }
  }

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

          {isAdmin && paciente && (
            <div
              style={{
                marginTop: '30px',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '15px',
                  color: '#374151',
                }}
              >
                Profesionales Asociados
              </h3>

              <div
                style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}
              >
                <select
                  value={selectedProfToLink}
                  onChange={(e) =>
                    setSelectedProfToLink(Number(e.target.value) || '')
                  }
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                  }}
                >
                  <option value="">
                    Seleccione un profesional para vincular...
                  </option>
                  {profesionales
                    ?.filter(
                      (p) =>
                        !profesionalesVinculados?.some((pv) => pv.id === p.id)
                    )
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} {p.apellido} (
                        {p.matricula || 'Sin matrícula'})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleLinkProf}
                  disabled={!selectedProfToLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: selectedProfToLink ? 'pointer' : 'not-allowed',
                    opacity: selectedProfToLink ? 1 : 0.5,
                  }}
                >
                  <Plus size={16} /> Vincular
                </button>
              </div>

              {profesionalesVinculados && profesionalesVinculados.length > 0 ? (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {profesionalesVinculados.map((p) => (
                    <li
                      key={p.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <span>
                        {p.nombre} {p.apellido}{' '}
                        <span
                          style={{ color: '#6b7280', fontSize: '0.875rem' }}
                        >
                          - {p.matricula || p.email}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          desvincularPaciente({
                            id: p.id,
                            pacienteId: paciente.id,
                          })
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px',
                        }}
                        title="Desvincular"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  No hay profesionales vinculados a este paciente.
                </p>
              )}
            </div>
          )}

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
