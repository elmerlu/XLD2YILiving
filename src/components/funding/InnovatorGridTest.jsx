import { useState, useMemo } from 'react'
import styles from './InnovatorGridTest.module.css'
import innovatorsData from '../../data/innovators.json'

const InnovatorGridTest = () => {
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
        <div style={{ marginTop: '4rem', paddingBottom: '4rem', borderTop: '2px dashed #ccc', paddingTop: '2rem' }}>
            <h2 className={styles.sectionTitle}>青創介紹 (測試版樣式)</h2>
            <div className={styles.gridContainer}>
                {sortedInnovators.map((innovator) => {
                    const imagePath = getImagePath(innovator.image);
                    const hasError = imageErrors[innovator.id];
                    const isSpecial = !imagePath || hasError;

                    return (
                        <div
                            key={`test-${innovator.id}`}
                            className={`${styles.card} ${isSpecial ? styles.specialCard : ''}`}
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
                                    <div className={styles.noPhotoHeader}>
                                        <span className={styles.specialIcon}>✨</span>
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

export default InnovatorGridTest
