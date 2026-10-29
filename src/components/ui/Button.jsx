import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    fullWidth = false,
    href,
    to,
    ...props
}, ref) => {
    const rootClassName = `
    ${styles.button} 
    ${styles[variant]} 
    ${styles[size]} 
    ${fullWidth ? styles.fullWidth : ''} 
    ${className}
  `.trim()

    if (to) {
        return (
            <Link to={to} className={rootClassName} ref={ref} {...props}>
                {children}
            </Link>
        )
    }

    if (href) {
        return (
            <a href={href} className={rootClassName} ref={ref} {...props}>
                {children}
            </a>
        )
    }

    return (
        <button className={rootClassName} ref={ref} {...props}>
            {children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
