import { z } from 'zod'

export const profesionalCreateSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no puede superar los 100 caracteres'),
  prestacion: z
    .string()
    .max(100, 'La prestación no puede superar los 100 caracteres')
    .optional()
    .or(z.literal('')),
  matricula: z
    .string()
    .max(50, 'La matrícula no puede superar los 50 caracteres')
    .optional()
    .or(z.literal('')),
  email: z
    .union([
      z.literal(''),
      z
        .string()
        .email('El formato del correo electrónico no es válido')
        .max(150, 'El email no puede superar los 150 caracteres'),
    ])
    .optional(),
  telefono: z
    .string()
    .max(30, 'El teléfono no puede superar los 30 caracteres')
    .optional()
    .or(z.literal('')),
  registroPrestadores: z
    .string()
    .max(45, 'El registro de prestadores no puede superar los 45 caracteres')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede superar los 100 caracteres'),
})

export type ProfesionalFormData = z.infer<typeof profesionalCreateSchema>
