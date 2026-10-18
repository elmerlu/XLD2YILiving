import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExternalLink, RefreshCw, AlertCircle } from 'lucide-react'
import styles from './Stories.module.css'
// 已同步過的文章紀錄（寫死在專案裡），由 `npm run sync:medium` 產生與比對
import staticArticles from '../data/mediumArticles.json'
// 多重來源同步：rss2json 主力，allorigins 備援
import { MEDIUM_URL, fetchMediumArticles, mergeArticles } from '../utils/mediumFeed'

const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop'

/** 前往 Medium 的按鈕（放在元件外，避免每次 render 重建） */
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

const Stories = () => {
    const [searchParams] = useSearchParams()
    const isForcedError = searchParams.get('error') === '1' || searchParams.get('preview') === 'error'

    // 一律預設載入自己備份同步的資料，保證隨時有內容可讀
    const [articles, setArticles] = useState(staticArticles)
    const [loading, setLoading] = useState(isForcedError ? false : staticArticles.length === 0)
    const [error, setError] = useState(isForcedError)

    useEffect(() => {
        if (isForcedError) return

        // 背景依序嘗試各來源；若全部失敗，標記 error 顯示通知，畫面仍保留備份資料
        fetchMediumArticles({
            timeoutMs: 10000,
            onLog: (name, ok, detail) => console.info(`[Medium 同步] ${ok ? '✅' : '❌'} ${name}：${detail}`),
        })
            .then(({ articles: live }) => {
                setArticles((prev) => mergeArticles(prev, live))
                setError(false)
            })
            .catch((err) => {
                console.warn('[Medium 同步] 全部即時來源失敗，改用已儲存紀錄：', err.message)
                setError(true)
            })
            .finally(() => setLoading(false))
    }, [isForcedError])

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

                {!error && <MoreButton label="前往 Medium 閱讀更多故事" />}

                {/* 當同步失敗時，上方顯示引導專欄頻道的提示區塊 */}
                {error && (
                    <div className={styles.syncNoticeCard}>
                        <div className={styles.noticeHeader}>
                            <AlertCircle size={28} className={styles.noticeIcon} />
                            <h3 className={styles.noticeTitle}>最新文章同步失敗</h3>
                        </div>
                        <p className={styles.noticeText}>
                            想閱讀最新發表的故事與即時紀實，歡迎直接前往我們的專欄頻道：
                        </p>
                        <a
                            href={MEDIUM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.noticeLink}
                        >
                            前往 Medium 閱讀更多故事 <ExternalLink size={16} />
                        </a>
                    </div>
                )}

                {loading ? (
                    <div className={styles.loading}>
                        <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                        <p>正在從 Medium 同步最新文章...</p>
                    </div>
                ) : articles.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3 className={styles.emptyTitle}>目前尚無文章</h3>
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
                    /* 下方區塊接上備份同步的資料 */
                    <div className={styles.feed}>
                        {articles.slice(0, 10).map((article) => (
                            <a
                                key={article.id}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.card}
                            >
                                <img
                                    src={article.thumbnail || FALLBACK_THUMB}
                                    alt={article.title}
                                    className={styles.thumbnail}
                                />
                                <div className={styles.cardContent}>
                                    <h2 className={styles.cardTitle}>{article.title}</h2>
                                    <div className={styles.excerpt}>{article.excerpt}</div>
                                    <div className={styles.cardFooter}>
                                        <span>閱讀更多 ➔</span>
                                        <span>{new Date(article.pubDate).toLocaleDateString('zh-TW')}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {!loading && articles.length > 0 && (
                    <MoreButton label="深度探索更多社區故事" />
                )}
            </div>
        </div>
    )
}

export default Stories
