import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Info } from 'lucide-react'
import styles from './ActivityGallery.module.css'

// Import images directly
import lanternImg from '../../assets/images/lifestyle/lantern.png'
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
        link: "https://drive.google.com/file/d/1uDs7pjXG4vHbFz_taUkbn_leicG2fxl4/view"
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
