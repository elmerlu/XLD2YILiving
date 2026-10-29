import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import styles from './Stories.module.css'
// 已同步過的文章紀錄（寫死在專案裡），由 `npm run sync:medium` 產生與比對
import staticArticles from '../data/mediumArticles.json'
// 多重來源同步：rss2json 主力，allorigins 備援
import { MEDIUM_URL, fetchMediumArticles, mergeArticles } from '../utils/mediumFeed'
import fallbackThumb from '../assets/story-placeholder.jpg'

const FALLBACK_THUMB = fallbackThumb

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
    // 一律預設載入自己備份同步的資料，保證隨時有內容可讀
    const [articles, setArticles] = useState(staticArticles)
    const [loading, setLoading] = useState(staticArticles.length === 0)
    
    // 同步狀態：'syncing'（第一階段） | 'success'（第二階段-1） | 'error'（第二階段-2） | 'hidden'（關閉）
    const [syncStatus, setSyncStatus] = useState('syncing')
    const [countdown, setCountdown] = useState(null)

    useEffect(() => {
        // 背景依序嘗試各來源；完成後進入成功或失敗狀態
        fetchMediumArticles({
            timeoutMs: 10000,
            onLog: (name, ok, detail) => console.info(`[Medium 同步] ${ok ? '✅' : '❌'} ${name}：${detail}`),
        })
            .then(({ articles: live }) => {
                setArticles((prev) => mergeArticles(prev, live))
                setSyncStatus('success')
                setCountdown(6)
            })
            .catch((err) => {
                console.warn('[Medium 同步] 全部即時來源失敗，改用已儲存紀錄：', err.message)
                setSyncStatus('error')
                setCountdown(12)
            })
            .finally(() => setLoading(false))
    }, [])

    // 倒數計時器（秒數倒數，歸零時關閉提示）
    useEffect(() => {
        if (countdown === null || countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    setSyncStatus('hidden')
                    return null
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

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

                {/* 同步狀態提示列（置於專欄導引區上方，支援三階段：同步中、同步成功、同步失敗） */}
                {syncStatus !== 'hidden' && (
                    <div className={styles.syncBannerWrapper}>
                        <div
                            className={`${styles.syncBanner} ${
                                syncStatus === 'syncing'
                                    ? styles.bannerSyncing
                                    : syncStatus === 'success'
                                    ? styles.bannerSuccess
                                    : styles.bannerError
                            }`}
                        >
                            <div className={styles.bannerContent}>
                                {syncStatus === 'syncing' && (
                                    <>
                                        <RefreshCw size={18} className={styles.spinIcon} />
                                        <span className={styles.bannerText}>最新文章同步中</span>
                                    </>
                                )}
                                {syncStatus === 'success' && (
                                    <>
                                        <CheckCircle2 size={18} className={styles.bannerIconSuccess} />
                                        <span className={styles.bannerText}>同步成功</span>
                                    </>
                                )}
                                {syncStatus === 'error' && (
                                    <>
                                        <AlertCircle size={18} className={styles.bannerIconError} />
                                        <span className={styles.bannerText}>同步失敗</span>
                                    </>
                                )}
                            </div>

                            {/* 倒數計時紅圈圈（成功 6 秒 / 失敗 12 秒，不帶 S，點擊可立即關閉） */}
                            {countdown !== null && (
                                <button
                                    type="button"
                                    className={styles.redCircleBadge}
                                    onClick={() => {
                                        setSyncStatus('hidden')
                                        setCountdown(null)
                                    }}
                                    title="點擊立即關閉"
                                    aria-label="點擊關閉提示"
                                >
                                    <span key={countdown} className={styles.countdownNumber}>
                                        {countdown}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 固定於頁面上的專欄頻道導引區（永遠顯示） */}
                <div className={styles.channelGuideContainer}>
                    <p className={styles.channelGuideText}>
                        想閱讀最新發表的故事與即時紀實，歡迎直接前往我們的專欄頻道：
                    </p>
                    <MoreButton label="前往 Medium 閱讀更多故事" />
                </div>

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
                        {articles.map((article) => (
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
