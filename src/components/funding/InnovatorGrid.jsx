import { useState, useMemo, useEffect } from 'react'
import styles from './InnovatorGrid.module.css'
import innovatorsData from '../../data/innovators.json'
import placeholder1 from '../../assets/innovator-placeholder.png'
import placeholder2 from '../../assets/innovator_placeholder_2.png'

const InnovatorGrid = () => {
    // Track which images failed to load
    const [imageErrors, setImageErrors] = useState({});
    // Track currently selected innovator for popup modal
    const [selectedInnovator, setSelectedInnovator] = useState(null);

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

    // Handle Escape key and body scroll lock for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedInnovator(null);
            }
        };

        if (selectedInnovator) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [selectedInnovator]);

    const getImagePath = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${import.meta.env.BASE_URL}${cleanPath}`;
    };

    // Prepare modal data if open
    const modalImagePath = selectedInnovator ? getImagePath(selectedInnovator.image) : null;
    const modalHasError = selectedInnovator ? imageErrors[selectedInnovator.id] : false;
    const modalIsSpecial = !modalImagePath || modalHasError;
    const selectedIndex = selectedInnovator ? sortedInnovators.findIndex(i => i.id === selectedInnovator.id) : 0;
    const modalPlaceholder = selectedIndex % 2 === 0 ? placeholder1 : placeholder2;
    const modalTags = selectedInnovator?.activity
        ? selectedInnovator.activity.split(/[、,，+]/).map(t => t.trim()).filter(Boolean)
        : [];

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
                            onClick={() => setSelectedInnovator(innovator)}
                            role="button"
                            tabIndex={0}
                            aria-label={`查看 ${innovator.id} ${innovator.project_name} 完整介紹`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setSelectedInnovator(innovator);
                                }
                            }}
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
                                    <div className={styles.name} style={{ display: 'block', marginBottom: '4px', fontSize: '1.1rem' }}>
                                        {innovator.project_name}
                                    </div>
                                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                        <span className={styles.idLabel}>{innovator.id}</span>
                                        {innovator.nickname && <span className={styles.nickname}> {innovator.nickname}</span>}
                                    </div>
                                </div>

                                <p className={styles.description}>{innovator.description}</p>

                                {/* Tag moved to bottom */}
                                <div className={styles.groupTag}>{innovator.activity}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Popup Modal for Expanded View */}
            {selectedInnovator && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelectedInnovator(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-innovator-title"
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.modalCloseButton}
                            onClick={() => setSelectedInnovator(null)}
                            aria-label="關閉視窗"
                        >
                            ✕
                        </button>

                        <div className={styles.modalHeader}>
                            <span className={styles.modalIdBadge}>{selectedInnovator.id}</span>
                            <h3 id="modal-innovator-title" className={styles.modalTitle}>
                                {selectedInnovator.project_name}
                            </h3>
                            <div className={styles.modalNickname}>
                                {selectedInnovator.nickname ? `夥伴：${selectedInnovator.nickname}` : `姓名：${selectedInnovator.name}`}
                            </div>
                        </div>

                        <div className={styles.modalImageContainer}>
                            {!modalIsSpecial ? (
                                <img
                                    src={modalImagePath}
                                    alt={selectedInnovator.project_name}
                                    className={styles.modalImage}
                                    onError={() => handleImageError(selectedInnovator.id)}
                                />
                            ) : (
                                <img
                                    src={modalPlaceholder}
                                    alt="Activity Organizer Placeholder"
                                    className={styles.modalImage}
                                />
                            )}
                        </div>

                        <div className={styles.modalDescription}>
                            {selectedInnovator.description}
                        </div>

                        {modalTags.length > 0 && (
                            <div className={styles.modalTagsWrapper}>
                                <span className={styles.modalTagLabel}>活動領域 / 特色：</span>
                                {modalTags.map((tag, idx) => (
                                    <span key={idx} className={styles.modalTag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.modalDismissBtn}
                                onClick={() => setSelectedInnovator(null)}
                            >
                                關閉
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InnovatorGrid
