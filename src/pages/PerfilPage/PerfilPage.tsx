import {
  User,
  Mail,
  Phone,
  Stethoscope,
  Award,
  FileText,
  Shield,
} from 'lucide-react'
import { useAuth, ROLES } from '@/features/auth/hooks/useAuth'
import { useProfesionales } from '@/features/pacientes/hooks/useProfesionales'
import styles from './PerfilPage.module.css'

export const PerfilPage = () => {
  const { user } = useAuth()
  const profesionalId = user?.id ? parseInt(user.id) : undefined
  const { profesional, isLoading, error } = useProfesionales(profesionalId)

  const isAdmin = user?.role === ROLES.ADMIN

  if (isLoading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Cargando información del perfil...</p>
        </div>
      </div>
    )
  }

  if (error || !profesional) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorContainer}>
          <p>No se pudo cargar la información del perfil.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Mi Perfil</h1>
          <p className={styles.subtitle}>
            Información personal y profesional de tu cuenta
          </p>
        </div>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <User size={38} />
          </div>
          <div className={styles.avatarInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>
                {profesional.nombre} {profesional.apellido}
              </h2>
              <span className={isAdmin ? styles.adminBadge : styles.roleBadge}>
                <Shield size={14} />
                {isAdmin ? 'Administrador' : 'Profesional'}
              </span>
            </div>
            <p className={styles.prestacionText}>
              {profesional.prestacion || 'Profesional de la salud'}
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGroup}>
            <h3 className={styles.groupTitle}>Datos Profesionales</h3>
            <div className={styles.groupGrid}>
              <div className={styles.infoItem}>
                <div className={styles.itemHeader}>
                  <Award size={16} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>Matrícula</span>
                </div>
                <p className={styles.itemValue}>
                  {profesional.matricula || 'No registrada'}
                </p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.itemHeader}>
                  <Stethoscope size={16} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>
                    Especialidad / Prestación
                  </span>
                </div>
                <p className={styles.itemValue}>
                  {profesional.prestacion || 'No registrada'}
                </p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.itemHeader}>
                  <FileText size={16} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>
                    Registro de Prestadores
                  </span>
                </div>
                <p className={styles.itemValue}>
                  {profesional.registroPrestadores || 'No registrado'}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.infoGroup}>
            <h3 className={styles.groupTitle}>Datos de Contacto</h3>
            <div className={styles.groupGrid}>
              <div className={styles.infoItem}>
                <div className={styles.itemHeader}>
                  <Mail size={16} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>Correo electrónico</span>
                </div>
                <p className={styles.itemValue}>
                  {profesional.email || user?.email || 'No registrado'}
                </p>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.itemHeader}>
                  <Phone size={16} className={styles.itemIcon} />
                  <span className={styles.itemLabel}>Teléfono</span>
                </div>
                <p className={styles.itemValue}>
                  {profesional.telefono || 'No registrado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
