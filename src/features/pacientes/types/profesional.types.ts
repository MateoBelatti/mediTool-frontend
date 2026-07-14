export interface Profesional {
  id: number
  nombre: string
  apellido: string
  prestacion?: string
  matricula?: string
  email?: string
  telefono?: string
  registroPrestadores?: string
}

export interface ProfesionalCreateDto extends Omit<Profesional, 'id'> {
  password?: string
}

export type ProfesionalUpdateDto = Omit<Profesional, 'id'>
