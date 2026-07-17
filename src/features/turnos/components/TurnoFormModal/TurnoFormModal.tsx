import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import {
  CrearTurnoSchema,
  type CrearTurnoDto,
} from '../../schemas/turnos.schema'
import {
  CrearTurnoFijoSchema,
  type CrearTurnoFijoDto,
} from '@/features/turnos-fijos/schemas/turnos-fijos.schema'
import { useCreateTurnoSuelto } from '../../hooks/useTurnos'
import { useCreateTurnoFijo } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import styles from './TurnoFormModal.module.css'

interface TurnoFormModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'suelto' | 'fijo'

export const TurnoFormModal = ({ isOpen, onClose }: TurnoFormModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('suelto')
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0
  const { pacientes } = usePacientes()

  const createSueltoMutation = useCreateTurnoSuelto()
  const createFijoMutation = useCreateTurnoFijo()

  const formSuelto = useForm<CrearTurnoDto>({
    resolver: zodResolver(CrearTurnoSchema),
    defaultValues: {
      profesionalId,
      duracionMin: 30,
    },
  })

  const formFijo = useForm<CrearTurnoFijoDto>({
    resolver: zodResolver(CrearTurnoFijoSchema),
    defaultValues: {
      profesionalId,
      duracionMin: 30,
      activo: true,
      diaSemana: 1, // Lunes
    },
  })

  const onSubmitSuelto = (data: CrearTurnoDto) => {
    // Check missing fields correctly formatted
    const formattedData = {
      ...data,
      pacienteId: Number(data.pacienteId),
      profesionalId,
      duracionMin: Number(data.duracionMin),
    }

    createSueltoMutation.mutate(formattedData, {
      onSuccess: () => {
        formSuelto.reset()
        onClose()
      },
    })
  }

  const onSubmitFijo = (data: CrearTurnoFijoDto) => {
    const formattedData = {
      ...data,
      pacienteId: Number(data.pacienteId),
      profesionalId,
      diaSemana: Number(data.diaSemana),
      duracionMin: Number(data.duracionMin),
    }

    createFijoMutation.mutate(formattedData, {
      onSuccess: () => {
        formFijo.reset()
        onClose()
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Turno">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'suelto' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('suelto')}
        >
          Turno Único
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fijo' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('fijo')}
        >
          Turno Fijo (Recurrente)
        </button>
      </div>

      <div className={styles.formContainer}>
        {activeTab === 'suelto' ? (
          <form
            onSubmit={formSuelto.handleSubmit(onSubmitSuelto)}
            className={styles.form}
          >
            <div className={styles.field}>
              <label>Paciente</label>
              <select
                {...formSuelto.register('pacienteId', { valueAsNumber: true })}
                className={styles.input}
              >
                <option value="">Seleccione un paciente...</option>
                {pacientes?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} {p.dni && `(${p.dni})`}
                  </option>
                ))}
              </select>
              {formSuelto.formState.errors.pacienteId && (
                <span className={styles.error}>
                  {formSuelto.formState.errors.pacienteId.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Fecha y Hora</label>
              <input
                type="datetime-local"
                {...formSuelto.register('fechaHora')}
                className={styles.input}
              />
              {formSuelto.formState.errors.fechaHora && (
                <span className={styles.error}>
                  {formSuelto.formState.errors.fechaHora.message}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <label>Duración (minutos)</label>
              <input
                type="number"
                {...formSuelto.register('duracionMin', { valueAsNumber: true })}
                className={styles.input}
              />
              {formSuelto.formState.errors.duracionMin && (
                <span className={styles.error}>
                  {formSuelto.formState.errors.duracionMin.message}
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={createSueltoMutation.isPending}>
                Crear Turno
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={formFijo.handleSubmit(onSubmitFijo)}
            className={styles.form}
          >
            <div className={styles.field}>
              <label>Paciente</label>
              <select
                {...formFijo.register('pacienteId', { valueAsNumber: true })}
                className={styles.input}
              >
                <option value="">Seleccione un paciente...</option>
                {pacientes?.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} {p.dni && `(${p.dni})`}
                  </option>
                ))}
              </select>
              {formFijo.formState.errors.pacienteId && (
                <span className={styles.error}>
                  {formFijo.formState.errors.pacienteId.message}
                </span>
              )}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Día de la Semana</label>
                <select
                  {...formFijo.register('diaSemana', { valueAsNumber: true })}
                  className={styles.input}
                >
                  <option value={0}>Domingo</option>
                  <option value={1}>Lunes</option>
                  <option value={2}>Martes</option>
                  <option value={3}>Miércoles</option>
                  <option value={4}>Jueves</option>
                  <option value={5}>Viernes</option>
                  <option value={6}>Sábado</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Hora</label>
                <input
                  type="time"
                  {...formFijo.register('hora')}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Fecha de Inicio</label>
                <input
                  type="date"
                  {...formFijo.register('fechaInicio')}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Fecha de Fin (Opcional)</label>
                <input
                  type="date"
                  {...formFijo.register('fechaFin')}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Duración (minutos)</label>
              <input
                type="number"
                {...formFijo.register('duracionMin', { valueAsNumber: true })}
                className={styles.input}
              />
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              {/* @ts-expect-error - value is generic but correctly typed by field.name */}
              <Button type="submit" isLoading={formFijo.formState.isSubmitting}>
                Crear Turno Fijo
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
