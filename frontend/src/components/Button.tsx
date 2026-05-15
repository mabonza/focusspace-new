import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'gold'
  href?: string
  to?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-600 border-2 border-primary',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent',
  gold: 'bg-gold text-white hover:bg-gold-dark border-2 border-gold',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  href,
  to,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  size = 'md',
}: ButtonProps) {
  const base = `inline-flex items-center gap-2 font-semibold rounded-sm tracking-wide transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`

  if (to) {
    return (
      <Link to={to} className={base}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={base} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={base}>
      {children}
    </button>
  )
}
