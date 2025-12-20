import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Info } from 'lucide-react'
import styles from './ActivityGallery.module.css'

// Import images directly
import lanternImg from '../../assets/images/lifestyle/lantern.png'
import christmasImg from '../../assets/images/lifestyle/christmas.jpg'
import riverImg from '../../assets/images/lifestyle/river.jpg'
import musicKitchenImg from '../../assets/images/lifestyle/music-kitchen.png'

const ACTIVITIES = [
    {
        id: 1,
        title: "【玩中學、做中學】新年紅紅火火！剪紙 × 木工燈籠 DIY",
        description: [
            "農曆新年即將到來，今年不妨一起動手打造一份充滿節慶氣息的手作燈籠吧！",
            "本次【玩中學、做中學】將帶大家進入 剪紙藝術 × 木工 DIY 的世界，親手製作一盞獨一無二、溫暖喜氣的新年燈籠！",
            "一張張紅色剪紙貼上燈罩，讓柔和的燈光透出圖案，喜氣洋洋的氛圍瞬間滿滿，一起迎接充滿好運的新一年！"
        ],
        image: lanternImg,
        link: "https://www.facebook.com/share/p/17sATRxakd/"
    },
    {
        id: 2,
        title: "【手作興生活】叮叮噹！我的聖誕樹自己裝",
        description: [
            "聖誕節的腳步近了～🎅 今年，不如自己動手打造一棵專屬的聖誕樹吧！一起用創意與雙手，感受滿滿節慶氛圍 ❤️",
            "🎁 上半場｜DIY 手作松果聖誕樹 — 使用乾燥松果與乾燥花，親手打造一棵充滿自然氣息的小聖誕樹 🌲 為冬日增添溫暖與香氣～",
            "⭐ 下半場｜DIY 木製聖誕樹 — 還在等聖誕老公公送禮物？🎅 不如親手打造一棵專屬的木製聖誕樹吧！組裝可站立的木製聖誕樹，加上閃亮 LED 燈串，成為房間最亮眼的焦點 ✨"
        ],
        image: christmasImg,
        link: "#"
    },
    {
        id: 3,
        title: "溪路小達人：家裡水邊這麼近",
        description: [
            "冬天的溪流呈現什麼樣貌呢？本次希望帶領大家觀察小坑溪、指南溪等小支流，運用 iNaturalist 學習觀察野草野花，觀測水質、觀察溪流地形，一同幫河川體檢，成為小溪達人！",
            "歡迎一同報名同系列活動，「家邊野花觀察趣」（2026/01/04辦理），親手體驗壓花，玩味野花創作的趣味！"
        ],
        image: riverImg,
        link: "#"
    },
    {
        id: 4,
        title: "音樂灶咖，作伙開火！",
        description: [
            "音樂灶咖邀請社區酵母菌阿瑛姐與音樂城市計畫帥氣樂手老師阿明，現場學習料理，品嚐料理，享受音樂演出。",
            "活動結束打包回家，晚餐上桌！延續灶咖與大家的溫暖時光。"
        ],
        image: musicKitchenImg,
        link: "#"
    }
]

const ActivityGallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const currentActivity = ACTIVITIES[currentIndex]

    const handleNext = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length)
    }

    const handlePrev = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrentIndex((prev) => (prev - 1 + ACTIVITIES.length) % ACTIVITIES.length)
    }

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 600)
        return () => clearTimeout(timer)
    }, [currentIndex])

    return (
        <section className={styles.gallerySection}>
            <div className="container">
                <div className={styles.splitLayout}>
                    {/* Text Content */}
                    <div className={styles.textContent}>
                        <div className={styles.verticalLabel}>興隆軌跡</div>

                        <div className={styles.mainContent} key={currentActivity.id}>
                            <h2 className={styles.title}>{currentActivity.title}</h2>
                            <div className={styles.description}>
                                {currentActivity.description.map((paragraph, index) => (
                                    <p key={index} className={styles.paragraph}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className={styles.buttonGroup}>
                                {currentActivity.link !== '#' && (
                                    <a
                                        href={currentActivity.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.actionButton}
                                    >
                                        <Search size={16} />
                                        <span>活動詳情</span>
                                    </a>
                                )}
                                <button className={styles.actionButton}>
                                    <Info size={16} />
                                    <span>更多紀錄</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.controls}>
                            <button onClick={handlePrev} className={styles.navBtn} aria-label="Previous">
                                <ChevronLeft size={24} />
                            </button>
                            <div className={styles.counter}>
                                {String(currentIndex + 1).padStart(2, '0')} / {String(ACTIVITIES.length).padStart(2, '0')}
                            </div>
                            <button onClick={handleNext} className={styles.navBtn} aria-label="Next">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className={styles.imageArea}>
                        <img
                            key={currentActivity.id}
                            src={currentActivity.image}
                            alt={currentActivity.title}
                            className={styles.imageSlide}
                            style={{
                                animation: 'fadeIn 0.8s ease'
                            }}
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(1.05); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </section>
    )
}

export default ActivityGallery
