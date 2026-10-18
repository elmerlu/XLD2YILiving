import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './VideoCarousel.module.css'

const videos = [
    {
        id: 1,
        url: 'https://www.youtube.com/embed/Xmv1HVnitlY?enablejsapi=1',
        title: '2018/12-2019/10 興隆社宅青創夥伴大家辛苦了!!!',
        description: ''
    },
    {
        id: 2,
        url: 'https://www.youtube.com/embed/F9vFcgdWyDc?enablejsapi=1',
        title: '住興隆社宅D2，如果真的發生火災，怎麼避難?',
        description: ''
    },
    {
        id: 3,
        url: 'https://www.youtube.com/embed/QAKGMUPvH5A?enablejsapi=1',
        title: '興隆社宅心榮新生活',
        description: '以興隆D2社宅為拍攝主體，在社區裡的，青創夥伴是社區種子也同時是社宅住戶，分享入住一年以來發生許多酸甜苦辣的社宅生活，並同時邀請一同滾動社區事務的好朋友好鄰居用真實的活動影像及訪談說故事，共同建立起溫暖的家，形塑社會住宅生活風格。'
    }
]

const VideoCarousel = () => {
    // Clone first and last slides for infinite loop
    // [Last, 0, 1, 2, First]
    // Indices: 0, 1, 2, 3, 4
    // Real content is at 1, 2, 3
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

    // Calculate the 'real' active index for dots and text (0, 1, 2)
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
                                      當點擊播放後，Overlay 讓位 (pointer-events: none)，讓原生 YouTube 控制項完全可互動。
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
