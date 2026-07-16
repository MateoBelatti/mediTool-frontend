import { z } from 'zod'

export enum EstadoTurno {
  Pendiente = 0,
  Completado = 1,
  Cancelado = 2,
  Reprogramado = 3,
  Ausente = 4,
}

export const CrearTurnoSchema = z.object({
  turnoFijoId: z.number().optional(),
  pacienteId: z.number({ required_error: 'El paciente es requerido' }),
  profesionalId: z.number({ required_error: 'El profesional es requerido' }),
  fechaHora: z.string({ required_error: 'La fecha y hora son requeridas' }),
  duracionMin: z
    .number({ required_error: 'La duración es requerida' })
    .min(1, 'La duración debe ser mayor a 0'),
  estado: z.nativeEnum(EstadoTurno).optional(),
})

export const TurnoSchema = z.object({
  id: z.number(),
  turnoFijoId: z.number().nullable().optional(),
  pacienteId: z.number(),
  profesionalId: z.number(),
  fechaHora: z.string(),
  duracionMin: z.number(),
  estado: z.string(),
})

export type CrearTurnoDto = z.infer<typeof CrearTurnoSchema>
export type Turno = z.infer<typeof TurnoSchema>
