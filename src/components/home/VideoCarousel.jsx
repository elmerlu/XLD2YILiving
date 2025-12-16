import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './VideoCarousel.module.css'

const videos = [
    {
        id: 1,
        url: 'https://www.youtube.com/embed/Xmv1HVnitlY',
        title: '2018/12-2019/10 興隆社宅青創夥伴大家辛苦了!!!',
        description: ''
    },
    {
        id: 2,
        url: 'https://www.youtube.com/embed/F9vFcgdWyDc',
        title: '住興隆社宅D2，如果真的發生火災，怎麼避難?',
        description: ''
    },
    {
        id: 3,
        url: 'https://www.youtube.com/embed/QAKGMUPvH5A',
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
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [dragOffset, setDragOffset] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Calculate the 'real' active index for dots and text (0, 1, 2)
    // If currentIndex is 0 (Clone Last) -> real index is len-1
    // If currentIndex is 4 (Clone First) -> real index is 0
    // Else currentIndex - 1
    const realIndex = currentIndex === 0
        ? videos.length - 1
        : currentIndex === extendedVideos.length - 1
            ? 0
            : currentIndex - 1

    const handleTransitionEnd = () => {
        setIsTransitioning(false)
        // Teleport if at boundary
        if (currentIndex === 0) {
            // We are at Clone Last, jump to Real Last
            setCurrentIndex(videos.length)
        } else if (currentIndex === extendedVideos.length - 1) {
            // We are at Clone First, jump to Real First
            setCurrentIndex(1)
        }
    }

    const nextSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex(prev => prev + 1)
    }

    const prevSlide = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex(prev => prev - 1)
    }

    const goToSlide = (index) => {
        setIsTransitioning(true)
        // Map 0 -> 1, 1 -> 2, etc.
        setCurrentIndex(index + 1)
    }

    // Drag/Swipe Logic using Pointer Events
    const handlePointerDown = (e) => {
        // Prevent interaction during transition to avoid glitch
        if (isTransitioning) return

        setIsDragging(true)
        setStartX(e.clientX)
        setIsTransitioning(false) // Disable transition for drag
        e.target.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e) => {
        if (!isDragging) return
        const currentX = e.clientX
        const diff = currentX - startX
        setDragOffset(diff)
    }

    const handlePointerUp = (e) => {
        if (!isDragging) return

        const threshold = 100

        if (dragOffset < -threshold) {
            setIsTransitioning(true)
            setCurrentIndex(prev => prev + 1)
        } else if (dragOffset > threshold) {
            setIsTransitioning(true)
            setCurrentIndex(prev => prev - 1)
        } else {
            // Snap back
            setIsTransitioning(true)
        }

        setIsDragging(false)
        setDragOffset(0)
        e.target.releasePointerCapture(e.pointerId)
    }

    const handlePointerCancel = (e) => {
        setIsDragging(false)
        setDragOffset(0)
        setIsTransitioning(true) // Snap back if cancelled
        e.target.releasePointerCapture(e.pointerId)
    }

    const trackStyle = {
        transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
        // Enable transition only when moving between slides (isTransitioning), disable during drag
        transition: isDragging ? 'none' : (isTransitioning ? 'transform 0.5s ease-out' : 'none')
    }

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.mainContent}>
                {/* Left Button */}
                <button onClick={prevSlide} className={`${styles.navBtn} ${styles.prevBtn}`} aria-label="Previous video">
                    <ChevronLeft size={32} />
                </button>

                {/* Video Wrapper with Drag Events */}
                <div
                    className={styles.videoWrapper}
                    style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                >
                    {/* Overlay to catch pointer events over iframe - covers top 85% */}
                    <div
                        className={styles.iframeOverlay}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerCancel}
                        onPointerLeave={handlePointerUp}
                    ></div>

                    {/* Track contains extended slides */}
                    <div
                        className={styles.carouselTrack}
                        style={trackStyle}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        {extendedVideos.map((video, index) => (
                            <div key={`${video.id}-${index}`} className={styles.slide}>
                                <iframe
                                    src={video.url}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className={styles.iframe}
                                    style={{ pointerEvents: 'none' }}
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Button */}
                <button onClick={nextSlide} className={`${styles.navBtn} ${styles.nextBtn}`} aria-label="Next video">
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
