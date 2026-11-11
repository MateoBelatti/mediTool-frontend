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
  fechaNacimiento: z
    .union([
      z.literal(''),
      z
        .string()
        .refine(
          (val) => {
            const [y, m, d] = val.split('-').map(Number)
            if (!y || !m || !d) return false
            const birth = new Date(y, m - 1, d)
            const now = new Date()
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            )
            return birth <= today
          },
          { message: 'La fecha de nacimiento no puede ser futura' }
        )
        .refine(
          (val) => {
            const [y, m, d] = val.split('-').map(Number)
            if (!y || !m || !d) return false
            const birth = new Date(y, m - 1, d)
            const now = new Date()
            const today = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            )
            let age = today.getFullYear() - birth.getFullYear()
            const monthDiff = today.getMonth() - birth.getMonth()
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birth.getDate())
            ) {
              age--
            }
            return age <= 120
          },
          { message: 'La fecha de nacimiento no puede ser anterior a 120 años' }
        ),
    ])
    .optional(),
  dni: z
    .union([
      z.literal(''),
      z
        .string()
        .regex(
          /^\d{7,8}$/,
          'El DNI debe contener solo dígitos (7 u 8 caracteres)'
        ),
    ])
    .optional(),
  direccion: z
    .string()
    .max(50, 'La dirección no puede superar los 50 caracteres')
    .optional()
    .or(z.literal('')),
  telefono: z
    .union([
      z.literal(''),
      z
        .string()
        .max(30, 'El teléfono no puede superar los 30 caracteres')
        .regex(/^[\d\s\-+()]{6,30}$/, 'El formato del teléfono no es válido'),
    ])
    .optional(),
  email: z
    .union([
      z.literal(''),
      z
        .string()
        .email('El formato del correo electrónico no es válido')
        .max(150, 'El email no puede superar los 150 caracteres'),
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
  escuela: z
    .string()
    .max(100, 'La escuela no puede superar los 100 caracteres')
    .optional()
    .or(z.literal('')),
})

export type PacienteFormData = z.infer<typeof pacienteSchema>
