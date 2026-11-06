import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './VideoCarousel.module.css'
import homeVideos from '../../data/homeVideos.json'

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
                    className={`${styles.navBtn} ${styles.prevBtn}`}
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
                            return (
                                <div key={`${video.id}-${index}`} className={styles.slide}>
                                    {/* 
                                      當未播放時，Overlay 覆蓋上方捕捉拖曳與點擊；
                                      當點擊播放後，Overlay 讓位 (pointer-events: none)，讓原生播放控制項完全可互動。
                                    */}
                                    <div
                                        className={`${styles.slideOverlay} ${isPlayingThis ? styles.hiddenOverlay : ''}`}
                                        onPointerDown={(e) => handlePointerDown(e, index)}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={(e) => handlePointerUp(e, index)}
                                        onPointerCancel={handlePointerCancel}
                                    />
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
                    className={`${styles.navBtn} ${styles.nextBtn}`}
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
