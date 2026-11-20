import { useQuery } from '@tanstack/react-query'
import { pacienteService } from '../services/paciente.service'
import type {
  HistorialFiltros,
  HistorialQueryParams,
} from '../types/historial.types'

export const HISTORIAL_PACIENTE_KEYS = {
  all: ['paciente', 'historial'] as const,
  byPaciente: (pacienteId: number) =>
    [...HISTORIAL_PACIENTE_KEYS.all, pacienteId] as const,
  list: (pacienteId: number, filtros: HistorialFiltros) =>
    [...HISTORIAL_PACIENTE_KEYS.byPaciente(pacienteId), filtros] as const,
}

const buildParams = (filtros: HistorialFiltros): HistorialQueryParams => ({
  page: filtros.page,
  pageSize: filtros.pageSize,
  tipo: filtros.tipo === 'todos' ? undefined : filtros.tipo,
  estado: filtros.estado || undefined,
  desde: filtros.desde || undefined,
  hasta: filtros.hasta || undefined,
  soloConInforme: filtros.soloConInforme || undefined,
})

export const useHistorialPaciente = (
  pacienteId: number,
  filtros: HistorialFiltros
) =>
  useQuery({
    queryKey: HISTORIAL_PACIENTE_KEYS.list(pacienteId, filtros),
    queryFn: () =>
      pacienteService.getHistorial(pacienteId, buildParams(filtros)),
    enabled: pacienteId > 0,
  })
