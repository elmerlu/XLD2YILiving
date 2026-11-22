import React, { useRef, useState, useEffect } from 'react'
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
    const dragStartXRef = useRef(0)
    const dragStartScrollRef = useRef(0)

    const [isDragging, setIsDragging] = useState(false)

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
            if (container && track && !isHoveredRef.current && !isDraggingRef.current) {
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
    }, [])

    const handlePointerDown = (e) => {
        const container = containerRef.current
        if (!container) return
        isDraggingRef.current = true
        setIsDragging(true)
        dragStartXRef.current = e.clientX
        dragStartScrollRef.current = posRef.current
        try {
            container.setPointerCapture(e.pointerId)
        } catch {
            // ignore
        }
    }

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return
        const container = containerRef.current
        const track = trackRef.current
        if (!container || !track) return

        const halfWidth = track.scrollWidth / 2
        const dx = e.clientX - dragStartXRef.current
        const nextPos = wrapPosition(dragStartScrollRef.current - dx, halfWidth)
        posRef.current = nextPos
        container.scrollLeft = nextPos
    }

    const endDrag = (e) => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        setIsDragging(false)
        const container = containerRef.current
        if (container && e?.pointerId !== undefined) {
            try {
                container.releasePointerCapture(e.pointerId)
            } catch {
                // ignore
            }
        }
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

    return (
        <section className={styles.echoesWrapper} aria-label="住民活動留言回聲牆">
            <div className={styles.echoesHeader}>
                <div className={styles.echoesTitleGroup}>
                    <span className={styles.echoesIcon}>💌</span>
                    <span className={styles.echoesTitle}>活動現場收到的住民小卡・手寫心聲</span>
                </div>
                <div className={styles.mockBadge} title="已收錄島嶼的餐桌真實手寫回饋小卡，其餘為示意卡片；可用滑鼠拖曳或手指左右滑動瀏覽">
                    <span className={styles.mockDot}></span>
                    <span>已收錄真實回饋小卡（↔ 可左右拖曳滑動）</span>
                </div>
            </div>

            <div
                ref={containerRef}
                className={`${styles.marqueeContainer} ${isDragging ? styles.dragging : ''}`}
                onMouseEnter={() => { isHoveredRef.current = true }}
                onMouseLeave={() => { isHoveredRef.current = false }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onWheel={handleWheel}
            >
                <div ref={trackRef} className={styles.marqueeTrack}>
                    {displayList.map((item, index) => {
                        const imageSrc = item.cardImage.startsWith('http')
                            ? item.cardImage
                            : `${baseUrl}${item.cardImage}`

                        return (
                            <div
                                key={`${item.id}-${index}`}
                                className={styles.echoCard}
                                style={{
                                    '--theme-color': item.themeColor,
                                    '--theme-bg': item.themeBg
                                }}
                            >
                                <div className={styles.cardImageContainer}>
                                    <img
                                        src={imageSrc}
                                        alt={`${item.tag} - ${item.author} 的手寫小卡`}
                                        className={styles.cardImg}
                                        loading="lazy"
                                        draggable={false}
                                    />
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
        </section>
    )
}

export default ResidentEchoes
