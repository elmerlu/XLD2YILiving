import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Info } from 'lucide-react'
import styles from './ActivityGallery.module.css'

// Import images directly
import lanternImg from '../../assets/images/lifestyle/lantern.png'
import christmasImg from '../../assets/images/lifestyle/christmas.jpg'
import riverImg from '../../assets/images/lifestyle/river.jpg'
import musicKitchenImg from '../../assets/images/lifestyle/music-kitchen.png'
import sportsFitnessImg from '../../assets/images/lifestyle/sports-fitness.svg'

const ACTIVITIES = [
    {
        id: 1,
        category: "手作活動",
        title: "手作興生活｜動手做，把生活變有趣",
        description: [
            "興隆D2的手作活動，是社區裡最常見的週末風景。有給大人的進階手作，像是絹印、簇絨；有讓大小朋友一起完成的親子手作；也有跟著節慶走的主題手作，過年做剪紙木工燈籠，聖誕節組一棵自己的聖誕樹。",
            "大家從不認識到互相幫忙，帶回家的除了作品，還有新認識的鄰居。部分活動也會請參加者寫下小學習單，分享他們知道的興隆小知識，慢慢累積成社區的共同記憶。"
        ],
        image: lanternImg,
        link: "https://www.facebook.com/share/p/17sATRxakd/"
    },
    {
        id: 2,
        category: "廚藝烹飪活動",
        title: "灶咖作伙｜一起煮、一起吃",
        description: [
            "在興隆，廚房是認識鄰居最快的地方。除了烹飪教學，我們也辦共餐，讓忙碌的住戶下班後有一桌熱飯。",
            "像是「音樂灶咖」把現場演奏帶進廚房，邀請社區的料理達人和樂手老師，一邊學做菜一邊聽音樂，結束後把料理打包回家當晚餐。或是「興隆路上・島嶼餐桌」則加入飲食文學，大家從一道菜聊起各自的家鄉與記憶，並在現場寫下屬於自己的飲食故事。"
        ],
        image: musicKitchenImg,
        link: "#"
    },
    {
        id: 3,
        category: "運動活動",
        title: "動起來興隆｜老中青都找得到的運動",
        description: [
            "社區裡的運動活動，從長輩的樂齡運動、上班族的下班伸展，到孩子的體能遊戲，不同年齡層都找得到適合自己的節奏。",
            "D2 十二樓還有一間健身房，是青創夥伴和住戶一起動手、協力完成的，除了住戶，也開放附近的里民一起參加、一起使用。對大家來說，運動不只是鍛鍊身體，也是鄰居們固定見面、互相打氣的時間。"
        ],
        image: sportsFitnessImg,
        link: "#"
    },
    {
        id: 4,
        category: "主題型活動",
        title: "生活大小事｜走讀與講座",
        description: [
            "我們也和不同單位合作，辦理生態走讀與知識型講座。各式主題活動，由地方自然資源的，到承襲文化生長的農特產，也有民眾民生相關的。",
            "從住戶每天會遇到的事，柴米油鹽的生活知識，到勞保勞退等勞動權益、居住權益，讓大家在社區裡就能把重要的資訊帶回家。"
        ],
        image: riverImg,
        link: "#"
    },
    // 以下為舊活動紀錄備存（依指示排於四大類後方）
    {
        id: 5,
        category: "手作活動（紀錄）",
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
        id: 6,
        category: "手作活動（紀錄）",
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
        id: 7,
        category: "主題活動（紀錄）",
        title: "溪路小達人：家裡水邊這麼近",
        description: [
            "冬天的溪流呈現什麼樣貌呢？本次希望帶領大家觀察小坑溪、指南溪等小支流，運用 iNaturalist 學習觀察野草野花，觀測水質、觀察溪流地形，一同幫河川體檢，成為小溪達人！",
            "歡迎一同報名同系列活動，「家邊野花觀察趣」（2026/01/04辦理），親手體驗壓花，玩味野花創作的趣味！"
        ],
        image: riverImg,
        link: "#"
    },
    {
        id: 8,
        category: "廚藝活動（紀錄）",
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
                            {currentActivity.category && (
                                <div className={styles.categoryBadge}>
                                    {currentActivity.category}
                                </div>
                            )}
                            <h2 className={styles.title}>{currentActivity.title}</h2>
                            <div className={styles.description}>
                                {currentActivity.description.map((paragraph, index) => (
                                    <p key={index} className={styles.paragraph}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            <div className={styles.buttonGroup}>
                                {currentActivity.link && currentActivity.link !== '#' && (
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
                                <a
                                    href="https://www.facebook.com/xinglongph2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionButton}
                                >
                                    <Info size={16} />
                                    <span>更多紀錄</span>
                                </a>
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
                            key={currentIndex}
                            src={currentActivity.image}
                            alt={currentActivity.title}
                            className={`${styles.imageSlide} ${styles.fadeInEffect}`}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ActivityGallery
