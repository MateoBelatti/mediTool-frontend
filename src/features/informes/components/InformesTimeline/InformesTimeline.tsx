import { useMemo, useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Eye,
  FileText,
  User as UserIcon,
} from 'lucide-react'
import { Button } from '@/shared/components/Button/Button'
import type { InformeWithPaciente } from '../../types/informes.types'
import styles from './InformesTimeline.module.css'

interface InformesTimelineProps {
  informes: InformeWithPaciente[]
  isLoading: boolean
  pacienteSearch: string
  onViewClick: (informe: InformeWithPaciente) => void
}

interface GrupoInformes {
  key: string
  pacienteId?: number | null
  paciente?: {
    nombre: string
    apellido: string
    dni?: string
  }
  informes: InformeWithPaciente[]
}

const SIN_PACIENTE_KEY = 'sin-paciente'

const formatFecha = (fechaString: string) => {
  if (fechaString.length === 10) {
    const [year, month, day] = fechaString.split('-')
    return `${day}/${month}/${year}`
  }
  return new Date(fechaString).toLocaleDateString()
}

const nombreGrupo = (grupo: GrupoInformes) => {
  if (grupo.paciente) {
    return `${grupo.paciente.nombre || ''} ${grupo.paciente.apellido || ''}`.trim()
  }
  if (grupo.pacienteId) {
    return `Paciente #${grupo.pacienteId}`
  }
  return 'Sin paciente'
}

export const InformesTimeline = ({
  informes,
  isLoading,
  pacienteSearch,
  onViewClick,
}: InformesTimelineProps) => {
  const [gruposExpandidos, setGruposExpandidos] = useState<Set<string>>(
    () => new Set()
  )

  const grupos = useMemo(() => {
    const searchLower = pacienteSearch.trim().toLowerCase()

    const informesFiltrados = (informes || []).filter((informe) => {
      if (!searchLower) return true
      const paciente = informe.pacienteData
      if (!paciente) return false

      const fullName =
        `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase()
      return (
        fullName.includes(searchLower) ||
        (paciente.dni ? paciente.dni.includes(searchLower) : false)
      )
    })

    const mapa = new Map<string, GrupoInformes>()

    informesFiltrados.forEach((informe) => {
      const key = informe.pacienteId
        ? String(informe.pacienteId)
        : SIN_PACIENTE_KEY

      if (!mapa.has(key)) {
        mapa.set(key, {
          key,
          pacienteId: informe.pacienteId,
          paciente: informe.pacienteData,
          informes: [],
        })
      }

      mapa.get(key)?.informes.push(informe)
    })

    return Array.from(mapa.values())
      .map((grupo) => ({
        ...grupo,
        informes: [...grupo.informes].sort((a, b) =>
          b.fecha.localeCompare(a.fecha)
        ),
      }))
      .sort((a, b) => {
        if (a.key === SIN_PACIENTE_KEY) return 1
        if (b.key === SIN_PACIENTE_KEY) return -1

        const nombreA =
          `${a.paciente?.apellido || ''} ${a.paciente?.nombre || ''}`.toLowerCase()
        const nombreB =
          `${b.paciente?.apellido || ''} ${b.paciente?.nombre || ''}`.toLowerCase()
        return nombreA.localeCompare(nombreB)
      })
  }, [informes, pacienteSearch])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando informes...</p>
      </div>
    )
  }

  if (grupos.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <FileText size={48} className={styles.emptyIcon} />
        <p>No se encontraron informes para los filtros seleccionados.</p>
      </div>
    )
  }

  const toggleGrupo = (key: string) => {
    setGruposExpandidos((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div className={styles.listContainer}>
      {grupos.map((grupo) => {
        const isExpanded = gruposExpandidos.has(grupo.key)
        const grupoId = `grupo-informes-${grupo.key}`
        const cantidad = grupo.informes.length

        return (
          <section key={grupo.key} className={styles.group}>
            <button
              type="button"
              className={styles.groupHeader}
              onClick={() => toggleGrupo(grupo.key)}
              aria-expanded={isExpanded}
              aria-controls={grupoId}
            >
              <span className={styles.groupMain}>
                <span className={styles.avatar}>
                  <UserIcon size={18} />
                </span>
                <span className={styles.groupInfo}>
                  <span className={styles.pacienteName}>
                    {nombreGrupo(grupo)}
                  </span>
                  {grupo.paciente?.dni && (
                    <span className={styles.pacienteDni}>
                      DNI {grupo.paciente.dni}
                    </span>
                  )}
                </span>
              </span>
              <span className={styles.groupMeta}>
                <span className={styles.countBadge}>
                  {cantidad} {cantidad === 1 ? 'informe' : 'informes'}
                </span>
                <ChevronDown
                  size={18}
                  className={`${styles.chevron} ${
                    isExpanded ? styles.chevronOpen : ''
                  }`}
                />
              </span>
            </button>

            {isExpanded && (
              <div id={grupoId} className={styles.timelineWrapper}>
                <ol className={styles.timeline}>
                  {grupo.informes.map((informe) => (
                    <li key={informe.id} className={styles.timelineItem}>
                      <span className={styles.dot} aria-hidden="true" />
                      <div className={styles.timelineContent}>
                        <span className={styles.informeTitulo}>
                          {informe.tipo || 'Sin tipo'}
                        </span>
                        <span className={styles.informeFecha}>
                          <Calendar size={14} />
                          {formatFecha(informe.fecha)}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewClick(informe)}
                        leftIcon={<Eye size={16} />}
                      >
                        Ver
                      </Button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
