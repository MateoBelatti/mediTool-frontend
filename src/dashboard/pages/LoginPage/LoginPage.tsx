import React from 'react'
import { LoginForm } from '../../../features/auth/components/LoginForm/LoginForm'
import styles from './LoginPage.module.css'

export const LoginPage: React.FC = () => {
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
