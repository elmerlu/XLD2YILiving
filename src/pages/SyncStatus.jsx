/**
 * SyncStatus.jsx —— Medium 同步狀態（內部工程頁，不對外）
 * ------------------------------------------------------------
 * 路由：/sync-status（跟 /cropper 一樣，沒有放在任何選單或連結裡）
 *
 * 功能：
 *  1. 同步來源在線狀態：每個來源都實際打一次（瀏覽器環境，含 CORS 限制）
 *  2. 紀錄狀態表：mediumArticles.json 每篇文章 + 與即時資料的比對結果
 *  3. 摘要：紀錄篇數、待收錄、內容變動、最後同步時間、可用來源數
 * ------------------------------------------------------------
 */
import { useState, useEffect } from 'react'
import { RefreshCw, Database, Activity, Clock, ExternalLink, Terminal } from 'lucide-react'
import styles from './SyncStatus.module.css'
import records from '../data/mediumArticles.json'
import { SOURCES, MEDIUM_URL, probeSource, diffArticles } from '../utils/mediumFeed'

/* ---------- 小工具 ---------- */

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('zh-TW') : '—')
const fmtTime = (d) => (d ? d.toLocaleTimeString('zh-TW', { hour12: false }) : '—')

/** 幾天前（整數） */
const daysAgo = (iso) => (iso ? Math.floor((Date.now() - new Date(iso)) / 86400000) : null)

/** 超過幾天沒同步就提醒 */
const STALE_DAYS = 30

/** 前端實際會用的來源（排除 nodeOnly），用來標示備援順序 */
const BROWSER_ORDER = SOURCES.filter((s) => !s.nodeOnly).map((s) => s.name)

/** 比對狀態 → 顯示文字與樣式 */
const ROW_STATUS = {
    synced: { label: '一致', icon: '✅', cls: 'ok' },
    changed: { label: '內容有變動', icon: '✏️', cls: 'warn' },
    archived: { label: 'RSS 已無・紀錄保留', icon: '📦', cls: 'muted' },
    added: { label: '待收錄', icon: '🆕', cls: 'info' },
    unknown: { label: '無即時資料可比對', icon: '❔', cls: 'muted' },
}

/* ---------- 子元件 ---------- */

/** 在線燈號 */
const StatusDot = ({ state }) => <span className={`${styles.dot} ${styles[`dot_${state}`]}`} aria-hidden="true" />

/** 單一來源卡片 */
const SourceCard = ({ src, result }) => {
    const order = BROWSER_ORDER.indexOf(src.name)
    let state = 'checking'
    let label = '檢測中…'
    if (src.nodeOnly) {
        state = 'script'
        label = '僅腳本用'
    } else if (result) {
        state = result.ok ? 'online' : 'offline'
        label = result.ok ? '在線' : '離線'
    }

    return (
        <div className={`${styles.sourceCard} ${styles[`source_${state}`]}`}>
            <div className={styles.sourceHead}>
                <StatusDot state={state} />
                <span className={styles.sourceName}>{src.name}</span>
                <span className={styles.sourceOrder}>{order >= 0 ? `備援 #${order + 1}` : 'Node'}</span>
            </div>
            <div className={styles.sourceLabel}>{label}</div>
            <div className={styles.sourceMeta}>
                {src.nodeOnly ? (
                    <span>瀏覽器受 CORS 限制，由 npm run sync:medium 使用</span>
                ) : result ? (
                    result.ok ? (
                        <>
                            <span>{result.count} 篇</span>
                            <span>{result.ms} ms</span>
                        </>
                    ) : (
                        <span className={styles.sourceError}>{result.error}</span>
                    )
                ) : (
                    <span>等待回應</span>
                )}
            </div>
        </div>
    )
}

