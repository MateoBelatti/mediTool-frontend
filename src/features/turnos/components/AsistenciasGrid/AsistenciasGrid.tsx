import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Check, X, Clock, Calendar } from 'lucide-react'
import { type Turno, EstadoTurno } from '@/features/turnos/types/turnos.types'
import { EstadoAsistenciaModal } from '../EstadoAsistenciaModal/EstadoAsistenciaModal'
import { turnosService } from '@/features/turnos/services/turnos.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRegistrarActualizarAsistencia } from '../../hooks/useTurnos'
import styles from './AsistenciasGrid.module.css'

interface AsistenciasGridProps {
  turnos: Turno[]
  month: number // 0-indexed (0 = Enero)
  year: number
  vista?: 'planilla' | 'rapido'
}

interface PatientRow {
  pacienteId: number
  pacienteNombre: string
  turnos: Record<number, Turno> // day -> Turno
}

// 0 = Domingo, 1 = Lunes, ...
const DIA_LETRAS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export const AsistenciasGrid: React.FC<AsistenciasGridProps> = ({
  turnos,
  month,
  year,
  vista = 'planilla',
}) => {
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (location.state?.openTurnoId && turnos.length > 0) {
      const turnoToOpen = turnos.find(
        (t) => t.id === location.state.openTurnoId
      )
      if (turnoToOpen) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedTurno(turnoToOpen)
        navigate(location.pathname, { replace: true, state: {} })
      }
    }
  }, [location.state, turnos, navigate, location.pathname])

  const { mutate: cambiarEstado } = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoTurno }) =>
      turnosService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      setSelectedTurno(null)
    },
  })

  const { mutate: registrarAsistencia } = useRegistrarActualizarAsistencia()

  // Días del mes
  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [month, year]
  )
  const daysArray = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  )

  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year
  const currentDay = today.getDate()

  // Fin del día de hoy para comparar atrasados vs próximos
  const endOfToday = useMemo(() => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
  }, [])

  // Agrupar turnos por paciente
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

  // Turnos para la vista de registro rápido (los del mes ordenados, priorizando pendientes/hoy)
  const turnosRegistroRapido = useMemo(() => {
    return [...turnos].sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    )
  }, [turnos])

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

  const handleQuickMarcar = (
    turno: Turno,
    asistio: boolean,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    registrarAsistencia({
      turnoId: turno.id,
      data: {
        asistio,
        justificada: false,
      },
    })
  }

  const getPillStyle = (turno: Turno) => {
    const fechaTurno = new Date(turno.fechaHora)
    const isPastOrToday = fechaTurno <= endOfToday

    if (turno.estado === EstadoTurno.Presente) {
      return {
        className: styles.pillPresente,
        title: 'Presente',
      }
    }

    if (turno.estado === EstadoTurno.Ausente) {
      return {
        className: turno.justificada
          ? styles.pillAusenteJustificada
          : styles.pillAusenteInjustificada,
        title: turno.justificada
          ? 'Ausente (justificada)'
          : 'Ausente (injustificada)',
      }
    }

    // Pendiente
    if (isPastOrToday) {
      return {
        className: styles.pillAtrasado,
        title: 'Atrasado (sin registrar)',
      }
    }

    return {
      className: styles.pillProximo,
      title: 'Próximo turno',
    }
  }

  return (
    <div className={styles.gridWrapper}>
      {vista === 'planilla' ? (
        <div className={styles.cardContainer}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.stickyColHeader}>PACIENTE</th>
                  {daysArray.map((day) => {
                    const dateObj = new Date(year, month, day)
                    const letraDia = DIA_LETRAS[dateObj.getDay()]
                    const isToday = isCurrentMonth && day === currentDay

                    return (
                      <th
                        key={day}
                        className={`${styles.dayColHeader} ${
                          isToday ? styles.todayColHeader : ''
                        }`}
                      >
                        <div
                          className={`${styles.dayHeaderContent} ${
                            isToday ? styles.todayBadge : ''
                          }`}
                        >
                          <span className={styles.dayLetter}>{letraDia}</span>
                          <span className={styles.dayNumber}>{day}</span>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {patientRows.map((row, index) => (
                  <tr key={row.pacienteId} className={styles.tableRow}>
                    <td className={styles.stickyCol}>
                      <span className={styles.rowIndex}>{index + 1}</span>
                      <span className={styles.patientName}>
                        {row.pacienteNombre}
                      </span>
                    </td>
                    {daysArray.map((day) => {
                      const turno = row.turnos[day]
                      const isToday = isCurrentMonth && day === currentDay

                      return (
                        <td
                          key={day}
                          className={`${styles.cell} ${
                            isToday ? styles.todayCell : ''
                          }`}
                        >
                          {turno &&
                            (() => {
                              const { className, title } = getPillStyle(turno)
                              const hora = format(
                                new Date(turno.fechaHora),
                                'HH:mm'
                              )
                              return (
                                <button
                                  type="button"
                                  className={`${styles.turnoPill} ${className}`}
                                  onClick={() => handleCellClick(turno)}
                                  title={`${row.pacienteNombre} · ${hora} hs · ${title}`}
                                  aria-label={`Ver asistencia de ${row.pacienteNombre}`}
                                >
                                  <span className={styles.pillDot} />
                                </button>
                              )
                            })()}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {patientRows.length === 0 && (
                  <tr>
                    <td colSpan={daysInMonth + 1} className={styles.emptyState}>
                      No hay turnos registrados en este mes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.footerLegend}>
            <div className={styles.legendItem}>
              <span className={styles.legendDotAtrasado} />
              <span>Atrasado (sin registrar)</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotHoy}>=</span>
              <span>Hoy</span>
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendBoxProximo} />
              <span>Próximo</span>
            </div>
            <span className={styles.legendHint}>
              Tocá una celda para registrar o cambiar asistencia
            </span>
          </div>
        </div>
      ) : (
        /* Vista de Registro Rápido */
        <div className={styles.rapidoContainer}>
          <div className={styles.rapidoHeader}>
            <h3 className={styles.rapidoTitle}>
              Registro rápido de asistencias del mes
            </h3>
            <p className={styles.rapidoSubtitle}>
              Marcá la asistencia de cada paciente con un solo clic o tocá la
              fila para más detalles.
            </p>
          </div>

          {turnosRegistroRapido.length === 0 ? (
            <div className={styles.emptyState}>
              No hay turnos agendados en este mes.
            </div>
          ) : (
            <div className={styles.rapidoList}>
              {turnosRegistroRapido.map((turno) => {
                const pacienteNombre = turno.paciente
                  ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
                  : `Paciente #${turno.pacienteId}`
                const fecha = new Date(turno.fechaHora)
                const diaNombre = format(fecha, "EEEE d 'de' MMMM", {
                  locale: es,
                })
                const hora = format(fecha, 'HH:mm')
                const isPresente = turno.estado === EstadoTurno.Presente
                const isAusente = turno.estado === EstadoTurno.Ausente

                return (
                  <div
                    key={turno.id}
                    className={styles.rapidoCard}
                    onClick={() => handleCellClick(turno)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCellClick(turno)
                    }}
                  >
                    <div className={styles.rapidoInfo}>
                      <span className={styles.rapidoPaciente}>
                        {pacienteNombre}
                      </span>
                      <div className={styles.rapidoMeta}>
                        <Calendar size={13} />
                        <span>
                          {diaNombre.charAt(0).toUpperCase() +
                            diaNombre.slice(1)}
                        </span>
                        <Clock size={13} />
                        <span>{hora} hs</span>
                      </div>
                    </div>

                    <div className={styles.rapidoActions}>
                      <button
                        type="button"
                        className={`${styles.quickBtn} ${
                          isPresente ? styles.quickBtnPresenteActive : ''
                        }`}
                        onClick={(e) => handleQuickMarcar(turno, true, e)}
                        title="Marcar Presente"
                      >
                        <Check size={16} />
                        <span>Presente</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.quickBtn} ${
                          isAusente ? styles.quickBtnAusenteActive : ''
                        }`}
                        onClick={(e) => handleQuickMarcar(turno, false, e)}
                        title="Marcar Ausente"
                      >
                        <X size={16} />
                        <span>Ausente</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <EstadoAsistenciaModal
        isOpen={!!selectedTurno}
        onClose={() => setSelectedTurno(null)}
        turno={selectedTurno}
        onSave={handleSaveEstado}
      />
    </div>
  )
}
