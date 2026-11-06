import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, SkipForward, Volume2, Settings, Maximize2, ExternalLink } from 'lucide-react'
import styles from './VideoCarousel.module.css'
import homeVideos from '../../data/homeVideos.json'
import defaultPoster from '../../assets/images/lifestyle/lantern.png'

// 判斷是否為 YouTube 影片
const isYoutubeVideo = (url) => typeof url === 'string' && (url.includes('youtube.com') || url.includes('youtu.be'))

// 目前依指示 1-7 全數保留顯示（1-4 新片，5-7 舊片依序排後備存）
// 若未來需從前端將 5-7 舊片移除，只需將此處改為 homeVideos.filter(v => v.status === 'active')，資料面持續完整備存
const videos = homeVideos

const VideoCarousel = () => {
    // Clone first and last slides for infinite loop
    const extendedVideos = [
        { ...videos[videos.length - 1], id: 'clone-last' },
        ...videos,
        { ...videos[0], id: 'clone-first' }
    ]

    const [currentIndex, setCurrentIndex] = useState(1) // Start at the first real slide
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [dragOffset, setDragOffset] = useState(0)
    const [playingIndex, setPlayingIndex] = useState(null) // 紀錄目前正在播放的 slide index

    const iframeRefs = useRef({})
    const dragStartedRef = useRef(false)

    // Calculate the 'real' active index for dots and text (0 ~ videos.length - 1)
    const realIndex = currentIndex === 0
        ? videos.length - 1
        : currentIndex === extendedVideos.length - 1
            ? 0
            : currentIndex - 1

    // 暫停所有 iframe 影片
    const pauseAllVideos = () => {
        Object.values(iframeRefs.current).forEach(iframe => {
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
                } catch {
                    // ignore cross-origin error
                }
            }
        })
    }

    // 播放指定 slide 的影片
    const playVideo = (index) => {
        const iframe = iframeRefs.current[index]
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*')
            } catch {
                // ignore
            }
        }
        setPlayingIndex(index)
    }

    const handleTransitionEnd = () => {
        setIsTransitioning(false)
        // Teleport if at boundary
        if (currentIndex === 0) {
            setCurrentIndex(videos.length)
        } else if (currentIndex === extendedVideos.length - 1) {
            setCurrentIndex(1)
        }
    }

    const nextSlide = () => {
        if (isTransitioning) return
        pauseAllVideos()
        setPlayingIndex(null)
        setIsTransitioning(true)
        setCurrentIndex(prev => prev + 1)
    }

    const prevSlide = () => {
        if (isTransitioning) return
        pauseAllVideos()
        setPlayingIndex(null)
        setIsTransitioning(true)
        setCurrentIndex(prev => prev - 1)
    }

    const goToSlide = (index) => {
        if (isTransitioning) return
        pauseAllVideos()
        setPlayingIndex(null)
        setIsTransitioning(true)
        setCurrentIndex(index + 1)
    }

    // Drag / Swipe 手勢邏輯
    const handlePointerDown = (e, index) => {
        if (isTransitioning) return
        dragStartedRef.current = true
        setIsDragging(true)
        setStartX(e.clientX)
        setDragOffset(0)
        setIsTransitioning(false)
        try {
            e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
            // ignore
        }
    }

    const handlePointerMove = (e) => {
        if (!dragStartedRef.current) return
        const currentX = e.clientX
        const diff = currentX - startX
        setDragOffset(diff)
    }

    const handlePointerUp = (e, index) => {
        if (!dragStartedRef.current) return
        dragStartedRef.current = false

        const diff = e.clientX - startX
        const threshold = 70 // 拖曳換頁門檻

        try {
            e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
            // ignore
        }

        setIsDragging(false)
        setDragOffset(0)

        // 若位移極小 (< 8px)，判定為點擊播放 (Click to Play)
        if (Math.abs(diff) < 8) {
            playVideo(index)
            return
        }

        // 否則為拖拉輪播 (Swipe)
        if (diff < -threshold) {
            nextSlide()
        } else if (diff > threshold) {
            prevSlide()
        } else {
            // 未達門檻，平滑彈回
            setIsTransitioning(true)
        }
    }

    const handlePointerCancel = (e) => {
        dragStartedRef.current = false
        setIsDragging(false)
        setDragOffset(0)
        setIsTransitioning(true)
        try {
            e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
            // ignore
        }
    }

    const trackStyle = {
        transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        transition: isDragging ? 'none' : (isTransitioning ? 'transform 0.5s ease-out' : 'none')
    }

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.mainContent}>
                {/* Left Button */}
                <button
                    onClick={prevSlide}
                    className={styles.navBtn}
                    aria-label="Previous video"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* Video Wrapper */}
                <div
                    className={styles.videoWrapper}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                >
                    {/* Track contains extended slides */}
                    <div
                        className={styles.carouselTrack}
                        style={trackStyle}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedVideos.map((video, index) => {
                            const isPlayingThis = playingIndex === index
                            const isYoutube = isYoutubeVideo(video.url)
                            return (
                                <div key={`${video.id}-${index}`} className={styles.slide}>
                                    {isYoutube ? (
                                        /* YouTube 原生影片覆蓋層：負責手勢拖曳與點擊播放 */
                                        <div
                                            className={`${styles.slideOverlay} ${isPlayingThis ? styles.hiddenOverlay : ''}`}
                                            onPointerDown={(e) => handlePointerDown(e, index)}
                                            onPointerMove={handlePointerMove}
                                            onPointerUp={(e) => handlePointerUp(e, index)}
                                            onPointerCancel={handlePointerCancel}
                                        />
                                    ) : (
                                        /* 非 YouTube 影片（如 Google 雲端影片）：呈現精緻的 YouTube 風格外觀 UI */
                                        <>
                                            <div
                                                className={`${styles.customPlayerSkin} ${isPlayingThis ? styles.skinHidden : ''}`}
                                                onPointerDown={(e) => handlePointerDown(e, index)}
                                                onPointerMove={handlePointerMove}
                                                onPointerUp={(e) => handlePointerUp(e, index)}
                                                onPointerCancel={handlePointerCancel}
                                            >
                                                {/* 背景縮圖與電影感光暈 */}
                                                <div className={styles.skinBackdrop}>
                                                    <img
                                                        src={video.thumbnail || defaultPoster}
                                                        alt={video.title}
                                                        className={styles.skinThumbnail}
                                                    />
                                                    <div className={styles.skinVignette} />
                                                </div>

                                                {/* 頂部資訊列 (YouTube 風格) */}
                                                <div
                                                    className={styles.skinTopBar}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                >
                                                    <div className={styles.skinChannelInfo}>
                                                        <div className={styles.skinAvatar}>
                                                            <span>興隆</span>
                                                        </div>
                                                        <div className={styles.skinTitleGroup}>
                                                            <h3 className={styles.skinVideoTitle}>{video.title}</h3>
                                                            <span className={styles.skinChannelName}>
                                                                興隆 D2 青年創新回饋團隊 • 社區生活影像
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.skinTopActions}>
                                                        <a
                                                            href={video.originalUrl || video.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.skinExternalBtn}
                                                            title="在 Google Drive 以高畫質開啟"
                                                            onPointerDown={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink size={14} />
                                                            <span>在雲端開啟</span>
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* 中央 YouTube 標誌性紅色播放按鈕 */}
                                                <div className={styles.skinCenterPlay}>
                                                    <button
                                                        type="button"
                                                        className={styles.ytRedPlayBtn}
                                                        aria-label={`播放 ${video.title}`}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        onClick={() => playVideo(index)}
                                                    >
                                                        <svg viewBox="0 0 68 48" width="68" height="48" className={styles.ytSvg}>
                                                            <path
                                                                className={styles.ytBtnBg}
                                                                d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                                                                fill="#f00"
                                                            />
                                                            <path d="M 45,24 27,14 27,34" fill="#fff" />
                                                        </svg>
                                                    </button>
                                                    <span className={styles.skinPlayPrompt}>點擊播放影片</span>
                                                </div>

                                                {/* 底部 YouTube 播放器控制列 */}
                                                <div
                                                    className={styles.skinBottomBar}
                                                    onPointerDown={(e) => e.stopPropagation()}
                                                >
                                                    <div className={styles.skinProgressBar}>
                                                        <div className={styles.skinProgressBuffer} style={{ width: '42%' }} />
                                                        <div className={styles.skinProgressPlayed} style={{ width: '0%' }}>
                                                            <span className={styles.skinProgressPin} />
                                                        </div>
                                                    </div>
                                                    <div className={styles.skinControlsRow}>
                                                        <div className={styles.skinControlsLeft}>
                                                            <button
                                                                type="button"
                                                                className={styles.skinIconBtn}
                                                                title="播放"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    playVideo(index)
                                                                }}
                                                            >
                                                                <Play size={18} fill="currentColor" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={styles.skinIconBtn}
                                                                title="下一部"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    nextSlide()
                                                                }}
                                                            >
                                                                <SkipForward size={18} />
                                                            </button>
                                                            <div className={styles.skinVolumeGroup}>
                                                                <button type="button" className={styles.skinIconBtn} title="音量">
                                                                    <Volume2 size={18} />
                                                                </button>
                                                                <div className={styles.skinVolumeBar}>
                                                                    <div className={styles.skinVolumeFill} />
                                                                </div>
                                                            </div>
                                                            <span className={styles.skinTimeText}>0:00 / 2:38</span>
                                                        </div>
                                                        <div className={styles.skinControlsRight}>
                                                            <span className={styles.skinBadgeHd}>HD</span>
                                                            <button type="button" className={styles.skinIconBtn} title="字幕">
                                                                <span className={styles.skinCcBadge}>CC</span>
                                                            </button>
                                                            <button type="button" className={styles.skinIconBtn} title="設定">
                                                                <Settings size={18} />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={styles.skinIconBtn}
                                                                title="全螢幕"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    playVideo(index)
                                                                }}
                                                            >
                                                                <Maximize2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 播放中狀態：右上角懸浮操作標籤 */}
                                            {isPlayingThis && (
                                                <div className={styles.activeFloatingBar}>
                                                    <a
                                                        href={video.originalUrl || video.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.floatingPillBtn}
                                                        title="在 Google 雲端硬碟以高畫質開啟"
                                                    >
                                                        <ExternalLink size={13} />
                                                        <span>在雲端開啟</span>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPlayingIndex(null)}
                                                        className={styles.floatingPillBtn}
                                                        title="返回預覽封面"
                                                    >
                                                        <span>返回封面</span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <iframe
                                        ref={(el) => (iframeRefs.current[index] = el)}
                                        src={video.url}
                                        title={video.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className={styles.iframe}
                                    ></iframe>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right Button */}
                <button
                    onClick={nextSlide}
                    className={styles.navBtn}
                    aria-label="Next video"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className={styles.paginationDots}>
                {videos.map((video, index) => (
                    <button
                        key={video.id}
                        onClick={() => goToSlide(index)}
                        className={`${styles.dot} ${realIndex === index ? styles.activeDot : ''}`}
                        aria-label={`Go to video ${index + 1}`}
                    />
                ))}
            </div>

            <div className={styles.infoSection}>
                {videos[realIndex].title && (
                    <h2 className={styles.title}>{videos[realIndex].title}</h2>
                )}
                {videos[realIndex].description && (
                    <p className={styles.description}>{videos[realIndex].description}</p>
                )}
            </div>
        </div>
    )
}

export default VideoCarousel
