import { Search, Plus, Users } from 'lucide-react'
import type { TurnoFijo } from '@/features/turnos-fijos/types/turnos-fijos.types'
import type { Turno } from '../../types/turnos.types'
import styles from './TurnosSidebar.module.css'

const DIAS_SEMANA_NOMBRES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

const getInitials = (nombre?: string, apellido?: string) => {
  const n = (nombre || '').trim()
  const a = (apellido || '').trim()
  if (n && a) return `${n[0]}${a[0]}`.toUpperCase()
  if (n) return n.slice(0, 2).toUpperCase()
  return '?'
}

interface TurnosSidebarProps {
  activeTab: 'fijos' | 'sueltos'
  searchTerm: string
  onSearchChange: (value: string) => void
  // Fijos
  turnosFijos: TurnoFijo[]
  selectedTurnoFijoId: number | null
  onSelectTurnoFijo: (id: number) => void
  isLoadingFijos: boolean
  // Sueltos
  turnosSueltosCount: number
  pacientesConSueltos: Array<{
    paciente: NonNullable<Turno['paciente']>
    count: number
  }>
  selectedPacienteSueltoId: number | 'todos'
  onSelectPacienteSuelto: (id: number | 'todos') => void
  isLoadingSueltos: boolean
  // Acciones
  onNewClick: () => void
}

export const TurnosSidebar = ({
  activeTab,
  searchTerm,
  onSearchChange,
  turnosFijos,
  selectedTurnoFijoId,
  onSelectTurnoFijo,
  isLoadingFijos,
  turnosSueltosCount,
  pacientesConSueltos,
  selectedPacienteSueltoId,
  onSelectPacienteSuelto,
  isLoadingSueltos,
  onNewClick,
}: TurnosSidebarProps) => {
  return (
    <aside className={styles.sidebarColumn}>
      {/* Buscador */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Lista scrollable */}
      <div className={styles.sidebarList}>
        {activeTab === 'fijos' ? (
          isLoadingFijos ? (
            <div className={styles.sidebarLoading}>Cargando reglas...</div>
          ) : turnosFijos.length === 0 ? (
            <div className={styles.sidebarEmpty}>
              {searchTerm
                ? 'No se encontraron reglas.'
                : 'No hay reglas de turnos fijos.'}
            </div>
          ) : (
            turnosFijos.map((regla) => {
              const p = regla.paciente
              const isSelected = selectedTurnoFijoId === regla.id
              return (
                <div
                  key={regla.id}
                  className={`${styles.reglaItem} ${isSelected ? styles.reglaItemActive : ''}`}
                  onClick={() => onSelectTurnoFijo(regla.id)}
                >
                  <div className={styles.avatar}>
                    {getInitials(p?.nombre, p?.apellido)}
                  </div>
                  <div className={styles.reglaItemContent}>
                    <div className={styles.reglaPacienteName}>
                      {p ? `${p.nombre} ${p.apellido}` : `Regla #${regla.id}`}
                    </div>
                    <div className={styles.reglaItemSubtext}>
                      {DIAS_SEMANA_NOMBRES[regla.diaSemana]} ·{' '}
                      {regla.hora.substring(0, 5)}
                      {!regla.activo && (
                        <span className={styles.badgeInactivoInline}>
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )
        ) : isLoadingSueltos ? (
          <div className={styles.sidebarLoading}>Cargando turnos...</div>
        ) : (
          <>
            <div
              className={`${styles.reglaItem} ${selectedPacienteSueltoId === 'todos' ? styles.reglaItemActive : ''}`}
              onClick={() => onSelectPacienteSuelto('todos')}
            >
              <div className={styles.avatarIcon}>
                <Users size={16} />
              </div>
              <div className={styles.reglaItemContent}>
                <div className={styles.reglaPacienteName}>
                  Todos los pacientes
                </div>
                <div className={styles.reglaItemSubtext}>
                  {turnosSueltosCount} turnos sueltos
                </div>
              </div>
            </div>

            {pacientesConSueltos.map(({ paciente, count }) => {
              const isSelected = selectedPacienteSueltoId === paciente.id
              return (
                <div
                  key={paciente.id}
                  className={`${styles.reglaItem} ${isSelected ? styles.reglaItemActive : ''}`}
                  onClick={() => onSelectPacienteSuelto(paciente.id)}
                >
                  <div className={styles.avatar}>
                    {getInitials(paciente.nombre, paciente.apellido)}
                  </div>
                  <div className={styles.reglaItemContent}>
                    <div className={styles.reglaPacienteName}>
                      {paciente.nombre} {paciente.apellido}
                    </div>
                    <div className={styles.reglaItemSubtext}>
                      {count} {count === 1 ? 'turno' : 'turnos'}
                    </div>
                  </div>
                </div>
              )
            })}

            {pacientesConSueltos.length === 0 && turnosSueltosCount === 0 && (
              <div className={styles.sidebarEmpty}>
                No hay turnos sueltos registrados.
              </div>
            )}
          </>
        )}
      </div>

      {/* Botón inferior */}
      <button
        type="button"
        className={styles.newActionButton}
        onClick={onNewClick}
      >
        <Plus size={16} />
        <span>{activeTab === 'fijos' ? 'Nueva regla' : 'Nuevo turno'}</span>
      </button>
    </aside>
  )
}
