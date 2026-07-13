import React, { InputHTMLAttributes } from 'react'
import styles from './InputField.module.css'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {/* Espacio preparado para mostrar errores futuros */}
      <div className={styles.errorContainer}>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    </div>
  )
}
