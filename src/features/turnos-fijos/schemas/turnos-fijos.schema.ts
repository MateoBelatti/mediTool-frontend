import { z } from 'zod'

export const CrearTurnoFijoSchema = z.object({
  pacienteId: z.number({ required_error: 'El paciente es requerido' }),
  profesionalId: z.number({ required_error: 'El profesional es requerido' }),
  diaSemana: z
    .number({ required_error: 'El día de la semana es requerido' })
    .min(0)
    .max(6),
  hora: z.string({ required_error: 'La hora es requerida' }),
  duracionMin: z.number({ required_error: 'La duración es requerida' }).min(1),
  fechaInicio: z.string({ required_error: 'La fecha de inicio es requerida' }),
  fechaFin: z.string().optional(),
  activo: z.boolean().optional(),
})

export const EditarTurnoFijoSchema = z.object({
  diaSemana: z
    .number({ required_error: 'El día de la semana es requerido' })
    .min(0)
    .max(6),
  hora: z.string({ required_error: 'La hora es requerida' }),
  duracionMin: z.number({ required_error: 'La duración es requerida' }).min(1),
  fechaFin: z.string().optional(),
  activo: z.boolean({ required_error: 'El estado activo es requerido' }),
})

export const TurnoFijoSchema = z.object({
  id: z.number(),
  pacienteId: z.number(),
  profesionalId: z.number(),
  diaSemana: z.number(),
  hora: z.string(),
  duracionMin: z.number(),
  fechaInicio: z.string(),
  fechaFin: z.string().nullable().optional(),
  activo: z.boolean(),
})

export type CrearTurnoFijoDto = z.infer<typeof CrearTurnoFijoSchema>
export type EditarTurnoFijoDto = z.infer<typeof EditarTurnoFijoSchema>
export type TurnoFijo = z.infer<typeof TurnoFijoSchema>
