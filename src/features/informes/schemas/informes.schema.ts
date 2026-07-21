import { z } from 'zod'

export const InformeCreateSchema = z.object({
  pacienteId: z.number().optional(),
  profesionalId: z.number({ required_error: 'El profesional es requerido' }),
  fecha: z.string({ required_error: 'La fecha es requerida' }),
  tipo: z
    .string()
    .max(50, 'El tipo no puede superar los 50 caracteres')
    .optional(),
  contenido: z.string().optional(),
  estado: z
    .string()
    .max(20, 'El estado no puede superar los 20 caracteres')
    .optional(),
})

export const InformeUpdateSchema = InformeCreateSchema

export const InformeResponseSchema = z.object({
  id: z.number(),
  pacienteId: z.number().nullable().optional(),
  profesionalId: z.number(),
  fecha: z.string(),
  tipo: z.string().nullable().optional(),
  contenido: z.string().nullable().optional(),
  estado: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
})

export type InformeCreateDto = z.infer<typeof InformeCreateSchema>
export type InformeUpdateDto = z.infer<typeof InformeUpdateSchema>
export type InformeResponseDto = z.infer<typeof InformeResponseSchema>
