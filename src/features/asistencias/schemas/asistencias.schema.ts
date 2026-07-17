import { z } from 'zod'

export const ActualizarAsistenciaSchema = z.object({
  asistio: z.boolean({ required_error: 'Requerido' }),
  justificada: z.boolean({ required_error: 'Requerido' }),
  facturable: z.boolean({ required_error: 'Requerido' }),
})

export const AsistenciaSchema = z.object({
  id: z.number(),
  turnoId: z.number().nullable().optional(),
  asistio: z.boolean(),
  justificada: z.boolean(),
  facturable: z.boolean(),
  fechaRegistro: z.string(),
})

export const ResumenAsistenciaSchema = z.object({
  turnoFijoId: z.number(),
  totalTurnos: z.number(),
  totalAsistencias: z.number(),
  totalAusenciasJustificadas: z.number(),
  totalAusenciasInjustificadas: z.number(),
})

export type ActualizarAsistenciaDto = z.infer<typeof ActualizarAsistenciaSchema>
export type Asistencia = z.infer<typeof AsistenciaSchema>
export type ResumenAsistenciaDto = z.infer<typeof ResumenAsistenciaSchema>
