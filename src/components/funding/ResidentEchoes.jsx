import React from 'react'
import styles from './ResidentEchoes.module.css'
import echoesData from '../../data/residentEchoes.json'

const ResidentEchoes = () => {
    // 雙倍陣列以實現 100% 順暢無縫循環滾動 (Seamless Loop)
    const displayList = [...echoesData, ...echoesData]
    // 取得 Vite 的 base url (例如 /XLD2YILiving/)，確保在 GitHub Pages 或自訂 base 下圖片皆能正確加載
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

    return (
        <section className={styles.echoesWrapper} aria-label="住民活動留言回聲牆">
            <div className={styles.echoesHeader}>
                <div className={styles.echoesTitleGroup}>
                    <span className={styles.echoesIcon}>💌</span>
                    <span className={styles.echoesTitle}>活動現場收到的住民小卡・手寫心聲</span>
                </div>
                {/* 貼上醒目的「目前為模擬資料」Mark / Badge */}
                <div className={styles.mockBadge} title="此區塊目前為功能預覽展示，展示文案與手寫圖均為測試模擬資料">
                    <span className={styles.mockDot}></span>
                    <span>目前為模擬資料</span>
                </div>
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
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
                                {/* 實體手寫模擬小卡（包含手寫假文字、主題插圖、紙膠帶與活動印章） */}
                                <div className={styles.cardImageContainer}>
                                    <img
                                        src={imageSrc}
                                        alt={`${item.tag} - ${item.author} 的手寫小卡`}
                                        className={styles.cardImg}
                                        loading="lazy"
                                    />
                                </div>

                                {/* 下方小卡資訊列 */}
                                <div className={styles.cardExtractBar}>
                                    <div className={styles.extractMeta}>
                                        <span className={styles.cardTag}>{item.tag}</span>
                                        <span className={styles.cardAuthor}>{item.author}</span>
                                    </div>
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
