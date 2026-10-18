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

    // 一開始就顯示紀錄裡的文章，不用等 API（若帶有 ?error=1 則強制模擬失敗畫面）
    const [articles, setArticles] = useState(isForcedError ? [] : staticArticles)
    const [loading, setLoading] = useState(isForcedError ? false : staticArticles.length === 0)
    const [error, setError] = useState(isForcedError)

    useEffect(() => {
        if (isForcedError) return

        // 背景依序嘗試各來源；全部失敗也沒關係，畫面保留紀錄內容（只差最新文章無法即時顯示）
        fetchMediumArticles({
            timeoutMs: 10000,
            onLog: (name, ok, detail) => console.info(`[Medium 同步] ${ok ? '✅' : '❌'} ${name}：${detail}`),
        })
            .then(({ articles: live }) => setArticles((prev) => mergeArticles(prev, live)))
            .catch((err) => {
                console.warn('[Medium 同步] 全部來源失敗，改用已儲存紀錄：', err.message)
                // 只有連紀錄都沒有時，才顯示錯誤畫面
                if (staticArticles.length === 0) setError(true)
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

                <MoreButton label="前往 Medium 閱讀更多故事" />

                {loading ? (
                    <div className={styles.loading}>
                        <RefreshCw className="animate-spin" size={40} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                        <p>正在從 Medium 同步最新文章...</p>
                    </div>
                ) : error ? (
                    <div className={styles.error}>
                        <AlertCircle size={48} className={styles.errorTitle} />
                        <h3 className={styles.errorTitle}>文章同步暫時受阻</h3>
                        <p>由於外圍連線或 API 限制，暫時無法即時取得最新文章列表。</p>
                        <p style={{ marginTop: '0.5rem', color: 'var(--color-text-main)', fontWeight: '500' }}>
                            想閱讀最新發表的故事與即時紀實，歡迎直接前往我們的專欄頻道：
                        </p>
                        <a
                            href={MEDIUM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.externalLink}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}
                        >
                            前往 Medium 頻道觀看最新文章 <ExternalLink size={16} />
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
                                    {/* 摘要已是純文字，不再需要 dangerouslySetInnerHTML */}
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

                {!loading && !error && articles.length > 0 && (
                    <MoreButton label="深度探索更多社區故事" />
                )}
            </div>
        </div>
    )
}

export default Stories
