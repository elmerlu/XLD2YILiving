import styles from './FeatureGrid.module.css'
import { Link } from 'react-router-dom'

const features = [
    {
        id: 1,
        title: '初來乍到新鄰居的\n機智生活急救包',
        description: '第一次住社宅？第一次當社宅鄰居？<br>好多好多居住小知識這裡告訴你！',
        link: '/guide',
        color: '#FF7E67' // Coral
    },
    {
        id: 2,
        title: '在地深耕老朋友的\n地方生活故事圖',
        description: '社宅老住戶！社宅老鄰居！<br>許許多多社宅與周遭的小故事這裡一起看！',
        link: '/stories',
        color: '#4A5568' // Slate
    },
    {
        id: 3,
        title: '社宅花絮剪影',
        description: '施工中',
        link: '#',
        color: '#3182CE' // Blue
    },
    {
        id: 4,
        title: '生活募集令 - 共創生活記憶\n<small style="font-size: 0.6em; display: block; margin-top: 5px;">匯聚生活智慧，典藏獨家記憶</small>',
        description: '我要投知！募集你的「知識」與「故事」。<br>我們募集實用的生活懶人包，讓新鄰居輕鬆上手；<br>我們也募集珍貴的社宅故事，不讓記憶隨風而散。<br><br><span style="font-style: italic; color: #FFF;">🎁 參與徵文，就可獲得青創手作課作機會作為回饋品 !</span>',
        link: 'https://docs.google.com/forms/d/e/1FAIpQLSc5bCtiYOH_fUo1wFjGcPfaEFR_1dMRoqkpXC4Gpa4uHVJI8Q/viewform?usp=send_form',
        color: '#6B46C1', // Purple
        badge: '投稿'
    }
]

const FeatureGrid = () => {
    return (
        <div className={styles.grid}>
            {features.map((feature) => (
                <Link
                    key={feature.id}
                    to={feature.link}
                    className={styles.block}
                    style={{ '--block-color': feature.color }}
                >
                    {feature.badge && <div className={styles.badge}>{feature.badge}</div>}
                    <div className={styles.content}>
                        <h3 className={styles.title} dangerouslySetInnerHTML={{ __html: feature.title.replace(/\n/g, '<br/>') }} />
                        <p className={styles.desc} dangerouslySetInnerHTML={{ __html: feature.description }} />
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default FeatureGrid
