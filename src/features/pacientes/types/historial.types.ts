import type { PageResult } from '@/shared/types/pagination.types'
import type { EstadoTurno, Turno } from '@/features/turnos/types/turnos.types'
import type { InformeResponseDto } from '@/features/informes/types/informes.types'

export const HISTORIAL_TIPO = {
  Turno: 'Turno',
  Informe: 'Informe',
} as const

export type HistorialTipo = (typeof HISTORIAL_TIPO)[keyof typeof HISTORIAL_TIPO]

export type HistorialTipoFiltro = 'todos' | 'turno' | 'informe'

export interface ProfesionalResumenHistorial {
  id: number
  nombre: string
  apellido: string
}

export interface HistorialEvento {
  tipo: HistorialTipo
  fechaHora: string
  profesional?: ProfesionalResumenHistorial | null
  turno?: Turno | null
  informe?: InformeResponseDto | null
}

export interface HistorialPacienteResponse {
  historial: PageResult<HistorialEvento>
  proximosTurnos: HistorialEvento[]
}

export interface HistorialFiltros {
  tipo: HistorialTipoFiltro
  estado: EstadoTurno | ''
  desde: string
  hasta: string
  soloConInforme: boolean
  page: number
  pageSize: number
}

export interface HistorialQueryParams {
  page: number
  pageSize: number
  tipo?: Exclude<HistorialTipoFiltro, 'todos'>
  estado?: EstadoTurno
  desde?: string
  hasta?: string
  soloConInforme?: boolean
}
