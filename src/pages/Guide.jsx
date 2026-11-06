import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { ShieldAlert, ArrowRight, Sparkles, Utensils, Dumbbell, Compass } from 'lucide-react'
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
                            <h3 className={styles.cardTitle}>四大類型社區活動，隨時精彩開展！</h3>
                            <p className={styles.cardText}>
                                興隆 D2 社宅凝聚了多元有趣的青創活動，從動手創作、料理共餐，到體能運動與生態走讀，不同年齡層都能找到專屬的生活樂趣。
                            </p>
                            
                            <div className={styles.cardGrid}>
                                <div className={styles.categoryCard}>
                                    <div className={styles.categoryHeader}>
                                        <Sparkles size={20} className={styles.categoryIcon} />
                                        <h4>手作活動</h4>
                                    </div>
                                    <p>絹印客、簇絨客、新年剪紙木工燈籠與聖誕樹 DIY，用雙手記錄溫暖日常。</p>
                                </div>
                                <div className={styles.categoryCard}>
                                    <div className={styles.categoryHeader}>
                                        <Utensils size={20} className={styles.categoryIcon} />
                                        <h4>廚藝烹飪</h4>
                                    </div>
                                    <p>「興隆路上・島嶼的餐桌」品味花生豬腳湯故事，「音樂灶咖」現場音樂演奏共煮共食。</p>
                                </div>
                                <div className={styles.categoryCard}>
                                    <div className={styles.categoryHeader}>
                                        <Dumbbell size={20} className={styles.categoryIcon} />
                                        <h4>運動活力</h4>
                                    </div>
                                    <p>D2 十二樓協力健身房、樂齡體能運動與下班伸展，鄰居作伙鍛鍊打氣。</p>
                                </div>
                                <div className={styles.categoryCard}>
                                    <div className={styles.categoryHeader}>
                                        <Compass size={20} className={styles.categoryIcon} />
                                        <h4>主題走讀</h4>
                                    </div>
                                    <p>溪路小達人生態踏查、2026 勞權系列講座，把重要民生與文化知識帶回家。</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <Link to="/activities">
                                    <Button variant="primary">
                                        前往社宅花絮剪影專頁 <ArrowRight size={18} style={{ marginLeft: '6px' }} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )
            case 'moving':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>入厝前中後｜搬遷相關須知</h2>
                        <Card padding="lg">
                            <h3 className={styles.cardTitle}>入住社宅指南與便民叮嚀</h3>
                            <p className={styles.cardText}>
                                準備搬進興隆 D2 了嗎？從簽約公證、點交驗屋、水電瓦斯開戶，到家具搬遷與裝修須知，各項常見問答陸續彙整於此。
                            </p>
                            <ul className={styles.guideList}>
                                <li><strong>簽約與公證：</strong>備齊身分證明與租金押金，依住都中心公告排程至現場辦理。</li>
                                <li><strong>點交驗屋：</strong>入住當日會同物業人員逐項確認室內設備清單與水電錶度數。</li>
                                <li><strong>大型家具搬遷：</strong>請事先向管理中心登記貨梯使用時段，避免尖峰碰撞。</li>
                            </ul>
                        </Card>
                    </div>
                )
            case 'housing':
                return (
                    <div>
                        <h2 className={styles.sectionTitle}>社宅很好用｜住屋相關資訊</h2>
                        
                        {/* 依 H03 決議：移置火災避難教學影片 */}
                        <Card padding="lg" style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                                <ShieldAlert size={24} color="#e53e3e" />
                                <h3 className={styles.cardTitle} style={{ margin: 0, color: '#c53030' }}>
                                    發生火災怎麼避難？（社宅防災實地教學）
                                </h3>
                            </div>
                            <p className={styles.cardText}>
                                住興隆社宅 D2，如果真的發生火災，該怎麼正確避難？請花幾分鐘觀看實地拍攝的逃生避難重點：
                            </p>

                            <div className={styles.videoContainer}>
                                <iframe
                                    src="https://www.youtube.com/embed/F9vFcgdWyDc?enablejsapi=1"
                                    title="住興隆社宅D2，如果真的發生火災，怎麼避難?"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className={styles.videoIframe}
                                />
                            </div>

                            <ul className={styles.guideList}>
                                <li><strong>梯間防火門常時關閉：</strong>逃生梯的防火門平時務必隨手關緊，不可用物品擋住，才能有效阻隔火勢與濃煙向上竄升。</li>
                                <li><strong>絕不搭乘電梯：</strong>火災時隨時可能斷電受困，必須由安全梯循避難方向往下逃生。</li>
                                <li><strong>煙霧過大時就地避難：</strong>若開門發現走廊或樓梯間濃煙密布，切勿冒險強行穿越！應立即退回室內、關緊房門並以毛巾衣物塞住門縫阻絕煙霧，撥打 119 明確告知受困位置等待救援。</li>
                            </ul>
                        </Card>

                        <Card padding="lg">
                            <h3 className={styles.cardTitle}>物業管理與維修報修指南</h3>
                            <p className={styles.cardText}>
                                水龍頭滴水？燈具故障？您可至 1F 物業管理中心填單登記，或透過臺北市政府社宅報修系統進行線上報修，由專人排程修繕。
                            </p>
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
