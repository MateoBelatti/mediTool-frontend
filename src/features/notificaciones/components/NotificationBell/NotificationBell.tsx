import React, { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Inbox, Loader2 } from 'lucide-react'
import {
  useNotificacionesCount,
  useNotificaciones,
  useMarcarComoLeida,
  useMarcarTodasComoLeidas,
} from '../../hooks/useNotificaciones'
import { NotificationItem } from '../NotificationItem/NotificationItem'
import styles from './NotificationBell.module.css'

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'todas' | 'no-leidas'>('no-leidas')
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: unreadCount = 0 } = useNotificacionesCount()
  const { data: notificacionesData, isLoading } = useNotificaciones({
    soloNoLeidas: activeTab === 'no-leidas' ? true : undefined,
    pageSize: 50,
  })

  const marcarComoLeidaMutation = useMarcarComoLeida()
  const marcarTodasMutation = useMarcarTodasComoLeidas()

  // Cierre al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const handleMarkAsRead = (id: number) => {
    marcarComoLeidaMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0 && !marcarTodasMutation.isPending) {
      marcarTodasMutation.mutate()
    }
  }

  const notificaciones = notificacionesData?.items || []

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={`${styles.bellButton} ${isOpen ? styles.active : ''}`}
        onClick={toggleOpen}
        aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} no leídas)` : ''}`}
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.popover} role="dialog" aria-modal="true">
          <div className={styles.popoverHeader}>
            <div className={styles.headerTitleWrapper}>
              <h3 className={styles.headerTitle}>Notificaciones</h3>
              {unreadCount > 0 && (
                <span className={styles.unreadCountBadge}>
                  {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <button
              type="button"
              className={styles.markAllButton}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || marcarTodasMutation.isPending}
              title="Marcar todas como leídas"
            >
              <CheckCheck size={15} />
              <span>Marcar todas</span>
            </button>
          </div>

          <div className={styles.tabsContainer}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'todas' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('todas')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'no-leidas' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('no-leidas')}
            >
              No leídas {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          </div>

          <div className={styles.listContainer}>
            {isLoading ? (
              <div className={styles.loadingWrapper}>
                <Loader2 size={20} className="animate-spin" />
                <span>Cargando notificaciones...</span>
              </div>
            ) : notificaciones.length === 0 ? (
              <div className={styles.emptyState}>
                <Inbox size={36} className={styles.emptyIcon} />
                <p className={styles.emptyText}>
                  {activeTab === 'no-leidas'
                    ? 'No tenés notificaciones sin leer'
                    : 'No tenés notificaciones'}
                </p>
                <p className={styles.emptySubtext}>
                  Te avisaremos cuando haya novedades importantes
                </p>
              </div>
            ) : (
              notificaciones.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notificacion={notif}
                  onMarkAsRead={handleMarkAsRead}
                  onClosePopover={() => setIsOpen(false)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
