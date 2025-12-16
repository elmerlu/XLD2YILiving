import styles from './Activities.module.css'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

const activitiesData = [
    {
        id: 1,
        title: '社區園藝工作坊',
        date: '2025-01-15',
        location: 'D2 頂樓花園',
        description: '邀請社區長輩與青年一同種植香草植物，打造可食地景。',
        category: '社區營造'
    },
    {
        id: 2,
        title: '二手市集與交換派對',
        date: '2025-02-02',
        location: '1F 交誼廳',
        description: '拿出家裡用不到的好物，來場斷捨離，並認識新鄰居！',
        category: '交流活動'
    },
    {
        id: 3,
        title: '長者手機教學班',
        date: '2025-02-10',
        location: '2F 會議室',
        description: '青年志工一對一教學，讓長輩也能輕鬆使用 LINE 與家人視訊。',
        category: '數位共融'
    },
    {
        id: 4,
        title: '親子繪本共讀',
        date: '2025-02-24',
        location: '1F 閱覽區',
        description: '週六下午的溫馨時光，大哥哥大姊姊說故事給小朋友聽。',
        category: '兒少陪伴'
    }
]

const Activities = () => {
    return (
        <div className="container">
            <div className={styles.header}>
                <h1 className={styles.title}>活動花絮</h1>
                <p className={styles.subtitle}>紀錄我們共同創造的美好回憶</p>
            </div>

            <div className={styles.grid}>
                {activitiesData.map((activity) => (
                    <Card key={activity.id} className={styles.card} interactive>
                        <div className={styles.cardImagePlaceholder}>
                            <span>{activity.category}</span>
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
                            <Button variant="ghost" size="sm" className={styles.readMore}>
                                更多紀錄 <ArrowRight size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Activities
