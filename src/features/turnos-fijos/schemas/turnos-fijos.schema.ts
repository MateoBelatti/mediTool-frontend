import { z } from 'zod'

export const CrearTurnoFijoSchema = z.object({
  pacienteId: z
    .number({ message: 'El paciente es requerido' })
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'El paciente es requerido',
    }),
  profesionalId: z.number(),
  diaSemana: z
    .number()
    .min(0, 'Día de la semana inválido')
    .max(6, 'Día de la semana inválido'),
  hora: z
    .string({ message: 'La hora es requerida' })
    .min(1, 'La hora es requerida')
    .regex(/^\d{2}:\d{2}$/, 'La hora es requerida'),
  duracionMin: z
    .number({ message: 'La duración es requerida' })
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'La duración debe ser mayor a 0',
    }),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().optional(),
  activo: z.boolean().optional(),
  horizonteMeses: z.number().optional(),
})

export const EditarTurnoFijoSchema = z.object({
  diaSemana: z.number().min(0).max(6),
  hora: z.string(),
  duracionMin: z.number().min(1),
  fechaFin: z.string().optional(),
  activo: z.boolean(),
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