/** 摘要數字卡 */
const StatCard = ({ label, value, sub, tone = 'default' }) => (
    <div className={`${styles.stat} ${styles[`stat_${tone}`]}`}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
        {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
)

/* ---------- 主頁面 ---------- */

const SyncStatus = () => {
    const [results, setResults] = useState({}) // { [sourceName]: probeResult }
    const [checking, setChecking] = useState(true)
    const [checkedAt, setCheckedAt] = useState(null)

    /** 手動點擊重新檢測 */
    const runCheck = async () => {
        setChecking(true)
        setResults({})
        await Promise.all(
            SOURCES.filter((s) => !s.nodeOnly).map(async (src) => {
                const r = await probeSource(src, { timeoutMs: 15000 })
                setResults((prev) => ({ ...prev, [src.name]: r }))
            })
        )
        setCheckedAt(new Date())
        setChecking(false)
    }

    useEffect(() => {
        document.title = 'Medium 同步狀態｜內部工程頁'
        let cancelled = false
        const initialCheck = async () => {
            await Promise.all(
                SOURCES.filter((s) => !s.nodeOnly).map(async (src) => {
                    const r = await probeSource(src, { timeoutMs: 15000 })
                    if (!cancelled) {
                        setResults((prev) => ({ ...prev, [src.name]: r }))
                    }
                })
            )
            if (!cancelled) {
                setCheckedAt(new Date())
                setChecking(false)
            }
        }
        initialCheck()
        return () => { cancelled = true }
    }, [])

    /* ---- 推導資料 ---- */

    // 即時資料：依備援順序取第一個成功的來源
    const liveSource = BROWSER_ORDER.find((n) => results[n]?.ok)
    const live = liveSource ? results[liveSource].articles : null
    const { added, changed, archivedOnly } = live ? diffArticles(records, live) : { added: [], changed: [], archivedOnly: [] }

    const changedIds = new Set(changed.map((a) => a.id))
    const archivedIds = new Set(archivedOnly.map((a) => a.id))

    // 表格列：紀錄 + 待收錄（RSS 有但紀錄沒有），依發布日期新到舊
    const rows = [
        ...records.map((a) => ({
            ...a,
            status: !live ? 'unknown' : changedIds.has(a.id) ? 'changed' : archivedIds.has(a.id) ? 'archived' : 'synced',
        })),
        ...added.map((a) => ({ ...a, status: 'added' })),
    ].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

    // 最後同步時間 = 紀錄中最新的 lastSeenAt
    const lastSync = records.reduce((max, a) => (a.lastSeenAt && a.lastSeenAt > max ? a.lastSeenAt : max), '')
    const syncDays = daysAgo(lastSync)

    const browserTotal = BROWSER_ORDER.length
    const onlineCount = BROWSER_ORDER.filter((n) => results[n]?.ok).length
    const doneCount = BROWSER_ORDER.filter((n) => results[n]).length

    return (
        <div className={styles.page}>
            <div className={styles.inner}>
                {/* ===== 標題列 ===== */}
                <header className={styles.header}>
                    <div>
                        <span className={styles.badge}>INTERNAL・不對外</span>
                        <h1 className={styles.title}>Medium 同步狀態</h1>
                        <p className={styles.subtitle}>
                            紀錄檔 <code>src/data/mediumArticles.json</code> ×{' '}
                            <a href={MEDIUM_URL} target="_blank" rel="noopener noreferrer">
                                @xinglongphd2 <ExternalLink size={12} />
                            </a>
                        </p>
                    </div>
                    <div className={styles.headerActions}>
                        <span className={styles.checkedAt}>
                            <Clock size={14} /> 上次檢測 {fmtTime(checkedAt)}
                        </span>
                        <button id="sync-status-recheck" className={styles.recheck} onClick={runCheck} disabled={checking}>
                            <RefreshCw size={16} className={checking ? styles.spin : ''} />
                            {checking ? `檢測中 ${doneCount}/${browserTotal}` : '重新檢測'}
                        </button>
                    </div>
                </header>

                {/* ===== 摘要 ===== */}
                <section className={styles.stats}>
                    <StatCard label="紀錄篇數" value={records.length} sub="已寫死在專案中" />
                    <StatCard
                        label="RSS 即時篇數"
                        value={live ? live.length : '—'}
                        sub={liveSource ? `來源：${liveSource}` : checking ? '取得中…' : '所有來源皆失敗'}
                        tone={!live && !checking ? 'bad' : 'default'}
                    />
                    <StatCard
                        label="待收錄"
                        value={live ? added.length : '—'}
                        sub={added.length ? '請執行 npm run sync:medium' : '無'}
                        tone={added.length ? 'warn' : 'default'}
                    />
                    <StatCard
                        label="內容有變動"
                        value={live ? changed.length : '—'}
                        sub={changed.length ? '同步後會更新紀錄' : '無'}
                        tone={changed.length ? 'warn' : 'default'}
                    />
                    <StatCard
                        label="最後同步"
                        value={syncDays === null ? '—' : syncDays === 0 ? '今天' : `${syncDays} 天前`}
                        sub={lastSync ? fmtDate(lastSync) : '尚無紀錄'}
                        tone={syncDays !== null && syncDays > STALE_DAYS ? 'warn' : 'default'}
                    />
                    <StatCard
                        label="可用來源（瀏覽器）"
                        value={`${onlineCount} / ${browserTotal}`}
                        sub={checking ? '檢測中…' : onlineCount === 0 ? '前端將只顯示紀錄' : '前端可即時同步'}
                        tone={!checking && onlineCount === 0 ? 'bad' : onlineCount > 0 ? 'good' : 'default'}
                    />
                </section>

                {/* ===== 同步來源在線狀態 ===== */}
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>
                        <Activity size={18} /> 同步來源在線狀態
                    </h2>
                    <div className={styles.sources}>
                        {SOURCES.map((src) => (
                            <SourceCard key={src.name} src={src} result={results[src.name]} />
                        ))}
                    </div>
                    <p className={styles.note}>
                        ※ 此為「你目前這台瀏覽器」的檢測結果。前端依備援順序嘗試，第一個在線的來源會被採用。
                    </p>
                </section>

                {/* ===== 紀錄狀態表 ===== */}
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>
                        <Database size={18} /> 紀錄狀態
                        <span className={styles.panelCount}>{rows.length} 筆</span>
                    </h2>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>縮圖</th>
                                    <th>標題</th>
                                    <th>發布日期</th>
                                    <th>首次收錄</th>
                                    <th>最後出現在 RSS</th>
                                    <th>分類</th>
                                    <th>比對狀態</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((a, i) => {
                                    const st = ROW_STATUS[a.status]
                                    return (
                                        <tr key={a.id} className={a.status === 'added' ? styles.rowAdded : ''}>
                                            <td className={styles.num}>{i + 1}</td>
                                            <td>
                                                {a.thumbnail ? (
                                                    <img src={a.thumbnail} alt="" className={styles.thumb} loading="lazy" />
                                                ) : (
                                                    <span className={styles.noThumb}>無圖</span>
                                                )}
                                            </td>
                                            <td className={styles.titleCell}>
                                                <a href={a.link} target="_blank" rel="noopener noreferrer">
                                                    {a.title}
                                                </a>
                                                <span className={styles.idText}>{a.id.replace('https://medium.com/p/', '')}</span>
                                            </td>
                                            <td className={styles.date}>{fmtDate(a.pubDate)}</td>
                                            <td className={styles.date}>{a.status === 'added' ? '—' : fmtDate(a.firstSyncedAt)}</td>
                                            <td className={styles.date}>
                                                {a.status === 'added' ? '—' : fmtDate(a.lastSeenAt)}
                                            </td>
                                            <td>
                                                <div className={styles.tags}>
                                                    {(a.categories || []).length
                                                        ? a.categories.map((c) => (
                                                              <span key={c} className={styles.tag}>
                                                                  {c}
                                                              </span>
                                                          ))
                                                        : '—'}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`${styles.pill} ${styles[`pill_${st.cls}`]}`}>
                                                    {st.icon} {st.label}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* ===== 維護指令 ===== */}
                <section className={styles.panel}>
                    <h2 className={styles.panelTitle}>
                        <Terminal size={18} /> 維護指令
                    </h2>
                    <pre className={styles.cli}>
                        {`npm run sync:medium              # 同步並更新紀錄（有「待收錄」或「內容有變動」時執行）
npm run sync:medium -- --check   # 只比對，不寫檔
npm run sync:medium -- --health  # Node 環境測試所有來源（不受 CORS 限制）`}
                    </pre>
                </section>
            </div>
        </div>
    )
}

export default SyncStatus
