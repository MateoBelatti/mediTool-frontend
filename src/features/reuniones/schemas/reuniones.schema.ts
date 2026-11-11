import { z } from 'zod'

export const ReunionCreateSchema = z.object({
  titulo: z.string().max(150, 'El título no puede superar los 150 caracteres'),
  fechaHora: z.string(),
  modalidad: z
    .string()
    .max(20, 'La modalidad no puede superar los 20 caracteres')
    .optional(),
  descripcion: z.string().optional(),
  profesionalId: z.number(),
  profesionalesIds: z
    .array(z.number())
    .min(1, 'Seleccioná al menos un profesional para la reunión'),
})

export const ReunionUpdateSchema = ReunionCreateSchema

export const ProfesionalResumenSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  apellido: z.string(),
})

export const ReunionResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  fechaHora: z.string(),
  modalidad: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  profesionalId: z.number(),
  createdAt: z.string().nullable().optional(),
  profesionales: z.array(ProfesionalResumenSchema).default([]),
})

export type ReunionCreateDto = z.infer<typeof ReunionCreateSchema>
export type ReunionUpdateDto = z.infer<typeof ReunionUpdateSchema>
export type ReunionResponseDto = z.infer<typeof ReunionResponseSchema>
