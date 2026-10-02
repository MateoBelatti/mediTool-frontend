import { useState, useRef, useEffect } from 'react'
import {
  ListTodo,
  CalendarX2,
  ClipboardCheck,
  FileText,
  User,
  Calendar,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import styles from './DailyAgenda.module.css'
import type { Turno } from '../../turnos/types/turnos.types'

interface DailyAgendaProps {
  selectedDate: Date
  turnosDelDia?: Turno[]
}

export const DailyAgenda = ({
  selectedDate,
  turnosDelDia = [],
}: DailyAgendaProps) => {
  const navigate = useNavigate()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const fechaFormateada = format(selectedDate, "EEEE d 'de' MMMM", {
    locale: es,
  })

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
        <div className={styles.headerTitle}>
          <ListTodo size={20} className={styles.icon} />
          <h3>Agenda Diaria</h3>
        </div>
        <span className={styles.selectedDateText}>
          {fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)}
        </span>
      </div>

      {turnosDelDia.length > 0 ? (
        <div className={styles.agendaList}>
          {turnosDelDia.map((turno, index) => {
            const time = new Date(turno.fechaHora).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
            const isFijo = !!turno.turnoFijoId
            const patientName = turno.paciente
              ? `${turno.paciente.nombre} ${turno.paciente.apellido}`
              : `Paciente ${turno.pacienteId}`
            const isActive = activeMenuId === turno.id
            const openUpwards =
              index >= turnosDelDia.length - 2 && turnosDelDia.length > 2

            return (
              <div
                key={turno.id}
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
                        handleAction('/informes', {
                          newInformeForPacienteId: turno.pacienteId,
                        })
                      }}
                    >
                      <FileText size={16} /> Informe
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAction('/pacientes', {
                          openPacienteId: turno.pacienteId,
                        })
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
          <p>No hay turnos programados para este día.</p>
        </div>
      )}
    </div>
  )
}
