import { useState, useMemo } from 'react'
import styles from './InnovatorGrid.module.css'
import innovatorsData from '../../data/innovators.json'
import placeholder1 from '../../assets/innovator-placeholder.png'
import placeholder2 from '../../assets/innovator_placeholder_2.png'

const InnovatorGrid = () => {
    // Track which images failed to load
    const [imageErrors, setImageErrors] = useState({});

    const handleImageError = (id) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    // Sort logic: Items with VALID images come first
    const sortedInnovators = useMemo(() => {
        return [...innovatorsData].sort((a, b) => {
            const hasValidImageA = a.image && a.image.trim().length > 0 && !imageErrors[a.id];
            const hasValidImageB = b.image && b.image.trim().length > 0 && !imageErrors[b.id];

            // Stable sort when both are same validity
            if (hasValidImageA !== hasValidImageB) {
                return hasValidImageA ? -1 : 1;
            }
            return 0;
        });
    }, [imageErrors]);

    const getImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${import.meta.env.BASE_URL}${cleanPath}`;
    };

    return (
        <div>
            <h2 className={styles.sectionTitle}>青創介紹</h2>
            <div className={styles.gridContainer}>
                {sortedInnovators.map((innovator, index) => {
                    const imagePath = getImagePath(innovator.image);
                    const hasError = imageErrors[innovator.id];
                    const isSpecial = !imagePath || hasError;

                    // Tape Color Logic: Deterministic based on ID
                    const tapeColorIndex = (innovator.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 4 + 1;
                    const tapeClass = styles[`tapeColor${tapeColorIndex}`];

                    // Placeholder Logic: Alternating based on index
                    const placeholderToUse = index % 2 === 0 ? placeholder1 : placeholder2;

                    return (
                        <div
                            key={`${innovator.id}-${innovator.name}`}
                            className={`${styles.card} ${tapeClass}`}
                        >
                            {/* Image Section */}
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
                                            src={placeholderToUse}
                                            alt="Activity Organizer Placeholder"
                                            className={styles.innovatorImage}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Content Section - Reordered for Polaroid Style */}
                            <div className={styles.content}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.idLabel}>{innovator.id}</span>
                                    <span className={styles.name}>{innovator.project_name}</span>
                                    {innovator.nickname && <span className={styles.nickname}> ({innovator.nickname})</span>}
                                </div>

                                <p className={styles.description}>{innovator.description}</p>

                                {/* Tag moved to bottom */}
                                <div className={styles.groupTag}>{innovator.activity}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default InnovatorGrid
