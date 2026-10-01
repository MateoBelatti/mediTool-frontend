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
})

export const ReunionUpdateSchema = ReunionCreateSchema

export const ReunionResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  fechaHora: z.string(),
  modalidad: z.string().nullable().optional(),
  descripcion: z.string().nullable().optional(),
  profesionalId: z.number(),
  createdAt: z.string().nullable().optional(),
})

export type ReunionCreateDto = z.infer<typeof ReunionCreateSchema>
export type ReunionUpdateDto = z.infer<typeof ReunionUpdateSchema>
export type ReunionResponseDto = z.infer<typeof ReunionResponseSchema>
