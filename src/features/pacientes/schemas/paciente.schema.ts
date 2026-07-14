import { z } from 'zod'

export const pacienteSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  apellido: z
    .string()
    .min(1, 'El apellido es obligatorio')
    .max(100, 'El apellido no puede superar los 100 caracteres'),
  fechaNacimiento: z.string().optional().or(z.literal('')),
  dni: z
    .string()
    .max(20, 'El DNI no puede superar los 20 caracteres')
    .optional()
    .or(z.literal('')),
  direccion: z
    .string()
    .max(50, 'La dirección no puede superar los 50 caracteres')
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .max(30, 'El teléfono no puede superar los 30 caracteres')
    .optional()
    .or(z.literal('')),
  email: z
    .union([
      z.literal(''),
      z
        .string()
        .email('El formato del correo electrónico no es válido')
        .max(150),
    ])
    .optional(),
  obraSocial: z
    .string()
    .max(100, 'La obra social no puede superar los 100 caracteres')
    .optional()
    .or(z.literal('')),
  nroAfiliado: z
    .string()
    .max(50, 'El número de afiliado no puede superar los 50 caracteres')
    .optional()
    .or(z.literal('')),
})

export type PacienteFormData = z.infer<typeof pacienteSchema>
