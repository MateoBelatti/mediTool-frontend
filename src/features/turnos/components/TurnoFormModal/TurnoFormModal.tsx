import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientesVinculados } from '@/features/pacientes/hooks/usePacientes'
import {
  CrearTurnoFormSchema,
  type CrearTurnoFormDto,
  type CrearTurnoDto,
} from '../../schemas/turnos.schema'
import {
  CrearTurnoFijoSchema,
  type CrearTurnoFijoDto,
} from '@/features/turnos-fijos/schemas/turnos-fijos.schema'
import { useCreateTurnoSuelto } from '../../hooks/useTurnos'
import { useCreateTurnoFijo } from '@/features/turnos-fijos/hooks/useTurnosFijos'
import styles from './TurnoFormModal.module.css'

const HORA_INICIO = '07'
const HORA_FIN = '21'
const MINUTOS = ['00', '15', '30', '45'] as const

const generarOpcionesHoras = (inicio: string, fin: string): string[] => {
  const start = parseInt(inicio, 10)
  const end = parseInt(fin, 10)
  const horas: string[] = []
  for (let h = start; h <= end; h++) {
    horas.push(String(h).padStart(2, '0'))
  }
  return horas
}

const OPCIONES_HORAS = generarOpcionesHoras(HORA_INICIO, HORA_FIN)

interface TimePickerProps {
  value?: string
  onChange: (val: string) => void
  hasError?: boolean
}

const TimePicker = ({ value = '', onChange, hasError }: TimePickerProps) => {
  const [hh, mm] = value && value.includes(':') ? value.split(':') : ['', '']

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = e.target.value
    if (!newHour) {
      onChange('')
    } else {
      onChange(`${newHour}:${mm || '00'}`)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = e.target.value
    if (!newMinute) {
      if (hh) onChange(`${hh}:00`)
      else onChange('')
    } else {
      onChange(`${hh || '09'}:${newMinute}`)
    }
  }

  return (
    <div
      className={`${styles.timePicker} ${hasError ? styles.inputError : ''}`}
    >
      <select
        value={hh}
        onChange={handleHourChange}
        className={styles.timeSelect}
        aria-label="Hora"
      >
        <option value="">HH</option>
        {OPCIONES_HORAS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className={styles.timeSeparator}>:</span>
      <select
        value={mm}
        onChange={handleMinuteChange}
        className={styles.timeSelect}
        aria-label="Minutos"
      >
        <option value="">MM</option>
        {MINUTOS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  )
}

interface TurnoFormModalProps {
  isOpen: boolean
  onClose: () => void
  defaultFecha?: Date
}

type TabType = 'suelto' | 'fijo'

export const TurnoFormModal = ({
  isOpen,
  onClose,
  defaultFecha,
}: TurnoFormModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('suelto')
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : 0
  const { data: pacientesVinculadosData } = usePacientesVinculados({
    page: 1,
    pageSize: 100,
  })
  const pacientes = pacientesVinculadosData?.items

  const createSueltoMutation = useCreateTurnoSuelto()
  const createFijoMutation = useCreateTurnoFijo()

  const getValoresDefaultSuelto = (fecha?: Date): CrearTurnoFormDto => ({
    profesionalId,
    pacienteId: '' as unknown as number,
    fecha: format(fecha || new Date(), 'yyyy-MM-dd'),
    hora: '',
    duracionMin: 60,
  })

  const getValoresDefaultFijo = (fecha?: Date): CrearTurnoFijoDto => {
    const d = fecha || new Date()
    return {
      profesionalId,
      pacienteId: '' as unknown as number,
      fechaInicio: format(d, 'yyyy-MM-dd'),
      fechaFin: '',
      diaSemana: d.getDay(),
      hora: '',
      duracionMin: 60,
      activo: true,
    }
  }

  const formSuelto = useForm<CrearTurnoFormDto>({
    resolver: zodResolver(CrearTurnoFormSchema),
    defaultValues: getValoresDefaultSuelto(defaultFecha),
  })

  const formFijo = useForm<CrearTurnoFijoDto>({
    resolver: zodResolver(CrearTurnoFijoSchema),
    defaultValues: getValoresDefaultFijo(defaultFecha),
  })

  useEffect(() => {
    if (isOpen) {
      formSuelto.reset(getValoresDefaultSuelto(defaultFecha))
      formFijo.reset(getValoresDefaultFijo(defaultFecha))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, defaultFecha, profesionalId])

  const onSubmitSuelto = (data: CrearTurnoFormDto) => {
    const formattedData: CrearTurnoDto = {
      pacienteId: Number(data.pacienteId),
      profesionalId,
      fechaHora: `${data.fecha}T${data.hora}:00`,
      duracionMin: Number(data.duracionMin),
    }

    createSueltoMutation.mutate(formattedData, {
      onSuccess: () => {
        formSuelto.reset(getValoresDefaultSuelto(defaultFecha))
        onClose()
      },
    })
  }

  const onSubmitFijo = (data: CrearTurnoFijoDto) => {
    const formattedData: CrearTurnoFijoDto = {
      ...data,
      pacienteId: Number(data.pacienteId),
      profesionalId,
      diaSemana: Number(data.diaSemana),
      duracionMin: Number(data.duracionMin),
      fechaFin: data.fechaFin || undefined,
    }

    createFijoMutation.mutate(formattedData, {
      onSuccess: () => {
        formFijo.reset(getValoresDefaultFijo(defaultFecha))
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

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Fecha</label>
                <input
                  type="date"
                  {...formSuelto.register('fecha')}
                  className={styles.input}
                />
                {formSuelto.formState.errors.fecha && (
                  <span className={styles.error}>
                    {formSuelto.formState.errors.fecha.message}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label>Hora</label>
                <Controller
                  control={formSuelto.control}
                  name="hora"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      hasError={!!formSuelto.formState.errors.hora}
                    />
                  )}
                />
                {formSuelto.formState.errors.hora && (
                  <span className={styles.error}>
                    {formSuelto.formState.errors.hora.message}
                  </span>
                )}
              </div>
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
                {formFijo.formState.errors.diaSemana && (
                  <span className={styles.error}>
                    {formFijo.formState.errors.diaSemana.message}
                  </span>
                )}
              </div>
              <div className={styles.field}>
                <label>Hora</label>
                <Controller
                  control={formFijo.control}
                  name="hora"
                  render={({ field }) => (
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      hasError={!!formFijo.formState.errors.hora}
                    />
                  )}
                />
                {formFijo.formState.errors.hora && (
                  <span className={styles.error}>
                    {formFijo.formState.errors.hora.message}
                  </span>
                )}
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
                {formFijo.formState.errors.fechaInicio && (
                  <span className={styles.error}>
                    {formFijo.formState.errors.fechaInicio.message}
                  </span>
                )}
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
              {formFijo.formState.errors.duracionMin && (
                <span className={styles.error}>
                  {formFijo.formState.errors.duracionMin.message}
                </span>
              )}
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={createFijoMutation.isPending}>
                Crear Turno Fijo
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
