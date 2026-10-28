import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../features/auth/components/LoginForm/LoginForm'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './LoginPage.module.css'

export const LoginPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        {/* Lado izquierdo: Imagen / Ilustración */}
        <div className={styles.imageSection}>
          <div className={styles.imageOverlay}>
            <h1 className={styles.imageTitle}>WELCOME</h1>
          </div>
          {/* Usamos un div con background en CSS, o un img tag. Por ahora será manejado via CSS para replicar la estructura. */}
        </div>

        {/* Lado derecho: Formulario de Login */}
        <div className={styles.formSection}>
          <div className={styles.logoPlaceholder}>
            {/* Logo placeholder - podría ser un SVG o imagen real */}
            <div className={styles.logoCircle}></div>
            <span className={styles.logoText}>MediTool</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
