import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { EditarTurnoFijoSchema, type EditarTurnoFijoDto, type TurnoFijo } from '@/features/turnos-fijos/schemas/turnos-fijos.schema'
import { useUpdateTurnoFijo } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import styles from '@/features/turnos/components/TurnoFormModal/TurnoFormModal.module.css'

interface EditTurnoFijoModalProps {
  turnoFijo: TurnoFijo
  isOpen: boolean
  onClose: () => void
}

const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
]

export const EditTurnoFijoModal = ({ turnoFijo, isOpen, onClose }: EditTurnoFijoModalProps) => {
  const { mutate: updateTurnoFijo, isPending } = useUpdateTurnoFijo()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditarTurnoFijoDto>({
    resolver: zodResolver(EditarTurnoFijoSchema),
    defaultValues: {
      diaSemana: turnoFijo.diaSemana,
      hora: turnoFijo.hora,
      duracionMin: turnoFijo.duracionMin,
      activo: turnoFijo.activo,
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      reset({
        diaSemana: turnoFijo.diaSemana,
        hora: turnoFijo.hora,
        duracionMin: turnoFijo.duracionMin,
        activo: turnoFijo.activo,
      })
    }
  }, [isOpen, turnoFijo, reset])

  const onSubmit = (data: EditarTurnoFijoDto) => {
    updateTurnoFijo(
      { id: turnoFijo.id, data },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Regla de Turno Fijo">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Día de la semana</label>
          <select {...register('diaSemana', { valueAsNumber: true })} className={styles.input}>
            {DIAS_SEMANA.map((dia) => (
              <option key={dia.value} value={dia.value}>
                {dia.label}
              </option>
            ))}
          </select>
          {errors.diaSemana && <span className={styles.error}>{errors.diaSemana.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Hora</label>
          <input type="time" {...register('hora')} className={styles.input} />
          {errors.hora && <span className={styles.error}>{errors.hora.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Duración (minutos)</label>
          <input
            type="number"
            {...register('duracionMin', { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.duracionMin && (
            <span className={styles.error}>{errors.duracionMin.message}</span>
          )}
        </div>

        <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" id="activo" {...register('activo')} style={{ width: 'auto' }} />
          <label htmlFor="activo" className={styles.label} style={{ marginBottom: 0 }}>Regla Activa</label>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
