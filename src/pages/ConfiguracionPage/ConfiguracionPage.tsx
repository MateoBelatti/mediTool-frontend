import { Bell, Palette, Settings, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './ConfiguracionPage.module.css'

interface SeccionConfiguracion {
  icon: LucideIcon
  titulo: string
  descripcion: string
}

const SECCIONES: SeccionConfiguracion[] = [
  {
    icon: Palette,
    titulo: 'Apariencia',
    descripcion: 'Tema, colores y preferencias visuales.',
  },
  {
    icon: Bell,
    titulo: 'Notificaciones',
    descripcion: 'Alertas de turnos, asistencia y recordatorios.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Seguridad',
    descripcion: 'Contraseña y acceso a tu cuenta.',
  },
]

export const ConfiguracionPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Configuración</h1>
          <p className={styles.subtitle}>
            Administrá las preferencias de tu cuenta
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.placeholder}>
          <Settings size={28} className={styles.placeholderIcon} />
          <h2>Próximamente</h2>
          <p>
            Estamos trabajando en las opciones de configuración de MediTool.
          </p>
        </div>

        <ul className={styles.list}>
          {SECCIONES.map(({ icon: Icon, titulo, descripcion }) => (
            <li key={titulo} className={styles.item}>
              <Icon size={20} className={styles.itemIcon} />
              <div className={styles.itemInfo}>
                <span className={styles.itemTitle}>{titulo}</span>
                <span className={styles.itemDescription}>{descripcion}</span>
              </div>
              <span className={styles.itemBadge}>Próximamente</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
