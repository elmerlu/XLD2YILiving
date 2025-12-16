import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'
import { Menu, X } from 'lucide-react'
import logoHeaderIcon from '../../assets/logo-header.png'
import logo from '../../assets/logo.png'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const location = useLocation()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false)
    }, [location])

    const navItems = [
        { label: '首頁', path: '/' },
        { label: '地方生活故事圖', path: '/stories' },
        { label: '機智生活急救包', path: '/guide' },
        { label: '募知募資是什麼', path: '/funding' },
    ]

    const isActive = (path) => location.pathname === path

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src={logo} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                    <img src={logoHeaderIcon} alt="LOGO-HEADER" style={{ height: '24px', objectFit: 'contain', marginLeft: '0.5rem', marginRight: '0.5rem' }} />
                    <h3 className={styles.siteTitle}>興隆募知募資</h3>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.navDesktop}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navLink} ${isActive(item.path) ? styles.active : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={styles.menuButton}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Navigation */}
                <nav className={`${styles.mobileMenu} ${isMobileOpen ? styles.open : ''}`}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={styles.mobileLink}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}

export default Header
