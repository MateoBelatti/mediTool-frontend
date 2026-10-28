import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../../validations/auth.schema'
import { useAuth } from '../../hooks/useAuth'
import { InputField } from '../InputField/InputField'
import { Button } from '../Button/Button'
import styles from './LoginForm.module.css'

export const LoginForm: React.FC = () => {
  const { login, isLoggingIn, loginError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Iniciar sesión</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <InputField
          label="Email"
          type="email"
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className={styles.passwordWrapper}>
          <InputField
            label="Contraseña"
            type="password"
            placeholder="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          <a href="#" className={styles.forgotPassword}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {loginError && (
          <div className={styles.errorContainer}>
            <span className={styles.errorMessage}>
              Credenciales inválidas o error en el servidor.
            </span>
          </div>
        )}

        <div className={styles.actionContainer}>
          <Button type="submit" fullWidth disabled={isLoggingIn}>
            {isLoggingIn ? 'Iniciando sesión...' : 'Ingresar'}
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
