import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

const NotFound = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.description}>哎呀！找不到這個頁面。</p>
            <p className={styles.subtext}>這可能是因為網址輸入錯誤，或是該頁面已經被移除了。</p>
            <Link to="/" className={styles.homeButton}>
                回首頁
            </Link>
        </div>
    )
}

export default NotFound
