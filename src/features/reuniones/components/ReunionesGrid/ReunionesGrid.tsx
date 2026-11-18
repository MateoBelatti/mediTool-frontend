import { useState, useMemo } from 'react'
import { Pencil, Users } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { ReunionResponseDto } from '../../schemas/reuniones.schema'
import styles from './ReunionesGrid.module.css'

interface ReunionesGridProps {
  reuniones: ReunionResponseDto[]
  isLoading: boolean
  onEditClick: (reunion: ReunionResponseDto) => void
  onReunionClick: (reunion: ReunionResponseDto) => void
  puedeEditar: (reunion: ReunionResponseDto) => boolean
  tituloSearch: string
}

type TabType = 'todas' | 'proximas' | 'pasadas'

const AVATAR_COLORS = [
  styles.avatarGreen,
  styles.avatarBrown,
  styles.avatarBlue,
  styles.avatarPurple,
]

export const ReunionesGrid = ({
  reuniones,
  isLoading,
  onEditClick,
  onReunionClick,
  puedeEditar,
  tituloSearch,
}: ReunionesGridProps) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('todas')

  // Filtrado local por título
  const reunionesFiltradas = useMemo(() => {
    if (!reuniones) return []
    if (!tituloSearch.trim()) return reuniones
    const searchLower = tituloSearch.toLowerCase().trim()
    return reuniones.filter((r) => r.titulo.toLowerCase().includes(searchLower))
  }, [reuniones, tituloSearch])

  // Separar en próximas y pasadas
  const { proximas, pasadas } = useMemo(() => {
    const now = new Date()
    const prox: ReunionResponseDto[] = []
    const pas: ReunionResponseDto[] = []

    for (const reunion of reunionesFiltradas) {
      const fecha = new Date(reunion.fechaHora)
      if (fecha >= now) {
        prox.push(reunion)
      } else {
        pas.push(reunion)
      }
    }

    // Próximas: orden ascendente (la más cercana primero)
    prox.sort(
      (a, b) =>
        new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    )
    // Pasadas: orden descendente (la más reciente primero)
    pas.sort(
      (a, b) =>
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    )

    return { proximas: prox, pasadas: pas }
  }, [reunionesFiltradas])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Cargando reuniones...</p>
      </div>
    )
  }

  const handleTabClick = (tab: 'proximas' | 'pasadas') => {
    setActiveTab((current) => (current === tab ? 'todas' : tab))
  }

  const getOrganizadorInfo = (reunion: ReunionResponseDto) => {
    const profesionales = reunion.profesionales ?? []
    const currentUserId = user?.id ? parseInt(user.id) : 0
    const esCreadaPorMi = reunion.profesionalId === currentUserId

    if (profesionales.length === 0) {
      return esCreadaPorMi ? 'Solo vos' : 'Sin participantes'
    }

    if (
      profesionales.length === 1 &&
      (esCreadaPorMi || profesionales[0].id === currentUserId)
    ) {
      return 'Solo vos'
    }

    const organizadorObj = profesionales.find(
      (p) => p.id === reunion.profesionalId
    )
    const orgLabel = esCreadaPorMi
      ? 'Admin'
      : organizadorObj
        ? organizadorObj.nombre
        : 'Admin'

    return `Organiza: ${orgLabel} · ${profesionales.length} profesionales`
  }

  const renderReunionCard = (reunion: ReunionResponseDto) => {
    const fecha = new Date(reunion.fechaHora)
    const dia = format(fecha, 'd')
    const mes = format(fecha, 'MMM', { locale: es })
      .toUpperCase()
      .replace('.', '')
    const hora = `${format(fecha, 'HH:mm')} hs`

    const modalidad = reunion.modalidad?.trim() || ''
    const modLower = modalidad.toLowerCase()
    const badgeClass = modLower.includes('presencial')
      ? styles.badgePresencial
      : modLower.includes('virtual')
        ? styles.badgeVirtual
        : styles.badgeDefault

    const profesionales = reunion.profesionales ?? []
    const organizadorTexto = getOrganizadorInfo(reunion)

    return (
      <div
        key={reunion.id}
        className={styles.card}
        onClick={() => onReunionClick(reunion)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onReunionClick(reunion)
          }
        }}
      >
        <div className={styles.cardDateBlock}>
          <span className={styles.dateDay}>{dia}</span>
          <span className={styles.dateMonth}>{mes}</span>
        </div>

        <div className={styles.cardMainInfo}>
          <h3 className={styles.cardTitle}>{reunion.titulo}</h3>
          <span className={styles.cardHour}>{hora}</span>
        </div>

        <div className={styles.cardBadgeCol}>
          {modalidad ? (
            <span className={`${styles.badge} ${badgeClass}`}>{modalidad}</span>
          ) : (
            <span className={styles.badgePlaceholder} />
          )}
        </div>

        <div className={styles.cardParticipantsCol}>
          <div className={styles.avatarsGroup}>
            {profesionales.slice(0, 3).map((prof, index) => {
              const iniciales =
                `${prof.nombre?.[0] ?? ''}${prof.apellido?.[0] ?? ''}`.toUpperCase() ||
                `P${index + 1}`
              const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length]

              return (
                <div
                  key={prof.id}
                  className={`${styles.avatar} ${colorClass}`}
                  title={`${prof.apellido}, ${prof.nombre}`}
                >
                  {iniciales}
                </div>
              )
            })}
          </div>
          <span className={styles.participantsText} title={organizadorTexto}>
            {organizadorTexto}
          </span>
        </div>

        <div className={styles.cardActionsCol}>
          {puedeEditar(reunion) && (
            <button
              type="button"
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation()
                onEditClick(reunion)
              }}
              aria-label="Editar reunión"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      </div>
    )
  }

  const showProximas = activeTab === 'todas' || activeTab === 'proximas'
  const showPasadas = activeTab === 'todas' || activeTab === 'pasadas'

  const totalVisible =
    (showProximas ? proximas.length : 0) + (showPasadas ? pasadas.length : 0)

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'proximas' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabClick('proximas')}
        >
          Próximas · {proximas.length}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'pasadas' ? styles.tabButtonActive : ''}`}
          onClick={() => handleTabClick('pasadas')}
        >
          Pasadas · {pasadas.length}
        </button>
      </div>

      {totalVisible === 0 ? (
        <div className={styles.emptyContainer}>
          <Users size={44} className={styles.emptyIcon} />
          <p className={styles.emptyText}>
            No se encontraron reuniones para mostrar.
          </p>
        </div>
      ) : (
        <div className={styles.sectionsWrapper}>
          {showProximas && proximas.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>PRÓXIMAS</h2>
              <div className={styles.cardsList}>
                {proximas.map(renderReunionCard)}
              </div>
            </section>
          )}

          {showPasadas && pasadas.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionHeader}>PASADAS</h2>
              <div className={styles.cardsList}>
                {pasadas.map(renderReunionCard)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
