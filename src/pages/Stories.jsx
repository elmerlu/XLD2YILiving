import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import styles from './Stories.module.css'

const Stories = () => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const MEDIUM_URL = 'https://medium.com/@xinglongphd2'
    const RSS_API = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@xinglongphd2`

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await fetch(RSS_API)
            const data = await response.json()
            if (data.status === 'ok') {
                setArticles(data.items.slice(0, 10))
            } else {
                throw new Error('RSS conversion failed')
            }
        } catch (err) {
            console.error('Failed to fetch Medium articles:', err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const MoreButton = ({ label }) => (
        <div className={styles.moreButtonContainer}>
            <a
                href={MEDIUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.moreButton}
            >
                {label} <ExternalLink size={18} />
            </a>
        </div>
    )

    return (
        <div className="container">
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>地方生活故事圖</h1>
                    <p className={styles.subtitle}>
                        匯集興隆社宅居民的點滴故事、生活經驗與社區觀察。
                        透過文字，我們記錄下這座有機建築中的真實溫度。
                    </p>
                </header>

                <MoreButton label="前往 Medium 閱讀更多故事" />

                {loading ? (
                    <div className={styles.loading}>
                        <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                        <p>正在從 Medium 同步最新文章...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <AlertCircle size={48} className={styles.errorTitle} />
                        <h3 className={styles.errorTitle}>內容同步暫時受阻</h3>
                        <p>很抱歉，目前無法直接顯示 Medium 文章列表。</p>
                        <p>這可能是由於網路連線、API 限制或 Medium 伺服器忙碌中。</p>
                        <a
                            href={MEDIUM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            點此直接前往興隆社宅 Medium 頻道 ➔
                        </a>
                    </div>
                ) : articles.length === 0 ? (
                    <div className={styles.error}>
                        <h3 className={styles.errorTitle}>目前尚無文章</h3>
                        <p>Medium 頻道上還沒有發布任何文章，歡迎稍後再過來看看！</p>
                        <a
                            href={MEDIUM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                        >
                            前往 Medium 頻道關注原始內容 ➔
                        </a>
                    </div>
                ) : (
                    <div className={styles.feed}>
                        {articles.map((article, index) => (
                            <a
                                key={index}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.card}
                            >
                                <img
                                    src={article.thumbnail || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop'}
                                    alt={article.title}
                                    className={styles.thumbnail}
                                />
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>{article.title}</h2>
                                    <div
                                        className={styles.excerpt}
                                        dangerouslySetInnerHTML={{
                                            __html: article.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'
                                        }}
                                    />
                                    <div className={styles.cardFooter}>
                                        <span>閱讀更多 ➔</span>
                                        <span>{new Date(article.pubDate).toLocaleDateString('zh-TW')}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {!loading && !error && articles.length > 0 && (
                    <MoreButton label="深度探索更多社區故事" />
                )}
            </div>
        </div>
    )
}

export default Stories
