import { z } from 'zod'

export const CrearTurnoFijoSchema = z.object({
  pacienteId: z.number(),
  profesionalId: z.number(),
  diaSemana: z.number().min(0).max(6),
  hora: z.string(),
  duracionMin: z.number().min(1),
  fechaInicio: z.string(),
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
