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
        title: '最新消息 Highlight！',
        description: '施工中',
        link: '#',
        color: '#38B2AC' // Teal
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
