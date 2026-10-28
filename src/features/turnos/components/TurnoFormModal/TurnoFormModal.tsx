import { useState, useEffect, type ChangeEvent } from 'react'
import { isAxiosError } from 'axios'
import {
  Controller,
  useForm,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Modal } from '@/shared/components/Modal/Modal'
import { Button } from '@/shared/components/Button/Button'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import {
  usePacientesTodos,
  usePacientesVinculados,
} from '@/features/pacientes/hooks/usePacientes'
import { useProfesionales } from '@/features/pacientes/hooks/useProfesionales'
import type { Profesional } from '@/features/pacientes/types/profesional.types'
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

const HORAS = Array.from({ length: 15 }, (_, index) =>
  String(index + 7).padStart(2, '0')
)
const MINUTOS = ['00', '15', '30', '45'] as const

interface TimePickerProps {
  value?: string
  onChange: (val: string) => void
  hasError?: boolean
}

const TimePicker = ({ value = '', onChange, hasError }: TimePickerProps) => {
  const [hh = '', mm = ''] = value ? value.split(':') : []

  const handleHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nuevaHora = e.target.value
    onChange(nuevaHora ? `${nuevaHora}:${mm || '00'}` : '')
  }

  const handleMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nuevoMinuto = e.target.value
    if (!hh) {
      onChange(nuevoMinuto ? `09:${nuevoMinuto}` : '')
      return
    }
    onChange(`${hh}:${nuevoMinuto || '00'}`)
  }

  const inputClass = `${styles.input} ${hasError ? styles.inputError : ''}`

  return (
    <div className={styles.timeFields}>
      <select
        value={hh}
        onChange={handleHourChange}
        className={inputClass}
        aria-label="Hora"
      >
        <option value="">HH</option>
        {HORAS.map((hora) => (
          <option key={hora} value={hora}>
            {hora}
          </option>
        ))}
      </select>
      <select
        value={mm}
        onChange={handleMinuteChange}
        className={inputClass}
        aria-label="Minutos"
      >
        <option value="">MM</option>
        {MINUTOS.map((minuto) => (
          <option key={minuto} value={minuto}>
            {minuto}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ApiErrorBody {
  message?: unknown
  details?: unknown
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

  return fallback
}

interface ProfesionalFieldProps {
  registration: UseFormRegisterReturn<'profesionalId'>
  profesionales: Profesional[]
  isLoading: boolean
  error?: string
}

const ProfesionalField = ({
  registration,
  profesionales,
  isLoading,
  error,
}: ProfesionalFieldProps) => (
  <div className={styles.field}>
    <label htmlFor="turno-profesional">Profesional</label>
    <select
      id="turno-profesional"
      {...registration}
      className={styles.input}
      disabled={isLoading}
    >
      <option value={0}>Seleccione un profesional...</option>
      {profesionales.map((profesional) => (
        <option key={profesional.id} value={profesional.id}>
          {profesional.nombre} {profesional.apellido}
          {profesional.matricula ? ` (${profesional.matricula})` : ''}
        </option>
      ))}
    </select>
    {isLoading && (
      <span className={styles.hint}>Cargando profesionales...</span>
    )}
    {!isLoading && profesionales.length === 0 && (
      <span className={styles.hint}>
        No hay profesionales disponibles. Creá uno desde la sección
        Profesionales.
      </span>
    )}
    {error && <span className={styles.error}>{error}</span>}
  </div>
)

interface TurnoFormModalProps {
  isOpen: boolean
  onClose: () => void
  defaultFecha?: Date
  initialTab?: TabType
}

type TabType = 'suelto' | 'fijo'

export const TurnoFormModal = ({
  isOpen,
  onClose,
  defaultFecha,
  initialTab = 'fijo',
}: TurnoFormModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [apiError, setApiError] = useState<string | null>(null)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setActiveTab(initialTab)
      setApiError(null)
    }
  }

  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN
  const profesionalId = user?.id ? parseInt(user.id) : 0
  const profesionalIdPorDefecto = isAdmin ? 0 : profesionalId
  const fechaKey = format(defaultFecha || new Date(), 'yyyy-MM-dd')

  const { profesionales, isLoadingProfesionales } = useProfesionales()
  const profesionalesDisponibles = (profesionales ?? [])
    .filter((profesional) => profesional.id !== profesionalId)
    .sort((a, b) =>
      `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`)
    )
  const sinProfesionalesDisponibles =
    isAdmin && (isLoadingProfesionales || profesionalesDisponibles.length === 0)

  const { data: pacientesVinculadosData } = usePacientesVinculados(
    { page: 1, pageSize: 100 },
    !isAdmin
  )
  const { data: pacientesTodosData } = usePacientesTodos(
    { page: 1, pageSize: 100 },
    isAdmin
  )
  const pacientes = isAdmin
    ? pacientesTodosData?.items
    : pacientesVinculadosData?.items

  const createSueltoMutation = useCreateTurnoSuelto()
  const createFijoMutation = useCreateTurnoFijo()

  const getValoresDefaultSuelto = (fecha?: Date): CrearTurnoFormDto => ({
    profesionalId: profesionalIdPorDefecto,
    pacienteId: '' as unknown as number,
    fecha: format(fecha || new Date(), 'yyyy-MM-dd'),
    hora: '',
    duracionMin: 60,
  })

  const getValoresDefaultFijo = (fecha?: Date): CrearTurnoFijoDto => {
    const d = fecha || new Date()
    return {
      profesionalId: profesionalIdPorDefecto,
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
  }, [isOpen, fechaKey, profesionalId, isAdmin])

  const handleClose = () => {
    setApiError(null)
    onClose()
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setApiError(null)
  }

  const onSubmitSuelto = (data: CrearTurnoFormDto) => {
    setApiError(null)
    const profesionalSeleccionado = isAdmin
      ? Number(data.profesionalId)
      : profesionalId

    const formattedData: CrearTurnoDto = {
      pacienteId: Number(data.pacienteId),
      profesionalId: profesionalSeleccionado,
      fechaHora: `${data.fecha}T${data.hora}:00`,
      duracionMin: Number(data.duracionMin),
    }

    createSueltoMutation.mutate(formattedData, {
      onSuccess: () => {
        formSuelto.reset(getValoresDefaultSuelto(defaultFecha))
        handleClose()
      },
      onError: (error) => {
        setApiError(
          getApiErrorMessage(
            error,
            'No se pudo crear el turno. Intentá nuevamente.'
          )
        )
      },
    })
  }

  const onSubmitFijo = (data: CrearTurnoFijoDto) => {
    setApiError(null)
    const profesionalSeleccionado = isAdmin
      ? Number(data.profesionalId)
      : profesionalId

    const formattedData: CrearTurnoFijoDto = {
      ...data,
      pacienteId: Number(data.pacienteId),
      profesionalId: profesionalSeleccionado,
      diaSemana: Number(data.diaSemana),
      duracionMin: Number(data.duracionMin),
      fechaFin: data.fechaFin || undefined,
    }

    createFijoMutation.mutate(formattedData, {
      onSuccess: () => {
        formFijo.reset(getValoresDefaultFijo(defaultFecha))
        handleClose()
      },
      onError: (error) => {
        setApiError(
          getApiErrorMessage(
            error,
            'No se pudo crear el turno fijo. Intentá nuevamente.'
          )
        )
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Turno">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'suelto' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('suelto')}
        >
          Turno Único
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'fijo' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('fijo')}
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
            {isAdmin && (
              <ProfesionalField
                registration={formSuelto.register('profesionalId', {
                  valueAsNumber: true,
                })}
                profesionales={profesionalesDisponibles}
                isLoading={isLoadingProfesionales}
                error={formSuelto.formState.errors.profesionalId?.message}
              />
            )}

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
              {isAdmin && (
                <span className={styles.hint}>
                  El paciente debe estar vinculado al profesional seleccionado.
                </span>
              )}
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

            {apiError && <p className={styles.apiError}>{apiError}</p>}

            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={createSueltoMutation.isPending}
                disabled={sinProfesionalesDisponibles}
              >
                Crear Turno
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={formFijo.handleSubmit(onSubmitFijo)}
            className={styles.form}
          >
            {isAdmin && (
              <ProfesionalField
                registration={formFijo.register('profesionalId', {
                  valueAsNumber: true,
                })}
                profesionales={profesionalesDisponibles}
                isLoading={isLoadingProfesionales}
                error={formFijo.formState.errors.profesionalId?.message}
              />
            )}

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
              {isAdmin && (
                <span className={styles.hint}>
                  El paciente debe estar vinculado al profesional seleccionado.
                </span>
              )}
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

            {apiError && <p className={styles.apiError}>{apiError}</p>}

            <div className={styles.actions}>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={createFijoMutation.isPending}
                disabled={sinProfesionalesDisponibles}
              >
                Crear Turno Fijo
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
