import styles from './Card.module.css'

const Card = ({
    children,
    variant = 'default', // default, glass
    interactive = false,
    padding = 'md', // none, sm, md, lg
    className = '',
    onClick,
    ...props
}) => {
    return (
        <div
            className={`
        ${styles.card} 
        ${variant === 'glass' ? styles.glass : ''} 
        ${interactive ? styles.interactive : ''}
        ${styles[`padding-${padding}`]}
        ${className}
      `.trim()}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer' } : {}}
            {...props}
        >
            {children}
        </div>
    )
}

export default Card
