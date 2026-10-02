import { z } from 'zod'
import { EstadoTurno } from '../types/turnos.types'

export const CrearTurnoSchema = z.object({
  turnoFijoId: z.number().optional(),
  pacienteId: z.number(),
  profesionalId: z.number(),
  fechaHora: z.string(),
  duracionMin: z.number().min(1, 'La duración debe ser mayor a 0'),
  estado: z.nativeEnum(EstadoTurno).optional(),
})

export const TurnoSchema = z.object({
  id: z.number(),
  turnoFijoId: z.number().nullable().optional(),
  pacienteId: z.number(),
  profesionalId: z.number(),
  fechaHora: z.string(),
  duracionMin: z.number(),
  estado: z.nativeEnum(EstadoTurno),
  justificada: z.boolean().optional(),
  facturable: z.boolean().optional(),
  fechaRegistro: z.string().optional(),
  fechaRegistroAsistencia: z.string().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  paciente: z.any().optional(), // Using any/optional for now for simplicity, ideally define PacienteResumenDto
  profesional: z.any().optional(),
})

export type CrearTurnoDto = z.infer<typeof CrearTurnoSchema>
export type Turno = z.infer<typeof TurnoSchema>
