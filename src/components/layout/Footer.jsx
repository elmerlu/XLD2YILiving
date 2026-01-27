import styles from './Footer.module.css'
import logoHeaderIcon from '../../assets/logo-header.png'
import logoFooter from '../../assets/logo.png'
import { Facebook, Link as LinkIcon, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logoWrapper}>
                            <div className={styles.logoRow}>
                                <img src={logoFooter} alt="Logo" style={{ height: '30px', objectFit: 'contain' }} />
                                <img src={logoHeaderIcon} alt="LOGO-HEADER" style={{ height: '18px', objectFit: 'contain', marginLeft: '0.5rem' }} />
                            </div>
                            <h3 className={styles.siteTitle}>興隆募知募資</h3>
                            <p className={styles.slogan}>共創美好社區生活</p>
                        </Link>
                    </div>

                    <div className={styles.links}>
                        <h4>網站導覽</h4>
                        <Link to="/stories">地方生活故事圖</Link>
                        <Link to="/guide">機智生活急救包</Link>
                        <Link to="/funding">募知募資</Link>
                    </div>

                    <div className={styles.external}>
                        <h4>相關連結</h4>
                        <a href="https://linktr.ee/xinglongpages" target="_blank" rel="noopener noreferrer">
                            <LinkIcon size={16} style={{ marginRight: '5px' }} /> linktr.ee
                        </a>
                        <a href="https://www.facebook.com/xinglongph2" target="_blank" rel="noopener noreferrer">
                            <Facebook size={16} style={{ marginRight: '5px' }} /> FaceBook
                        </a>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSc5bCtiYOH_fUo1wFjGcPfaEFR_1dMRoqkpXC4Gpa4uHVJI8Q/viewform?usp=send_form" target="_blank" rel="noopener noreferrer">
                            <Edit size={16} style={{ marginRight: '5px' }} /> 我要投稿
                        </a>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Xinglong D2 Youth Innovators Living. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
