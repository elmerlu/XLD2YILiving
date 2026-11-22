import React, { useRef, useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import styles from './ResidentEchoes.module.css'
import echoesData from '../../data/residentEchoes.json'

const ResidentEchoes = () => {
    // 雙倍陣列以實現 100% 順暢無縫循環滾動 (Seamless Loop)
    const displayList = [...echoesData, ...echoesData]
    // 取得 Vite 的 base url (例如 /XLD2YILiving/)，確保在 GitHub Pages 或自訂 base 下圖片皆能正確加載
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

    const containerRef = useRef(null)
    const trackRef = useRef(null)
    const posRef = useRef(0)
    const isHoveredRef = useRef(false)
    const isDraggingRef = useRef(false)
    const hasMovedRef = useRef(false)
    const dragStartXRef = useRef(0)
    const dragStartScrollRef = useRef(0)

    const [isDragging, setIsDragging] = useState(false)
    // 紀錄目前點擊放大檢視的卡片索引 (0 ~ echoesData.length - 1)，null 代表未開啟
    const [activeCardIndex, setActiveCardIndex] = useState(null)

    const activeCard = activeCardIndex !== null ? echoesData[activeCardIndex] : null

    // 將滾動位置正規化至單一週期 [0, halfWidth)，達成左右雙向無限循環
    const wrapPosition = (pos, halfWidth) => {
        if (!halfWidth || halfWidth <= 0) return 0
        let wrapped = pos % halfWidth
        if (wrapped < 0) wrapped += halfWidth
        return wrapped
    }

    useEffect(() => {
        let rafId
        const speed = 0.65 // 每幀自動平滑捲動像素 (~39px/sec)

        const step = () => {
            const container = containerRef.current
            const track = trackRef.current
            const isModalOpen = activeCardIndex !== null
            if (container && track && !isHoveredRef.current && !isDraggingRef.current && !isModalOpen) {
                const halfWidth = track.scrollWidth / 2
                if (halfWidth > 0) {
                    posRef.current = wrapPosition(posRef.current + speed, halfWidth)
                    container.scrollLeft = posRef.current
                }
            }
            rafId = requestAnimationFrame(step)
        }

        rafId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafId)
    }, [activeCardIndex])

    // 放大燈箱開啟時支援鍵盤 Esc 關閉、左右方向鍵切換卡片
    useEffect(() => {
        if (activeCardIndex === null) return
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setActiveCardIndex(null)
            } else if (e.key === 'ArrowRight') {
                setActiveCardIndex((prev) => (prev + 1) % echoesData.length)
            } else if (e.key === 'ArrowLeft') {
                setActiveCardIndex((prev) => (prev - 1 + echoesData.length) % echoesData.length)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activeCardIndex])

    const handlePointerDown = (e) => {
        const container = containerRef.current
        if (!container) return
        isDraggingRef.current = true
        hasMovedRef.current = false
        setIsDragging(false)
        dragStartXRef.current = e.clientX
        dragStartScrollRef.current = posRef.current
    }

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return
        const container = containerRef.current
        const track = trackRef.current
        if (!container || !track) return

        const dx = e.clientX - dragStartXRef.current
        // 位移超過 6px 才視為拖曳，避免微幅手震影響點擊放大
        if (Math.abs(dx) > 6) {
            if (!hasMovedRef.current) {
                hasMovedRef.current = true
                setIsDragging(true)
            }
            const halfWidth = track.scrollWidth / 2
            const nextPos = wrapPosition(dragStartScrollRef.current - dx, halfWidth)
            posRef.current = nextPos
            container.scrollLeft = nextPos
        }
    }

    const endDrag = () => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        setIsDragging(false)
    }

    const handleCardClick = (realIdx) => {
        // 若剛剛是拖曳滑動則不觸發點擊放大
        if (hasMovedRef.current) {
            hasMovedRef.current = false
            return
        }
        setActiveCardIndex(realIdx)
    }

    // 支援觸控板雙指左右滑動或滑鼠橫向滾輪 (Wheel)
    const handleWheel = (e) => {
        const container = containerRef.current
        const track = trackRef.current
        if (!container || !track) return
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
            const delta = e.deltaX || e.deltaY
            const halfWidth = track.scrollWidth / 2
            const nextPos = wrapPosition(posRef.current + delta, halfWidth)
            posRef.current = nextPos
            container.scrollLeft = nextPos
        }
    }

    const resolveImg = (cardImage) =>
        cardImage.startsWith('http') ? cardImage : `${baseUrl}${cardImage}`

    return (
        <section className={styles.echoesWrapper} aria-label="住民活動留言回聲牆">
            <div className={styles.echoesHeader}>
                <div className={styles.echoesTitleGroup}>
                    <span className={styles.echoesIcon}>💌</span>
                    <span className={styles.echoesTitle}>活動現場收到的住民小卡・手寫心聲</span>
                </div>
                <div className={styles.mockBadge} title="已收錄島嶼的餐桌真實手寫回饋小卡，其餘為示意卡片；可左右拖曳滑動，點擊卡片可放大檢視">
                    <span className={styles.mockDot}></span>
                    <span>已收錄真實回饋小卡（↔ 可左右滑動・🔍 點擊卡片放大）</span>
                </div>
            </div>

            <div
                ref={containerRef}
                className={`${styles.marqueeContainer} ${isDragging ? styles.dragging : ''}`}
                onMouseEnter={() => { isHoveredRef.current = true }}
                onMouseLeave={() => {
                    isHoveredRef.current = false
                    endDrag()
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onWheel={handleWheel}
            >
                <div ref={trackRef} className={styles.marqueeTrack}>
                    {displayList.map((item, index) => {
                        const imageSrc = resolveImg(item.cardImage)
                        const realIdx = index % echoesData.length
                        const tapeColorIdx = (realIdx % 4) + 1
                        const tapeClass = styles[`tapeColor${tapeColorIdx}`]

                        return (
                            <div
                                key={`${item.id}-${index}`}
                                className={`${styles.echoCard} ${tapeClass}`}
                                style={{
                                    '--theme-color': item.themeColor,
                                    '--theme-bg': item.themeBg
                                }}
                                onClick={() => handleCardClick(realIdx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`放大檢視 ${item.tag} - ${item.author} 的手寫小卡`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setActiveCardIndex(realIdx)
                                    }
                                }}
                            >
                                <div className={styles.cardImageContainer}>
                                    <div className={styles.cardMaskFrame}>
                                        <img
                                            src={imageSrc}
                                            alt={`${item.tag} - ${item.author} 的手寫小卡`}
                                            className={styles.cardImg}
                                            loading="lazy"
                                            draggable={false}
                                        />
                                    </div>
                                    <div className={styles.zoomHint}>
                                        <ZoomIn size={15} />
                                        <span>點擊放大</span>
                                    </div>
                                </div>

                                {/* 下方小卡資訊列 */}
                                <div className={styles.cardExtractBar}>
                                    <div className={styles.extractMeta}>
                                        <span className={styles.cardTag}>{item.tag}</span>
                                        <span className={styles.cardAuthor}>{item.author}</span>
                                    </div>
                                    {item.isReal && (
                                        <span className={styles.realBadge}>真實小卡</span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 點擊卡片彈出放大檢視燈箱 (Lightbox Modal) */}
            {activeCard && (
                <div
                    className={styles.lightboxOverlay}
                    onClick={() => setActiveCardIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${activeCard.tag} - ${activeCard.author} 手寫小卡放大檢視`}
                >
                    <div
                        className={styles.lightboxModal}
                        style={{
                            '--theme-color': activeCard.themeColor,
                            '--theme-bg': activeCard.themeBg
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.lightboxCloseBtn}
                            onClick={() => setActiveCardIndex(null)}
                            aria-label="關閉放大視窗"
                        >
                            <X size={22} />
                        </button>

                        <div className={styles.lightboxBody}>
                            <button
                                type="button"
                                className={`${styles.lightboxNavBtn} ${styles.lightboxPrevBtn}`}
                                onClick={() => setActiveCardIndex((prev) => (prev - 1 + echoesData.length) % echoesData.length)}
                                aria-label="上一張小卡"
                            >
                                <ChevronLeft size={26} />
                            </button>

                            <div className={styles.lightboxImageWrapper}>
                                <div className={`${styles.lightboxMaskFrame} ${styles[`tapeColor${(activeCardIndex % 4) + 1}`]}`}>
                                    <img
                                        src={resolveImg(activeCard.cardImage)}
                                        alt={`${activeCard.tag} - ${activeCard.author} 的手寫小卡`}
                                        className={styles.lightboxImg}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className={`${styles.lightboxNavBtn} ${styles.lightboxNextBtn}`}
                                onClick={() => setActiveCardIndex((prev) => (prev + 1) % echoesData.length)}
                                aria-label="下一張小卡"
                            >
                                <ChevronRight size={26} />
                            </button>
                        </div>

                        <div className={styles.lightboxFooter}>
                            <div className={styles.lightboxMetaRow}>
                                <div className={styles.extractMeta}>
                                    <span className={styles.cardTag}>{activeCard.tag}</span>
                                    <span className={styles.cardAuthor}>{activeCard.author}</span>
                                    {activeCard.isReal && (
                                        <span className={styles.realBadge}>真實小卡</span>
                                    )}
                                </div>
                                <span className={styles.lightboxCounter}>
                                    {activeCardIndex + 1} / {echoesData.length}
                                </span>
                            </div>
                            {activeCard.content && (
                                <p className={styles.lightboxTranscript}>{activeCard.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default ResidentEchoes
