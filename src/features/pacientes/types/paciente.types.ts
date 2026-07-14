export interface Paciente {
  id: number
  nombre: string
  apellido: string
  fechaNacimiento?: string
  dni?: string
  direccion?: string
  telefono?: string
  email?: string
  obraSocial?: string
  nroAfiliado?: string
}

export type PacienteCreateDto = Omit<Paciente, 'id'>
export type PacienteUpdateDto = Omit<Paciente, 'id'>
