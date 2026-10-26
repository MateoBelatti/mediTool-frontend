import { useState, useRef, useEffect, useMemo } from 'react'
import {
  ListTodo,
  CalendarX2,
  ClipboardCheck,
  FileText,
  User,
  Calendar,
  Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from '@/shared/components/Button/Button'
import styles from './DailyAgenda.module.css'
import type { Turno } from '../../turnos/types/turnos.types'
import type { ReunionResponseDto } from '../../reuniones/schemas/reuniones.schema'

interface DailyAgendaProps {
  selectedDate: Date
  turnosDelDia?: Turno[]
  reunionesDelDia?: ReunionResponseDto[]
  onAddTurno?: () => void
  onReunionClick?: (reunion: ReunionResponseDto) => void
}

interface TurnoAgendaItem {
  kind: 'turno'
  fechaHora: string
  turno: Turno
}

interface ReunionAgendaItem {
  kind: 'reunion'
  fechaHora: string
  reunion: ReunionResponseDto
}

type AgendaItem = TurnoAgendaItem | ReunionAgendaItem

export const DailyAgenda = ({
  selectedDate,
  turnosDelDia = [],
  reunionesDelDia = [],
  onAddTurno,
  onReunionClick,
}: DailyAgendaProps) => {
  const navigate = useNavigate()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const fechaFormateada = format(selectedDate, "EEEE d 'de' MMMM", {
    locale: es,
  })

  const agendaItems = useMemo<AgendaItem[]>(() => {
    const turnos: AgendaItem[] = turnosDelDia.map((turno) => ({
      kind: 'turno',
      fechaHora: turno.fechaHora,
      turno,
    }))
    const reuniones: AgendaItem[] = reunionesDelDia.map((reunion) => ({
      kind: 'reunion',
      fechaHora: reunion.fechaHora,
      reunion,
    }))

    return [...turnos, ...reuniones].sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    )
  }, [turnosDelDia, reunionesDelDia])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAction = (path: string, state?: Record<string, unknown>) => {
    navigate(path, { state })
    setActiveMenuId(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerTitle}>
            <ListTodo size={20} className={styles.icon} />
            <h3>Agenda Diaria</h3>
          </div>
          <span className={styles.selectedDateText}>
            {fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}
          </span>
        </div>
        {onAddTurno && (
          <Button size="sm" leftIcon={<Plus size={16} />} onClick={onAddTurno}>
            Nuevo turno
          </Button>
        )}
      </div>

      {agendaItems.length > 0 ? (
        <div className={styles.agendaList}>
          {agendaItems.map((item, index) => {
            const time = new Date(item.fechaHora).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })

            if (item.kind === 'reunion') {
              const { reunion } = item

              return (
                <div
                  key={`reunion-${reunion.id}`}
                  className={`${styles.agendaItem} ${styles.reunionItem}`}
                  onClick={() => {
                    setActiveMenuId(null)
                    onReunionClick?.(reunion)
                  }}
                >
                  <div className={styles.timeColumn}>
                    <span className={styles.timeText}>{time}</span>
                  </div>
                  <div className={styles.detailsColumn}>
                    <p className={styles.patientName}>{reunion.titulo}</p>
                    <div className={styles.reunionMeta}>
                      <span
                        className={`${styles.appointmentType} ${styles.reunionTag}`}
                      >
                        Reunión
                      </span>
                      {reunion.modalidad && (
                        <span className={styles.reunionModality}>
                          {reunion.modalidad}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            const { turno } = item
            const isFijo = !!turno.turnoFijoId
            const patientName = turno.paciente
              ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
              : `Paciente ${turno.pacienteId}`
            const isActive = activeMenuId === turno.id
            const openUpwards =
              index >= agendaItems.length - 2 && agendaItems.length > 2

            return (
              <div
                key={`turno-${turno.id}`}
                className={`${styles.agendaItem} ${isFijo ? styles.fijo : ''}`}
                onClick={() => setActiveMenuId(isActive ? null : turno.id)}
                style={{ cursor: 'pointer', zIndex: isActive ? 20 : 1 }}
              >
                <div className={styles.timeColumn}>
                  <span className={styles.timeText}>{time}</span>
                  <span className={styles.durationText}>
                    {turno.duracionMin} min
                  </span>
                </div>
                <div className={styles.detailsColumn}>
                  <p className={styles.patientName}>{patientName}</p>
                  <span
                    className={`${styles.appointmentType} ${isFijo ? styles.fijo : ''}`}
                  >
                    {isFijo ? 'Turno Fijo' : 'Turno Normal'}
                  </span>
                </div>

                {isActive && (
                  <div
                    className={styles.actionMenu}
                    ref={menuRef}
                    style={openUpwards ? { top: 'auto', bottom: '-10px' } : {}}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('/asistencia', { openTurnoId: turno.id })
                      }}
                    >
                      <ClipboardCheck size={16} /> Asistencia
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (turno.informeId) {
                          handleAction('/informes', {
                            viewInformeForTurnoId: turno.id,
                          })
                        } else {
                          handleAction('/informes', {
                            newInformeForPacienteId: turno.pacienteId,
                            turnoId: turno.id,
                            fecha: turno.fechaHora.split('T')[0],
                          })
                        }
                      }}
                    >
                      <FileText size={16} />{' '}
                      {turno.informeId ? 'Ver informe' : 'Informe'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction(`/pacientes/${turno.pacienteId}`)
                      }}
                    >
                      <User size={16} /> Perfil
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('/turnos', { editTurnoId: turno.id })
                      }}
                    >
                      <Calendar size={16} /> Modificar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <CalendarX2 size={48} strokeWidth={1} />
          <p>No hay turnos ni reuniones programadas para este día.</p>
          {onAddTurno && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={onAddTurno}
              style={{ marginTop: 'var(--space-3)' }}
            >
              Nuevo turno
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
