import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { type Turno, EstadoTurno } from '@/features/turnos/types/turnos.types'
import { EstadoAsistenciaModal } from '../EstadoAsistenciaModal/EstadoAsistenciaModal'
import { turnosService } from '@/features/turnos/services/turnos.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRegistrarActualizarAsistencia } from '../../hooks/useAsistencias'
import styles from './AsistenciasGrid.module.css'

interface AsistenciasGridProps {
  turnos: Turno[]
  month: number // 0-indexed (0 = Enero)
  year: number
}

interface PatientRow {
  pacienteId: number
  pacienteNombre: string
  turnos: Record<number, Turno> // day -> Turno
}

export const AsistenciasGrid: React.FC<AsistenciasGridProps> = ({
  turnos,
  month,
  year,
}) => {
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state?.openTurnoId && turnos.length > 0) {
      const turnoToOpen = turnos.find(t => t.id === location.state.openTurnoId)
      if (turnoToOpen) {
        setSelectedTurno(turnoToOpen)
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [location.state, turnos, navigate, location.pathname])
  const queryClient = useQueryClient()

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoTurno }) =>
      turnosService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      setSelectedTurno(null)
    },
  })

  const { mutate: registrarAsistencia } = useRegistrarActualizarAsistencia()

  // Calculate days in the month
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [month, year]
  )
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Group turnos by patient
  const patientRows = useMemo(() => {
    const rowsMap = new Map<number, PatientRow>()

    turnos.forEach((turno) => {
      if (!rowsMap.has(turno.pacienteId)) {
        rowsMap.set(turno.pacienteId, {
          pacienteId: turno.pacienteId,
          pacienteNombre: turno.paciente
            ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
            : `Paciente #${turno.pacienteId}`,
          turnos: {},
        })
      }

      const date = new Date(turno.fechaHora)
      if (date.getMonth() === month && date.getFullYear() === year) {
        const day = date.getDate()
        if (!rowsMap.get(turno.pacienteId)!.turnos[day]) {
          rowsMap.get(turno.pacienteId)!.turnos[day] = turno
        }
      }
    })

    return Array.from(rowsMap.values()).sort((a, b) =>
      a.pacienteNombre.localeCompare(b.pacienteNombre)
    )
  }, [turnos, month, year])

  const getStatusEmoji = (estado: EstadoTurno | string) => {
    switch (estado) {
      case EstadoTurno.Pendiente:
      case 'Pendiente':
        return '⏳'
      case EstadoTurno.Presente:
      case 'Presente':
        return '✅'
      case EstadoTurno.Ausente:
      case 'Ausente':
        return '❌'
      case EstadoTurno.Cancelado:
      case 'Cancelado':
        return '🚫'
      case EstadoTurno.Reprogramado:
      case 'Reprogramado':
        return '🔄'
      default:
        return '⏳'
    }
  }

  const getStatusColorClass = (estado: EstadoTurno | string) => {
    switch (estado) {
      case EstadoTurno.Presente:
      case 'Presente':
        return styles.statusPresente
      case EstadoTurno.Ausente:
      case 'Ausente':
        return styles.statusAusente
      case EstadoTurno.Cancelado:
      case 'Cancelado':
        return styles.statusCancelado
      case EstadoTurno.Reprogramado:
      case 'Reprogramado':
        return styles.statusReprogramado
      case EstadoTurno.Pendiente:
      case 'Pendiente':
        return styles.statusPendiente
      default:
        return ''
    }
  }

  const handleCellClick = (turno: Turno) => {
    setSelectedTurno(turno)
  }

  const handleSaveEstado = (
    nuevoEstado: EstadoTurno,
    justificada?: boolean,
    observaciones?: string
  ) => {
    if (!selectedTurno) return

    if (
      nuevoEstado === EstadoTurno.Presente ||
      nuevoEstado === EstadoTurno.Ausente
    ) {
      registrarAsistencia(
        {
          turnoId: selectedTurno.id,
          data: {
            asistio: nuevoEstado === EstadoTurno.Presente,
            justificada: justificada || false,
            observaciones: observaciones,
          },
        },
        {
          onSuccess: () => setSelectedTurno(null),
        }
      )
    } else {
      cambiarEstado({ id: selectedTurno.id, estado: nuevoEstado })
    }
  }

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.stickyCol}>Nombre PACIENTE</th>
              {daysArray.map((day) => (
                <th key={day} className={styles.dayHeader}>
                  {day.toString().padStart(2, '0')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patientRows.map((row, index) => (
              <tr key={row.pacienteId}>
                <td className={styles.stickyCol}>
                  <span className={styles.rowIndex}>{index + 1}</span>
                  {row.pacienteNombre}
                </td>
                {daysArray.map((day) => {
                  const turno = row.turnos[day]
                  return (
                    <td key={day} className={styles.cell}>
                      {turno ? (
                        <button
                          className={`${styles.turnoSquare} ${getStatusColorClass(turno.estado)}`}
                          onClick={() => handleCellClick(turno)}
                          title={`Turno a las ${new Date(turno.fechaHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        >
                          {getStatusEmoji(turno.estado)}
                        </button>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            ))}
            {patientRows.length === 0 && (
              <tr>
                <td colSpan={daysInMonth + 1} className={styles.emptyState}>
                  No hay pacientes con turnos en este mes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EstadoAsistenciaModal
        isOpen={!!selectedTurno}
        onClose={() => setSelectedTurno(null)}
        turno={selectedTurno}
        onSave={handleSaveEstado}
      />
    </div>
  )
}
