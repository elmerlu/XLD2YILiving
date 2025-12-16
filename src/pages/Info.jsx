import styles from './Info.module.css'
import Card from '../components/ui/Card'
import { FileText, Info as InfoIcon, HelpCircle } from 'lucide-react'

const Info = () => {
    return (
        <div className="container">
            <div className={styles.header}>
                <h1 className={styles.title}>資訊公告</h1>
                <p className={styles.subtitle}>計畫相關辦法與常見問答</p>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}><InfoIcon className={styles.icon} /> 最新公告</h2>
                    <Card className={styles.card}>
                        <ul className={styles.list}>
                            <li>
                                <span className={styles.date}>2025-01-01</span>
                                <span className={styles.itemTitle}>114年度青年創新回饋計畫 徵件開始</span>
                            </li>
                            <li>
                                <span className={styles.date}>2024-12-25</span>
                                <span className={styles.itemTitle}>D2區 公共區域使用規範更新說明</span>
                            </li>
                            <li>
                                <span className={styles.date}>2024-12-10</span>
                                <span className={styles.itemTitle}>社宅年度消防演練通知</span>
                            </li>
                        </ul>
                    </Card>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}><FileText className={styles.icon} /> 下載專區</h2>
                    <div className={styles.grid}>
                        <Card interactive className={styles.downloadCard}>
                            <h3>計畫申請書.pdf</h3>
                            <p>申請 114 年度計畫專用表格</p>
                        </Card>
                        <Card interactive className={styles.downloadCard}>
                            <h3>活動成果報告書.docx</h3>
                            <p>活動結束後請填寫此單繳交</p>
                        </Card>
                        <Card interactive className={styles.downloadCard}>
                            <h3>場地借用申請表.pdf</h3>
                            <p>借用公共空間請填寫此單</p>
                        </Card>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}><HelpCircle className={styles.icon} /> 常見問答</h2>
                    <div className={styles.faq}>
                        <details className={styles.details}>
                            <summary>如何申請加入青年創新回饋計畫？</summary>
                            <p>請參考下載專區的申請書，填寫完備後於公告期間內寄至專案信箱，我們將安排面談審核。</p>
                        </details>
                        <details className={styles.details}>
                            <summary>每個月有最低服務時數要求嗎？</summary>
                            <p>是的，依照入住合約規定，每戶每月需提供至少 4 小時的社區回饋服務時數。</p>
                        </details>
                        <details className={styles.details}>
                            <summary>可以跨區舉辦活動嗎？</summary>
                            <p>原則上以 D2 區為主，若有跨區合作需求，需提前提出專案申請進行審核。</p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info
