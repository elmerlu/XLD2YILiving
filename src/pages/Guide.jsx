import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    FileText,
    ExternalLink,
    Search,
    ChevronDown,
    HelpCircle,
    AlertCircle,
    Sparkles,
    Utensils,
    Dumbbell,
    Compass,
    ArrowRight
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import faqData from '../data/guideFaq.json'
import styles from './Guide.module.css'

const Guide = () => {
    // 主分頁：'moving'（入厝前中後）| 'housing'（社宅很好用）| 'activities'（社宅不無聊）
    const [activeTab, setActiveTab] = useState('moving')
    const [selectedCategory, setSelectedCategory] = useState('全部')
    const [searchTerm, setSearchTerm] = useState('')
    
    // Accordion 展開狀態（預設全數展開，方便快速瀏覽，點擊可單獨收合）
    const [expandedIds, setExpandedIds] = useState(() => {
        const ids = {}
        faqData.faqList.forEach(item => { ids[item.id] = true })
        return ids
    })

    const tabs = [
        {
            id: 'moving',
            title: '入厝前中後',
            desc: '入住、點交與退租問答',
            color: '#3182CE'
        },
        {
            id: 'housing',
            title: '社宅很好用',
            desc: '日常、修繕、公設與規範',
            color: '#48BB78'
        },
        {
            id: 'activities',
            title: '社宅不無聊',
            desc: '四大活動與社區交流',
            color: '#FF7E67'
        }
    ]

    // 當切換主 Tab 時，重設子分類為「全部」
    const handleTabChange = (tabId) => {
        setActiveTab(tabId)
        setSelectedCategory('全部')
        setSearchTerm('')
    }

    // 當前主分頁底下的所有問題
    const currentTabFaqs = useMemo(() => {
        return faqData.faqList.filter(item => item.tab === activeTab)
    }, [activeTab])

    // 當前主分頁所包含的子分類清單
    const subCategories = useMemo(() => {
        const set = new Set(currentTabFaqs.map(item => item.category))
        return ['全部', ...Array.from(set)]
    }, [currentTabFaqs])

    // 依「子分類」與「關鍵字」過濾
    const filteredFaqs = useMemo(() => {
        return currentTabFaqs.filter(item => {
            const matchCategory = selectedCategory === '全部' || item.category === selectedCategory
            const matchSearch = searchTerm.trim() === '' ||
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase())
            return matchCategory && matchSearch
        })
    }, [currentTabFaqs, selectedCategory, searchTerm])

    // 切換單一問答展開/收合
    const toggleExpand = (id) => {
        setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>初來乍到新鄰居的機智生活急救包</h1>
                <p className={styles.subtitle}>
                    第一次住社宅？第一次當社宅鄰居？完整收錄住戶規約、點交退租、水電報修到社區活動的實用指南！
                </p>

                {/* 官方規約手冊下載公告欄 */}
                <div className={styles.handbookNotice}>
                    <div className={styles.handbookInfo}>
                        <FileText size={22} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                        <div>
                            <strong>回答依《興隆D2社會住宅住戶規約手冊》（{faqData.handbook.updatedAt}）整理</strong>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                {faqData.handbook.note}
                            </div>
                        </div>
                    </div>
                    <a
                        href={faqData.handbook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.handbookBtn}
                    >
                        <span>下載規約手冊 (PDF)</span>
                        <ExternalLink size={15} />
                    </a>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className={styles.tabContainer}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                        type="button"
                    >
                        <span className={styles.tabTitle}>{tab.title}</span>
                        <span className={styles.tabDesc}>{tab.desc}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {/* 若為「社宅不無聊」分頁，上方額外展示四大類活動專屬導航卡片 */}
                {activeTab === 'activities' && (
                    <Card padding="lg" style={{ marginBottom: '2.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ fontSize: '1.45rem', marginBottom: '0.75rem', border: 'none' }}>
                            社區四大類型活動，精彩輪播開展！
                        </h2>
                        <p style={{ color: 'var(--color-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                            興隆 D2 的活動跟首頁「興隆軌跡」同樣分為四大類型。每場活動皆記錄時間、地點與生活點滴：
                        </p>

                        <div className={styles.cardGrid}>
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <Sparkles size={20} className={styles.categoryIcon} />
                                    <h4>手作活動</h4>
                                </div>
                                <p>絹印客、簇絨客、新年剪紙木工燈籠與聖誕樹 DIY，用雙手讓生活變有趣。</p>
                            </div>
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <Utensils size={20} className={styles.categoryIcon} />
                                    <h4>廚藝烹飪</h4>
                                </div>
                                <p>「興隆路上・島嶼的餐桌」品味花生豬腳湯，「音樂灶咖」音樂演奏共煮共餐。</p>
                            </div>
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <Dumbbell size={20} className={styles.categoryIcon} />
                                    <h4>運動活力</h4>
                                </div>
                                <p>12 樓協力健身房、樂齡體能運動與下班放鬆伸展，老中青都找得到運動節奏。</p>
                            </div>
                            <div className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <Compass size={20} className={styles.categoryIcon} />
                                    <h4>主題走讀</h4>
                                </div>
                                <p>溪路小達人生態踏查、2026 勞權系列講座，把重要民生與文化知識帶回家。</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <Link to="/activities">
                                <Button variant="primary">
                                    前往「社宅花絮剪影」看所有活動 <ArrowRight size={18} style={{ marginLeft: '6px' }} />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}

                {/* Toolbar: Search & Sub-category Pills */}
                <div className={styles.toolbar}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="搜尋問答關鍵字（例：垃圾、磁卡、退租、瓦斯...）"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                            共找到 <strong>{filteredFaqs.length}</strong> 則相關問答
                        </div>
                    </div>

                    {/* Sub-category Pills */}
                    {subCategories.length > 2 && (
                        <div className={styles.subFilters}>
                            {subCategories.map((subCat) => (
                                <button
                                    key={subCat}
                                    type="button"
                                    className={`${styles.subFilterBtn} ${selectedCategory === subCat ? styles.activeSubFilter : ''}`}
                                    onClick={() => setSelectedCategory(subCat)}
                                >
                                    {subCat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* FAQ List */}
                {filteredFaqs.length > 0 ? (
                    <div className={styles.faqStack}>
                        {filteredFaqs.map((faq) => {
                            const isExpanded = !!expandedIds[faq.id]
                            return (
                                <div key={faq.id} className={styles.faqItem}>
                                    {/* Question Header */}
                                    <button
                                        type="button"
                                        className={styles.faqHeader}
                                        onClick={() => toggleExpand(faq.id)}
                                        aria-expanded={isExpanded}
                                    >
                                        <div className={styles.faqTitleGroup}>
                                            <div className={styles.qBadge}>Q</div>
                                            <h3 className={styles.questionText}>{faq.question}</h3>
                                        </div>

                                        <div className={styles.faqMetaGroup}>
                                            <span className={styles.categoryTag}>{faq.category}</span>
                                            {faq.pending && (
                                                <span className={styles.pendingTag}>
                                                    【待補】待物管確認
                                                </span>
                                            )}
                                            <ChevronDown
                                                size={20}
                                                className={`${styles.chevronIcon} ${isExpanded ? styles.chevronOpen : ''}`}
                                            />
                                        </div>
                                    </button>

                                    {/* Answer Body */}
                                    {isExpanded && (
                                        <div className={styles.faqBody}>
                                            <p className={styles.answerText}>{faq.answer}</p>

                                            {/* 若有內嵌教學影片（如火災避難） */}
                                            {faq.videoId && (
                                                <div className={styles.faqVideoWrapper}>
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${faq.videoId}?enablejsapi=1`}
                                                        title={faq.question}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                        className={styles.faqVideoIframe}
                                                    />
                                                </div>
                                            )}

                                            {/* 來源與相關連結 */}
                                            <div className={styles.sourceFooter}>
                                                <div className={styles.sourceItem}>
                                                    <span>依據來源：</span>
                                                    {faq.sourceUrl ? (
                                                        <a
                                                            href={faq.sourceUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.sourceLink}
                                                        >
                                                            <span>{faq.source}</span>
                                                            <ExternalLink size={13} />
                                                        </a>
                                                    ) : (
                                                        <span>{faq.source}</span>
                                                    )}
                                                </div>

                                                {faq.link && (
                                                    <a
                                                        href={faq.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.faqActionBtn}
                                                    >
                                                        <span>{faq.linkLabel || '外部連結'}</span>
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <HelpCircle size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                        <p>找不到符合「{searchTerm}」的問答內容，請嘗試其他關鍵字或切換分類。</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Guide
