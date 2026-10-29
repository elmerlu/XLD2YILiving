import { useState, useEffect } from 'react'
import { ExternalLink, FileText, X } from 'lucide-react'
import styles from './CommunityGroupsModal.module.css'
import communityData from '../../data/communityGroups.json'

// 為每個群組的管理員/群主設計專屬的熱情招呼語，讓卡片更有鄰里溫度與互動感
const HOST_GREETINGS = {
    'fb-fanpage': '嗨～我是小編 Sunny！常來粉專按讚串門子喔 ✨',
    'fb-group': '歡迎來坐聊！社區大小事都可以貼上來問鄰居 🍵',
    'line-buy': '看到好康別客氣，進群直接喊 +1 就對了 🛍️',
    'line-declutter': '家裡有閒置好物嗎？來幫它找個珍惜的新主人吧 🌱',
    'line-food': '今天晚餐吃什麼？快進來跟我們一起流口水 🍜',
    'line-workout': '別再坐著啦！換上運動鞋下樓一起「腹仇」吧 💪',
    'line-tabletennis': '週日下午 2 點到 5 點，揪你一起來揮拍流汗 🏓',
    'line-farm': '喜歡拈花惹草、種菜分享嗎？農耕隊隨時歡迎你 🌿',
    'line-craft': '我們三位都在群裡！一起動手做小物超療癒 🧶',
    'line-baking': '剛出爐的香氣最迷人了，新手也歡迎一起玩烘焙 🥐',
    'line-yeast': '第一手社區活動與私房料理小秘訣都在這裡 🍳',
    'line-parenting': '育兒路上不孤單！繪本教具跟陪玩心得一起聊 🧸',
}

// 每張卡片專屬的手繪風主題背景插畫（呼應各社團特色）
const renderCardThemeBg = (groupId) => {
    switch (groupId) {
        case 'fb-fanpage':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M20 75 L55 58 L55 82 L20 65 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M55 58 L92 40 L92 100 L55 82 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M32 78 L38 98 L48 98 L42 75" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M100 52 L112 44 M102 70 L115 70 M100 88 L112 96" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            )
        case 'fb-group':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M22 45 C22 28, 72 28, 72 45 C72 56, 58 63, 45 63 L30 74 L33 61 C25 58, 22 52, 22 45 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M52 68 C52 54, 102 54, 102 68 C102 76, 96 82, 88 85 L92 98 L76 88 C60 88, 52 80, 52 68 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <circle cx="38" cy="45" r="3" fill="currentColor" />
                    <circle cx="48" cy="45" r="3" fill="currentColor" />
                    <circle cx="58" cy="45" r="3" fill="currentColor" />
                </svg>
            )
        case 'line-buy':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <rect x="28" y="44" width="64" height="58" rx="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M44 44 V34 C44 22, 76 22, 76 34 V44" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M48 68 L56 76 L74 58" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="96" cy="30" r="5" fill="none" stroke="currentColor" strokeWidth="3.5" />
                </svg>
            )
        case 'line-declutter':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M60 96 V52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M60 72 C36 72, 28 48, 48 38 C60 44, 60 58, 60 72 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M60 60 C84 60, 92 36, 72 26 C60 32, 60 46, 60 60 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M36 96 H84" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            )
        case 'line-food':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M24 62 H96 C96 86, 78 98, 60 98 C42 98, 24 86, 24 62 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M42 98 H78" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M44 48 Q40 38 46 30 M60 48 Q56 38 62 30 M76 48 Q72 38 78 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            )
        case 'line-workout':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <g transform="rotate(-25 60 60)">
                        <rect x="20" y="44" width="12" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="50" width="10" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                        <line x1="32" y1="60" x2="88" y2="60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                        <rect x="88" y="44" width="12" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="100" y="50" width="10" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                    </g>
                </svg>
            )
        case 'line-tabletennis':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <circle cx="52" cy="48" r="26" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M68 68 L88 92 L78 100 L58 76" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <circle cx="92" cy="38" r="9" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            )
        case 'line-farm':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <rect x="38" y="52" width="44" height="38" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M82 64 L104 46 L108 52 L82 76" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M38 58 C20 58, 20 82, 38 82" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <path d="M52 52 V38 C52 30, 68 30, 68 38 V52" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
            )
        case 'line-craft':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <circle cx="56" cy="62" r="28" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M36 48 Q56 62 76 48 M34 64 Q56 78 78 64 M42 80 Q56 66 72 80" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="26" y1="90" x2="90" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="92" cy="28" r="5" fill="currentColor" />
                </svg>
            )
        case 'line-baking':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M32 62 C22 62, 18 42, 34 38 C38 22, 62 20, 72 32 C88 26, 102 44, 88 62 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <rect x="34" y="62" width="52" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                    <line x1="48" y1="62" x2="48" y2="88" stroke="currentColor" strokeWidth="3.5" />
                    <line x1="60" y1="62" x2="60" y2="88" stroke="currentColor" strokeWidth="3.5" />
                    <line x1="72" y1="62" x2="72" y2="88" stroke="currentColor" strokeWidth="3.5" />
                </svg>
            )
        case 'line-yeast':
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <circle cx="54" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="4" />
                    <circle cx="54" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                    <path d="M82 60 H106" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    <path d="M44 24 L48 14 M64 24 L68 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
            )
        case 'line-parenting':
        default:
            return (
                <svg viewBox="0 0 120 120" className={styles.cardBgSvg} aria-hidden="true">
                    <path d="M60 40 C46 32, 28 34, 22 42 V88 C28 80, 46 78, 60 86 C74 78, 92 80, 98 88 V42 C92 34, 74 32, 60 40 Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
                    <line x1="60" y1="40" x2="60" y2="86" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
            )
    }
}

const CommunityGroupsModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('all') // 'all' | 'facebook' | 'line'
    const [activeBubbleId, setActiveBubbleId] = useState(null)

    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')
    const getAssetUrl = (path) => {
        if (!path) return ''
        if (path.startsWith('http')) return path
        return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
    }

    const handlePillClick = (e, groupId) => {
        e.preventDefault()
        e.stopPropagation()
        setActiveBubbleId((curr) => (curr === groupId ? null : groupId))
    }

    const fbGroups = communityData.facebook || []
    const lineGroups = communityData.lineGroups || []
    const totalCount = fbGroups.length + lineGroups.length

    const showFb = activeTab === 'all' || activeTab === 'facebook'
    const showLine = activeTab === 'all' || activeTab === 'line'

    const renderGroupCard = (group) => {
        const isFb = group.platform === 'facebook'
        const platformClass = isFb ? styles.cardFacebook : styles.cardLine
        const qrImgUrl = getAssetUrl(group.qrCodeImage)
        const greetingText = HOST_GREETINGS[group.id] || `嗨！我是${group.admins?.[0] || '管理員'}，歡迎進群一起聊聊天～`

        return (
            <a
                key={group.id}
                href={group.qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.groupCard} ${platformClass}`}
                title={`點擊前往：${group.name}`}
            >
                {/* 卡片右下角專屬手繪風背景浮水印插畫 */}
                <div className={styles.cardBgDecor} aria-hidden="true">
                    {renderCardThemeBg(group.id)}
                </div>

                {/* 卡片頂部：置中群組名稱 */}
                <div className={styles.cardTitleHeader}>
                    <h4 className={styles.groupName}>{group.name}</h4>
                </div>

                {/* 中段：上方管理員/群主名牌（含對話氣泡） + 下方 QR Code */}
                <div className={styles.qrShowcase}>
                    {group.role && group.admins?.length > 0 && (
                        <div className={styles.hostInteractiveWrap}>
                            {/* 懸停或手機點擊時浮現的鄰居招呼對話氣泡 */}
                            <div className={`${styles.hostBubble} ${activeBubbleId === group.id ? styles.hostBubbleActive : ''}`}>
                                <span className={styles.bubbleText}>{greetingText}</span>
                            </div>

                            <button
                                type="button"
                                className={styles.hostPill}
                                onClick={(e) => handlePillClick(e, group.id)}
                                title="看看管理員想對大家說的話"
                            >
                                <span className={styles.hostRoleTag}>
                                    <span>🌟</span>
                                    <span>管理員</span>
                                </span>
                                <span className={styles.hostNames}>
                                    {group.admins.join('、')}
                                </span>
                                <span className={styles.waveHand} aria-hidden="true">💬</span>
                            </button>
                        </div>
                    )}

                    <div className={styles.qrFrame}>
                        {group.qrCodeSvg ? (
                            <div
                                className={styles.qrSvgWrapper}
                                dangerouslySetInnerHTML={{ __html: group.qrCodeSvg }}
                            />
                        ) : (
                            <img
                                src={qrImgUrl}
                                alt={`${group.name} QR Code`}
                                className={styles.qrImage}
                                loading="lazy"
                            />
                        )}
                    </div>
                </div>

                {/* 群組介紹區（FB 不顯示分類副標） */}
                <div className={styles.infoSection}>
                    {!isFb && group.tagline && (
                        <p className={styles.groupTagline}>{group.tagline}</p>
                    )}

                    {group.description && (
                        <p className={styles.groupDesc}>{group.description}</p>
                    )}
                </div>

                {/* 底部滿版行動按鈕 */}
                <div className={styles.cardFooter}>
                    <span className={styles.joinAction}>
                        <span>{isFb ? '點擊前往粉專 / 社團' : '點擊直接加入 LINE 群組'}</span>
                        <ExternalLink size={15} />
                    </span>
                </div>
            </a>
        )
    }

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-modal-title"
        >
            <div
                className={styles.modalContainer}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 呼應實體海報的全域背景插畫層（暖陽色塊、綠意小山丘與松樹、點點紙紋） */}
                <div className={styles.ambientBackdrop} aria-hidden="true">
                    <div className={styles.blobTopLeft} />
                    <div className={styles.blobMidRight} />
                    <div className={styles.blobBottomLeft} />

                    {/* 右上角背景：鄰里串門子柔和背景插畫 */}
                    <svg className={styles.cornerNeighborsRight} viewBox="0 0 320 300" fill="none">
                        <g opacity="0.22" transform="translate(20, 10)">
                            <rect x="52" y="68" width="68" height="145" rx="6" fill="#fed7aa" stroke="#f97316" strokeWidth="2" />
                            <rect x="64" y="82" width="14" height="14" rx="2" fill="#ffffff" />
                            <rect x="90" y="82" width="14" height="14" rx="2" fill="#ffffff" />
                            <rect x="64" y="106" width="14" height="14" rx="2" fill="#ffffff" />
                            <rect x="90" y="106" width="14" height="14" rx="2" fill="#ffffff" />
                            <rect x="132" y="92" width="64" height="121" rx="6" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
                            <rect x="144" y="106" width="12" height="12" rx="2" fill="#ffffff" />
                            <rect x="168" y="106" width="12" height="12" rx="2" fill="#ffffff" />
                            <circle cx="230" cy="162" r="28" fill="#86efac" />
                            <circle cx="250" cy="176" r="22" fill="#4ade80" />
                        </g>
                    </svg>

                    {/* 左下角：呼應海報的社宅森林綠意與小樹叢插畫 */}
                    <svg className={styles.cornerForestLeft} viewBox="0 0 260 220" fill="none">
                        <path d="M-20 220 C30 165, 130 175, 220 220 Z" fill="#dcfce7" opacity="0.7" />
                        {/* 高松樹 */}
                        <g opacity="0.32">
                            <polygon points="55,45 20,115 90,115" fill="#15803d" />
                            <polygon points="55,75 15,150 95,150" fill="#166534" />
                            <polygon points="55,110 10,190 100,190" fill="#14532d" />
                            <line x1="55" y1="65" x2="55" y2="215" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" />
                            <line x1="55" y1="105" x2="38" y2="90" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="55" y1="135" x2="74" y2="118" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="55" y1="162" x2="35" y2="145" stroke="#fef3c7" strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                        {/* 圓潤小樹叢 */}
                        <g opacity="0.28">
                            <circle cx="118" cy="155" r="28" fill="#65a30d" />
                            <circle cx="142" cy="168" r="22" fill="#84cc16" />
                            <circle cx="96" cy="172" r="20" fill="#4d7c0f" />
                            <path d="M118 145 V215 M118 175 L102 162 M118 182 L136 168" stroke="#fefce8" strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                    </svg>

                    {/* 右下角：柔和綠葉與暖色幾何點綴 */}
                    <svg className={styles.cornerForestRight} viewBox="0 0 240 200" fill="none">
                        <path d="M40 200 C100 150, 190 140, 260 200 Z" fill="#fef3c7" opacity="0.65" />
                        <g opacity="0.24" transform="translate(115, 65)">
                            <path d="M45 120 C15 95, 10 50, 45 20 C80 50, 75 95, 45 120 Z" fill="#0d9488" />
                            <path d="M45 35 V125 M45 68 L28 52 M45 88 L62 72" stroke="#f0fdfa" strokeWidth="2.5" strokeLinecap="round" />
                            <circle cx="88" cy="95" r="22" fill="#f59e0b" opacity="0.6" />
                        </g>
                    </svg>
                </div>

                {/* Unified Spacious Header with Festive Bunting Flags */}
                <div className={styles.modalHeader}>
                    {/* 頂部中央偏右的派對三角彩旗（避開左側標題與右側按鈕，復刻實體海報氣氛） */}
                    <svg className={styles.buntingCenter} viewBox="0 0 280 56" fill="none" aria-hidden="true">
                        <path d="M4 -2 Q140 34 276 -2" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
                        <polygon points="28,4 40,30 54,8" fill="#ff6b8b" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="62,9 74,36 88,12" fill="#fbbf24" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="96,13 108,40 122,15" fill="#34d399" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="130,15 142,41 156,15" fill="#60a5fa" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="164,15 176,40 190,13" fill="#a78bfa" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="198,12 210,36 224,9" fill="#fb923c" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                        <polygon points="232,8 244,30 256,4" fill="#f472b6" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
                    </svg>

                    <div className={styles.headerTopRow}>
                        <div className={styles.headerTitleArea}>
                            <div className={styles.titleRow}>
                                <span className={styles.headerEmoji}>🏘️</span>
                                <h2 id="community-modal-title" className={styles.modalTitle}>
                                    {communityData.title || '社區社群大平台'}
                                </h2>
                            </div>
                            <p className={styles.modalSubtitle}>
                                {communityData.subtitle || '買好物、揪運動、玩社團，等您來+1'}
                            </p>
                        </div>

                        <div className={styles.headerActions}>
                            {communityData.posterPdf && (
                                <a
                                    href={getAssetUrl(communityData.posterPdf)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.posterLink}
                                >
                                    <FileText size={16} />
                                    <span>查看實體海報 PDF</span>
                                </a>
                            )}
                            <button
                                type="button"
                                className={styles.closeBtn}
                                onClick={onClose}
                                aria-label="關閉視窗"
                            >
                                <X size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className={styles.filterTabs} role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'all'}
                            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            全部群組 ({totalCount})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'facebook'}
                            className={`${styles.tabBtn} ${activeTab === 'facebook' ? styles.tabActiveFb : ''}`}
                            onClick={() => setActiveTab('facebook')}
                        >
                            Facebook 粉專與社團 ({fbGroups.length})
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'line'}
                            className={`${styles.tabBtn} ${activeTab === 'line' ? styles.tabActiveLine : ''}`}
                            onClick={() => setActiveTab('line')}
                        >
                            LINE 交流與社團 ({lineGroups.length})
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className={styles.modalBody}>
                    {showFb && fbGroups.length > 0 && (
                        <section className={styles.platformSection}>
                            <div className={styles.sectionHeader}>
                                <span className={`${styles.sectionDot} ${styles.dotFb}`}></span>
                                <h3 className={styles.sectionHeading}>Facebook 粉絲專頁及住戶社團</h3>
                                <span className={styles.sectionHint}>點擊卡片或掃描 QR Code 即可前往</span>
                            </div>
                            <div className={styles.cardsGrid}>
                                {fbGroups.map(renderGroupCard)}
                            </div>
                        </section>
                    )}

                    {showLine && lineGroups.length > 0 && (
                        <section className={styles.platformSection}>
                            <div className={styles.sectionHeader}>
                                <span className={`${styles.sectionDot} ${styles.dotLine}`}></span>
                                <h3 className={styles.sectionHeading}>LINE 社區交流與主題興趣群組</h3>
                                <span className={styles.sectionHint}>點擊卡片直接跳轉 LINE 加入，或用手機掃碼</span>
                            </div>
                            <div className={styles.cardsGrid}>
                                {lineGroups.map(renderGroupCard)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommunityGroupsModal
