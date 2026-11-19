import { useMemo, useRef, useState } from 'react'
import {
  CalendarClock,
  ChevronDown,
  FileText,
  History,
  UserRound,
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Pagination } from '@/shared/components/Pagination/Pagination'
import { useHistorialPaciente } from '../../hooks/useHistorialPaciente'
import type {
  HistorialEvento,
  HistorialFiltros,
} from '../../types/historial.types'
import { HistorialFilters } from '../HistorialFilters/HistorialFilters'
import { HistorialEventoPopover } from '../HistorialEventoPopover/HistorialEventoPopover'
import styles from './HistorialPaciente.module.css'

interface HistorialPacienteProps {
  pacienteId: number
}

const FILTROS_INICIALES: HistorialFiltros = {
  tipo: 'todos',
  estado: '',
  desde: '',
  hasta: '',
  soloConInforme: false,
  page: 1,
  pageSize: 20,
}

const formatFechaSolo = (fecha: string) => {
  if (fecha.length === 10) {
    const [year, month, day] = fecha.split('-')
    return `${day}/${month}/${year}`
  }

  return format(new Date(fecha), 'dd/MM/yyyy', { locale: es })
}

const fechaEvento = (evento: HistorialEvento) => {
  if (!evento.turno && evento.informe) {
    if (evento.informe.fecha.length === 10) {
      const [year, month, day] = evento.informe.fecha.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    return new Date(evento.informe.fecha)
  }

  return new Date(evento.fechaHora)
}

const claveEvento = (evento: HistorialEvento) =>
  `${evento.tipo}-${evento.turno?.id ?? evento.informe?.id ?? 0}`

interface EventoCardProps {
  evento: HistorialEvento
  onClick: (element: HTMLElement) => void
}

const EventoCard = ({ evento, onClick }: EventoCardProps) => {
  const esTurno = Boolean(evento.turno)
  const esInformeSuelto = !esTurno
  const profesional = evento.profesional ?? evento.turno?.profesional
  const fecha = fechaEvento(evento)
  const hora = esTurno ? format(fecha, 'HH:mm', { locale: es }) : null

  return (
    <button
      type="button"
      className={`${styles.eventoCard} ${
        esInformeSuelto ? styles.informeSuelto : ''
      }`}
      data-historial-card="true"
      onClick={(e) => onClick(e.currentTarget)}
    >
      <span
        className={`${styles.eventoIcon} ${
          esTurno ? styles.iconTurno : styles.iconInforme
        }`}
      >
        {esTurno ? <CalendarClock size={18} /> : <FileText size={16} />}
      </span>

      <span className={styles.eventoBody}>
        <span className={styles.eventoTop}>
          <span
            className={`${styles.eventoTitulo} ${
              esInformeSuelto ? styles.tituloSecundario : ''
            }`}
          >
            {esTurno ? 'Consulta' : evento.informe?.tipo || 'Informe'}
          </span>

          {evento.turno && (
            <span
              className={`${styles.statusBadge} ${
                styles[evento.turno.estado.toLowerCase()] ?? ''
              }`}
            >
              {evento.turno.estado}
            </span>
          )}

          {evento.turno && (
            <span
              className={`${styles.informeChip} ${
                evento.informe ? styles.conInforme : styles.sinInforme
              }`}
            >
              <FileText size={12} />
              {evento.informe ? 'Con informe' : 'Sin informe'}
            </span>
          )}
        </span>

        <span className={styles.eventoMeta}>
          <span>
            {formatFechaSolo(
              esTurno
                ? evento.fechaHora
                : (evento.informe?.fecha ?? evento.fechaHora)
            )}
            {hora ? ` · ${hora} hs` : ''}
          </span>

          {profesional && (
            <span className={styles.metaItem}>
              <UserRound size={14} />
              {profesional.nombre} {profesional.apellido}
            </span>
          )}

          {evento.turno && (
            <span className={styles.metaItem}>
              {evento.turno.duracionMin} min
            </span>
          )}
        </span>

        {evento.informe && esTurno && (
          <span className={styles.informePreview}>
            Informe: {evento.informe.tipo || 'Sin tipo'}
            {evento.informe.estado ? ` · ${evento.informe.estado}` : ''}
          </span>
        )}
      </span>
    </button>
  )
}

export const HistorialPaciente = ({ pacienteId }: HistorialPacienteProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [filtros, setFiltros] = useState<HistorialFiltros>(FILTROS_INICIALES)
  const [futurosExpandidos, setFuturosExpandidos] = useState(false)
  const [mesesColapsados, setMesesColapsados] = useState<Set<string>>(
    () => new Set()
  )
  const [popover, setPopover] = useState<{
    evento: HistorialEvento
    rect: DOMRect
  } | null>(null)

  const { data, isLoading, isError } = useHistorialPaciente(pacienteId, filtros)

  const grupos = useMemo(() => {
    const eventos = data?.historial.items ?? []
    const mapa = new Map<
      string,
      { key: string; label: string; eventos: HistorialEvento[] }
    >()

    eventos.forEach((evento) => {
      const fecha = fechaEvento(evento)
      const key = format(fecha, 'yyyy-MM')
      const label = format(fecha, "MMMM 'de' yyyy", { locale: es })
      const labelCapitalized = label.charAt(0).toUpperCase() + label.slice(1)

      if (!mapa.has(key)) {
        mapa.set(key, { key, label: labelCapitalized, eventos: [] })
      }

      mapa.get(key)?.eventos.push(evento)
    })

    return Array.from(mapa.values())
  }, [data])

  const proximosTurnos = data?.proximosTurnos ?? []

  const handleFiltrosChange = (cambios: Partial<HistorialFiltros>) => {
    setFiltros((prev) => ({ ...prev, ...cambios, page: 1 }))
  }

  const handleClearFiltros = () => {
    setFiltros((prev) => ({ ...FILTROS_INICIALES, pageSize: prev.pageSize }))
  }

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({ ...prev, page }))
  }

  const scrollAlMes = (key: string) => {
    const seccion = containerRef.current?.querySelector<HTMLElement>(
      `[data-mes-key="${key}"]`
    )
    if (!seccion) return

    let scroller = seccion.parentElement
    while (scroller) {
      const overflowY = getComputedStyle(scroller).overflowY
      if (overflowY === 'auto' || overflowY === 'scroll') break
      scroller = scroller.parentElement
    }

    if (!scroller) {
      seccion.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    const offset = 16
    const top =
      scroller.scrollTop +
      seccion.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top -
      offset

    scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  const toggleMes = (key: string) => {
    const seVaAAbrir = mesesColapsados.has(key)

    setMesesColapsados((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })

    if (!seVaAAbrir) return

    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollAlMes(key))
    })
  }

  const handleEventoClick = (evento: HistorialEvento, element: HTMLElement) => {
    setPopover((prev) => {
      const esElMismo =
        prev !== null && claveEvento(prev.evento) === claveEvento(evento)

      return esElMismo
        ? null
        : { evento, rect: element.getBoundingClientRect() }
    })
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <HistorialFilters
        filtros={filtros}
        onChange={handleFiltrosChange}
        onClear={handleClearFiltros}
      />

      {isLoading ? (
        <div className={styles.state}>
          <div className={styles.spinner} />
          <p>Cargando historial...</p>
        </div>
      ) : isError ? (
        <div className={styles.state}>
          <History size={40} className={styles.stateIcon} />
          <p>No se pudo cargar el historial del paciente.</p>
        </div>
      ) : (
        <>
          <section className={styles.futurosCard}>
            <button
              type="button"
              className={styles.futurosHeader}
              onClick={() => setFuturosExpandidos((prev) => !prev)}
              aria-expanded={futurosExpandidos}
              disabled={proximosTurnos.length === 0}
            >
              <span className={styles.futurosTitle}>
                <CalendarClock size={18} />
                Próximos turnos
                <span className={styles.countBadge}>
                  {proximosTurnos.length}
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`${styles.chevron} ${
                  futurosExpandidos ? styles.chevronOpen : ''
                }`}
              />
            </button>

            {futurosExpandidos && proximosTurnos.length > 0 && (
              <div className={styles.futurosList}>
                {proximosTurnos.map((evento) => (
                  <EventoCard
                    key={claveEvento(evento)}
                    evento={evento}
                    onClick={() => setEventoSeleccionado(evento)}
                  />
                ))}
              </div>
            )}

            {proximosTurnos.length === 0 && (
              <p className={styles.futurosEmpty}>Sin turnos próximos.</p>
            )}
          </section>

          {grupos.length === 0 ? (
            <div className={styles.state}>
              <History size={40} className={styles.stateIcon} />
              <p>No hay eventos para los filtros seleccionados.</p>
            </div>
          ) : (
            grupos.map((grupo) => {
              const colapsado = mesesColapsados.has(grupo.key)

              return (
                <section
                  key={grupo.key}
                  className={styles.mesGroup}
                  data-mes-key={grupo.key}
                >
                  <h3 className={styles.mesHeading}>
                    <button
                      type="button"
                      className={styles.mesToggle}
                      onClick={() => toggleMes(grupo.key)}
                      aria-expanded={!colapsado}
                    >
                      <ChevronDown
                        size={16}
                        className={`${styles.chevron} ${
                          colapsado ? '' : styles.chevronOpen
                        }`}
                      />
                      <span className={styles.mesLabel}>{grupo.label}</span>
                      <span className={styles.mesCount}>
                        {grupo.eventos.length}
                      </span>
                    </button>
                  </h3>

                  {!colapsado && (
                    <ol className={styles.timeline}>
                      {grupo.eventos.map((evento) => (
                        <li
                          key={claveEvento(evento)}
                          className={styles.timelineItem}
                        >
                          <span
                            className={`${styles.dot} ${
                              evento.turno ? '' : styles.dotInforme
                            }`}
                            aria-hidden="true"
                          />
                          <EventoCard
                            evento={evento}
                            onClick={(element) =>
                              handleEventoClick(evento, element)
                            }
                          />
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              )
            })
          )}

          {data && (
            <Pagination
              currentPage={data.historial.page}
              totalPages={data.historial.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {popover && (
        <HistorialEventoPopover
          evento={popover.evento}
          anchorRect={popover.rect}
          onClose={() => setPopover(null)}
        />
      )}
    </div>
  )
}
