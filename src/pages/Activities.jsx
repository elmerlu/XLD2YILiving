import { useState } from 'react'
import styles from './Activities.module.css'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Calendar, MapPin, ArrowRight, ExternalLink } from 'lucide-react'

// Import images directly
import lanternImg from '../assets/images/lifestyle/lantern.png'
import christmasImg from '../assets/images/lifestyle/christmas.jpg'
import riverImg from '../assets/images/lifestyle/river.jpg'
import musicKitchenImg from '../assets/images/lifestyle/music-kitchen.png'
import sportsFitnessImg from '../assets/images/lifestyle/sports-fitness.svg'

const categories = ['全部', '手作活動', '廚藝烹飪', '運動活動', '主題型活動']

const activitiesData = [
    {
        id: 1,
        title: '【玩中學、做中學】剪紙 × 木工燈籠 DIY',
        date: '2026/01',
        location: '1F 交誼廳',
        description: '農曆新年親手製作一盞獨一無二喜氣燈籠，紅色剪紙貼上燈罩，讓柔和燈光透出圖案，迎接滿滿好運！',
        category: '手作活動',
        image: lanternImg,
        link: 'https://www.facebook.com/share/p/17sATRxakd/',
        linkLabel: '活動詳情'
    },
    {
        id: 2,
        title: '【手作興生活】叮叮噹！我的聖誕樹自己裝',
        date: '2025/12',
        location: '1F 交誼廳',
        description: '使用乾燥松果打造充滿自然香氣的小聖誕樹，組裝站立木製聖誕樹加上閃亮 LED 燈串，點亮溫暖冬日。',
        category: '手作活動',
        image: christmasImg
    },
    {
        id: 3,
        title: '手作興生活：絹印客與簇絨客工作坊',
        date: '常態開展',
        location: '1F 多功能室',
        description: '給大人的進階質感手作！學習絹印與簇絨技巧，並在回饋小卡上分享生活小知識，慢慢累積成社區的共同記憶。',
        category: '手作活動',
        image: lanternImg
    },
    {
        id: 4,
        title: '興隆路上・島嶼的餐桌：花生豬腳湯的故事',
        date: '10/17（六）',
        location: '中島廚房',
        description: '飲食文學 × 料理分享。邊喝湯邊朗讀文學段落，用電鍋蒸煮一鍋甘甜花生豬腳湯，把湯與溫暖故事一起帶回家。',
        category: '廚藝烹飪',
        image: musicKitchenImg,
        link: 'https://drive.google.com/file/d/1uDs7pjXG4vHbFz_taUkbn_leicG2fxl4/view',
        linkLabel: '活動講義 (PDF)'
    },
    {
        id: 5,
        title: '音樂灶咖，作伙開火！',
        date: '週末共炊',
        location: '社區共煮廚房',
        description: '邀請社區料理達人與樂手老師現場演奏，一邊學做菜一邊聽音樂，結束後把熱騰騰的料理打包回家當晚餐。',
        category: '廚藝烹飪',
        image: musicKitchenImg
    },
    {
        id: 6,
        title: 'D2 十二樓協力健身房',
        date: '每日開放',
        location: 'D2 12F 健身房',
        description: '由青創夥伴和住戶一起動手協力完成的運動空間，配備齊全，除了社宅住戶，也開放鄰近里民一起鍛鍊。',
        category: '運動活動',
        image: sportsFitnessImg
    },
    {
        id: 7,
        title: '樂齡活力體能與下班放鬆伸展',
        date: '常態活動',
        location: '空中跑道 / 12F',
        description: '長輩的樂齡運動、上班族的下班伸展與孩子的體能遊戲，不同年齡層都找得到適合自己的節奏。',
        category: '運動活動',
        image: sportsFitnessImg
    },
    {
        id: 8,
        title: '溪路小達人：家裡水邊這麼近（生態走讀）',
        date: '2026/01',
        location: '小坑溪、指南溪',
        description: '帶領大家運用 iNaturalist 觀察野草野花、觀測水質與地形，一同幫河川體檢，親近社區好鄰居。',
        category: '主題型活動',
        image: riverImg
    },
    {
        id: 9,
        title: '2026 勞權系列講座：搞懂勞保與勞退',
        date: '2026 講座',
        location: '2F 會議室',
        description: '與專業單位合作辦理民生知識講座，把日常必備的勞工權益與居住資訊帶回社區，保障生活安心。',
        category: '主題型活動',
        image: riverImg
    }
]

const Activities = () => {
    const [selectedCategory, setSelectedCategory] = useState('全部')

    const filteredActivities = selectedCategory === '全部'
        ? activitiesData
        : activitiesData.filter(item => item.category === selectedCategory)

    return (
        <div className="container">
            <div className={styles.header}>
                <h1 className={styles.title}>社宅花絮剪影</h1>
                <p className={styles.subtitle}>
                    四大類型社區活動紀實 —— 手作、灶咖、運動與走讀的溫暖日常
                </p>

                {/* Category Filter Tabs */}
                <div className={styles.filterContainer}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`${styles.filterButton} ${selectedCategory === category ? styles.activeFilter : ''}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {filteredActivities.map((activity) => (
                    <Card key={activity.id} className={styles.card} interactive>
                        <div className={styles.cardImageContainer}>
                            <img
                                src={activity.image}
                                alt={activity.title}
                                className={styles.cardImage}
                            />
                            <span className={styles.badge}>{activity.category}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.meta}>
                                <span className={styles.metaItem}>
                                    <Calendar size={14} /> {activity.date}
                                </span>
                                <span className={styles.metaItem}>
                                    <MapPin size={14} /> {activity.location}
                                </span>
                            </div>
                            <h3 className={styles.cardTitle}>{activity.title}</h3>
                            <p className={styles.cardDesc}>{activity.description}</p>
                            
                            {activity.link ? (
                                <a
                                    href={activity.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.actionLink}
                                >
                                    <span>{activity.linkLabel || '活動詳情'}</span>
                                    <ExternalLink size={16} />
                                </a>
                            ) : (
                                <div className={styles.actionPlaceholder}>
                                    <span>精彩回顧</span>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Activities
