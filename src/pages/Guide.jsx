import { useState } from 'react'
import Card from '../components/ui/Card'
import styles from './Guide.module.css'

const Guide = () => {
    const [activeTab, setActiveTab] = useState('activities')

    const tabs = [
        {
            id: 'activities',
            title: '社宅不無聊',
            desc: '青創活動紀錄',
            color: '#FF7E67'
        },
        {
            id: 'moving',
            title: '入厝前中後',
            desc: '搬遷相關須知',
            color: '#3182CE'
        },
        {
            id: 'housing',
            title: '社宅很好用',
            desc: '住屋相關資訊',
            color: '#48BB78'
        }
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'activities':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>社宅不無聊｜青創活動紀錄</h2>
                        <Card padding="lg">
                            <p>這裡將展示社宅豐富的活動紀錄，包括工作坊、節慶活動等精彩時刻。</p>
                            {/* TODO: Add activity content */}
                        </Card>
                    </div>
                )
            case 'moving':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>入厝前中後｜搬遷相關須知</h2>
                        <Card padding="lg">
                            <p>準備搬進來了嗎？這裡有你從簽約、點交到入住後需要知道的所有流程。</p>
                            {/* TODO: Add moving guide content */}
                        </Card>
                    </div>
                )
            case 'housing':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>社宅很好用｜住屋相關資訊</h2>
                        <Card padding="lg">
                            <p>東西壞了怎麼修？管理中心在哪裡？這裡匯集了所有的設施設備使用指南。</p>
                            {/* TODO: Add housing info content */}
                        </Card>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>初來乍到新鄰居的機智生活急救包</h1>
                <p className={styles.subtitle}>
                    第一次住社宅？第一次當社宅鄰居？好多好多居住小知識這裡告訴你！
                </p>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabContainer}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        type="button"
                    >
                        <span className={styles.tabTitle}>{tab.title}</span>
                        <span className={styles.tabDesc}>{tab.desc}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {renderContent()}
            </div>
        </div>
    )
}

export default Guide
