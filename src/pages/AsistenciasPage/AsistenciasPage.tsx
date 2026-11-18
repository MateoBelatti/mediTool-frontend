import { useState, useMemo } from 'react'
import type { Turno } from '@/features/turnos/types/turnos.types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AsistenciasGrid } from '@/features/turnos/components/AsistenciasGrid/AsistenciasGrid'
import { useAgendaTurnos } from '@/features/turnos/hooks/useTurnos'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePacientes } from '@/features/pacientes/hooks/usePacientes'
import styles from './AsistenciasPage.module.css'

export const AsistenciasPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined

  // Estado del mes seleccionado
  const [currentDate, setCurrentDate] = useState(new Date())

  // Vista: 'planilla' o 'rapido'
  const [vista, setVista] = useState<'planilla' | 'rapido'>('planilla')

  // Calcular primer y último día del mes
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )

  const formatDate = (d: Date) => format(d, 'yyyy-MM-dd')

  // Traer turnos del mes
  const { data: turnosDataPage, isLoading } = useAgendaTurnos({
    desde: formatDate(firstDayOfMonth),
    hasta: formatDate(lastDayOfMonth),
    profesionalId: profesionalId!,
    page: 1,
    pageSize: 100,
  })

  const { pacientes: pacientesPage, pacientesVinculados } = usePacientes(
    undefined,
    {
      page: 1,
      pageSize: 100,
    }
  )

  const turnosData = turnosDataPage?.items
  const pacientes = pacientesPage?.items || pacientesVinculados?.items

  // Enriquecer turnos con paciente si falta
  const turnos = useMemo(() => {
    if (!turnosData || !pacientes) return turnosData
    return turnosData.map((turno: Turno) => {
      if (!turno.paciente && turno.pacienteId) {
        const foundPaciente = pacientes.find((p) => p.id === turno.pacienteId)
        if (foundPaciente) {
          return { ...turno, paciente: foundPaciente }
        }
      }
      return turno
    })
  }, [turnosData, pacientes])

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  // Subtítulo con fecha de hoy
  const hoyTexto = format(new Date(), "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  })
  const hoyCapitalizado = hoyTexto.charAt(0).toUpperCase() + hoyTexto.slice(1)

  // Mes y año actual para el selector
  const mesAnioTexto = format(currentDate, 'MMMM yyyy', { locale: es })
  const mesAnioCapitalizado =
    mesAnioTexto.charAt(0).toUpperCase() + mesAnioTexto.slice(1)

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Asistencias</h1>
          <p className={styles.subtitle}>{hoyCapitalizado}</p>
        </div>

        <div className={styles.controlsSection}>
          <div className={styles.viewTabs}>
            <button
              type="button"
              className={`${styles.viewTab} ${
                vista === 'planilla' ? styles.viewTabActive : ''
              }`}
              onClick={() => setVista('planilla')}
            >
              Planilla
            </button>
            <button
              type="button"
              className={`${styles.viewTab} ${
                vista === 'rapido' ? styles.viewTabActive : ''
              }`}
              onClick={() => setVista('rapido')}
            >
              Registro rápido
            </button>
          </div>

          <div className={styles.monthSelector}>
            <button
              type="button"
              onClick={handlePreviousMonth}
              className={styles.navButton}
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span className={styles.currentMonth}>{mesAnioCapitalizado}</span>
            <button
              type="button"
              onClick={handleNextMonth}
              className={styles.navButton}
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>Cargando asistencias...</span>
          </div>
        ) : (
          <AsistenciasGrid
            turnos={turnos || []}
            month={currentDate.getMonth()}
            year={currentDate.getFullYear()}
            vista={vista}
          />
        )}
      </div>
    </div>
  )
}
