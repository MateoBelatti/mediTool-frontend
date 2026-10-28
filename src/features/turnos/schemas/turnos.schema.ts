import { z } from 'zod'
import { EstadoTurno } from '../types/turnos.types'

export const CrearTurnoFormSchema = z.object({
  pacienteId: z
    .number({ message: 'El paciente es requerido' })
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'El paciente es requerido',
    }),
  profesionalId: z
    .number()
    .int('El profesional es requerido')
    .positive('El profesional es requerido'),
  fecha: z.string().min(1, 'La fecha es requerida'),
  hora: z
    .string({ message: 'La hora es requerida' })
    .min(1, 'La hora es requerida')
    .regex(/^\d{2}:\d{2}$/, 'La hora es requerida'),
  duracionMin: z
    .number({ message: 'La duración es requerida' })
    .refine((val) => !isNaN(val) && val > 0, {
      message: 'La duración debe ser mayor a 0',
    }),
})

export type CrearTurnoFormDto = z.infer<typeof CrearTurnoFormSchema>

export const CrearTurnoSchema = z.object({
  turnoFijoId: z.number().optional(),
  pacienteId: z.number(),
  profesionalId: z.number(),
  fechaHora: z.string().min(1, 'La fecha y hora son requeridas'),
  duracionMin: z.number().min(1, 'La duración debe ser mayor a 0'),
  estado: z.nativeEnum(EstadoTurno).optional(),
})

export const PacienteBasicoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
  dni: z.string().optional(),
})

export const ProfesionalBasicoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
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
  paciente: PacienteBasicoSchema.optional(),
  profesional: ProfesionalBasicoSchema.optional(),
})

export type CrearTurnoDto = z.infer<typeof CrearTurnoSchema>
export type Turno = z.infer<typeof TurnoSchema>

export const ActualizarAsistenciaSchema = z.object({
  asistio: z.boolean(),
  justificada: z.boolean(),
  observaciones: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .nullable(),
})

export const ResumenAsistenciaSchema = z.object({
  turnoFijoId: z.number(),
  totalTurnos: z.number(),
  totalAsistencias: z.number(),
  totalAusenciasJustificadas: z.number(),
  totalAusenciasInjustificadas: z.number(),
})

export type ActualizarAsistenciaDto = z.infer<typeof ActualizarAsistenciaSchema>
export type ResumenAsistenciaDto = z.infer<typeof ResumenAsistenciaSchema>
