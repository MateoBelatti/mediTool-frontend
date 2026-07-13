import React, { useState } from 'react'
import { InputField } from '../InputField/InputField'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'

export const LoginForm: React.FC = () => {
  // Estados básicos para los inputs (preparando el terreno para la lógica)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de autenticación en el futuro
    console.log('Login attempt', { username, password })
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <InputField
          label="Usuario"
          type="text"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className={styles.passwordWrapper}>
          <InputField
            label="Contraseña"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <a href="#" className={styles.forgotPassword}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <div className={styles.actionContainer}>
          <Button type="submit" fullWidth>
            Ingresar
          </Button>
        </div>
      </form>

      <p className={styles.footerText}>
        ¿No tienes una cuenta?{' '}
        <a href="#" className={styles.signupLink}>
          Regístrate
        </a>
      </p>
    </div>
  )
}
