import { useState, useEffect, useCallback, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './InnovatorCarousel.module.css'
import innovatorsData from '../../data/innovators.json'
import placeholder1 from '../../assets/innovator-placeholder.png'
import placeholder2 from '../../assets/innovator_placeholder_2.png'

const InnovatorCarousel = () => {
    // 1. Data Processing
    // Sort logic from Grid: Items with VALID images first
    // Since we don't load all images at once to check errors, we might trust the json 'image' field presence first
    // But to be consistent, we can replicate the error tracking
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const sortedInnovators = useMemo(() => {
        return [...innovatorsData].sort((a, b) => {
            const hasValidImageA = a.image && a.image.trim().length > 0 && !imageErrors[a.id];
            const hasValidImageB = b.image && b.image.trim().length > 0 && !imageErrors[b.id];
            if (hasValidImageA !== hasValidImageB) return hasValidImageA ? -1 : 1;
            return 0;
        });
    }, [imageErrors]);

    // 2. Carousel State
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerSlide, setItemsPerSlide] = useState(3);

    // 3. Responsive Logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerSlide(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerSlide(2);
            } else {
                setItemsPerSlide(3);
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 4. Navigation
    const maxIndex = Math.max(0, sortedInnovators.length - itemsPerSlide);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prev => {
            if (prev >= maxIndex) return 0; // Loop back to start
            return prev + 1;
        });
    }, [maxIndex]);

    const prevSlide = useCallback(() => {
        setCurrentIndex(prev => {
            if (prev <= 0) return maxIndex; // Loop to end
            return prev - 1;
        });
    }, [maxIndex]);

    // 5. Image Helper
    const getImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${import.meta.env.BASE_URL}${cleanPath}`;
    };

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.mainContent}>
                {/* Prev Button */}
                <button
                    onClick={prevSlide}
                    className={styles.navBtn}
                    aria-label="Previous innovator"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Track Window */}
                <div className={styles.trackContainer}>
                    <div
                        className={styles.track}
                        style={{
                            transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`
                        }}
                    >
                        {sortedInnovators.map((innovator, index) => {
                            const imagePath = getImagePath(innovator.image);
                            const hasError = imageErrors[innovator.id];
                            const isSpecial = !imagePath || hasError;

                            // Tape Color Logic: Deterministic based on ID
                            const tapeColorIndex = (innovator.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 4 + 1;
                            const tapeClass = styles[`tapeColor${tapeColorIndex}`];

                            // Placeholder Logic: Alternating based on index
                            const placeholderImg = index % 2 === 0 ? placeholder1 : placeholder2;

                            return (
                                <div key={innovator.id} className={styles.slide}>
                                    {/* POLAROID CARD */}
                                    {/* Add tape class to card */}
                                    <div className={`${styles.card} ${tapeClass}`}>
                                        <div className={styles.imageContainer}>
                                            {!isSpecial ? (
                                                <img
                                                    src={imagePath}
                                                    alt={innovator.project_name}
                                                    className={styles.innovatorImage}
                                                    onError={() => handleImageError(innovator.id)}
                                                />
                                            ) : (
                                                <div className={styles.placeholderContainer}>
                                                    <img
                                                        src={placeholderImg}
                                                        alt="Innovator Placeholder"
                                                        className={styles.innovatorImage}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.content}>
                                            <div className={styles.headerInfo}>
                                                <span className={styles.idLabel}>{innovator.id}</span>
                                                <span className={styles.name}>{innovator.project_name}</span>
                                                {innovator.nickname && <span className={styles.nickname}> ({innovator.nickname})</span>}
                                            </div>
                                            <p className={styles.description}>{innovator.description}</p>
                                            <div className={styles.groupTag}>{innovator.activity}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className={styles.navBtn}
                    aria-label="Next innovator"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    )
}

export default InnovatorCarousel
