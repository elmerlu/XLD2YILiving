import fundingIntroImg from '../assets/funding-intro.jpg'
import Card from '../components/ui/Card'
import styles from './Funding.module.css'
import InnovatorGrid from '../components/funding/InnovatorGrid'

const Funding = () => {
    return (
        <div className={styles.container}>
            {/* Hero / Title Section */}
            <div className={styles.hero}>
                <h1 className={styles.heroTitle}>興隆社宅2區 募知募資網站 是什麼？</h1>
                <p className={styles.heroText}>
                    歡迎來到興隆社宅2區募知募資平台！<br />
                    這個網站是由一群住在興隆社宅的青創戶自發製作的。<br />
                    我們不是專業的網站開發者，但我們是一群熱愛這個社區的居民。
                </p>
                <img
                    src={fundingIntroImg}
                    alt="興隆社宅活動"
                    className={styles.heroImage}
                />
            </div>

            {/* Main Content Sections */}
            <div className={styles.contentGrid}>

                {/* Section 1: 為什麼要做這個網站 */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>為什麼要做這個網站？</h2>
                    <p className={styles.textBlock}>
                        社宅是一個很特別的居住型態——多數居民以6年為階段，居住、活動、流動於此，社區永遠的流動，新鄰居不斷的搬離，如果沒有好好記錄，許多寶貴的經驗和故事就會消失。
                    </p>
                    <div className={styles.highlightBox}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.2rem', textAlign: 'center' }}>
                            這樣的日常社宅生活，卻包含許多值得記錄的時刻
                        </p>
                    </div>

                    <div className={styles.quoteGroup}>
                        <div className={styles.quoteBlock}>
                            <h3 className={styles.quoteTitle}>“豐富的生活資訊”</h3>
                            <p className={styles.quoteText}>
                                從入住、居住到退租，每個階段都有許多實用資訊。社宅由國家興建，不同於一般租屋經驗，新住戶需要知道水電怎麼辦、垃圾怎麼丟；住久了想知道哪裡可以辦活動、怎麼認識鄰居。這些生活智慧值得好好整理，讓大家盡快融入社區。
                            </p>
                        </div>
                        <div className={styles.quoteBlock}>
                            <h3 className={styles.quoteTitle}>“珍貴的社區經驗”</h3>
                            <p className={styles.quoteText}>
                                社宅住戶或許會隨著時間流動，然後社宅與周邊鄰里卻會累積下來，前人發現的好店家、辦過的成功活動、解決問題的好方法......這些經驗如果沒有記錄下來，每一批新住戶都要重新摸索。我們想把這些集體智慧保存下來，變成社區的共同資產，作為未來新住戶一份最珍貴的入厝禮。
                            </p>
                        </div>
                        <div className={styles.quoteBlock}>
                            <h3 className={styles.quoteTitle}>“動人的社宅故事”</h3>
                            <p className={styles.quoteText}>
                                社宅不只是一個住的地方，他更是一個有機體，比起傳統型態的社區、都市型的大樓聚落，他更匯聚了一群多元的族群共生共榮於此，這裡有青創戶的創意、鄰里的互助、跨世代的交流。這些溫暖的故事值得被記錄、被分享，讓更多人認識「社會住宅」的真實樣貌。
                            </p>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>所以，我們創立了這個網站</h2>
                    <div className={styles.conceptBox}>
                        <div className={styles.conceptItem}>
                            <strong>「募知」</strong> —— 募集知識，把生活資訊整理成實用的懶人包，讓每個住戶都能輕鬆掌握社區生活。
                        </div>
                        <div className={styles.conceptItem}>
                            <strong>「募資」</strong> —— 募集故事與經驗，不讓任何珍貴的社區記憶隨著住戶搬遷而消失。
                        </div>
                    </div>

                    <p className={styles.textBlock}>這個網站不只是資訊平台，更是：</p>
                    <div className={styles.featureList}>
                        <p className={styles.featureItem}>📚 <span><strong>社區的百科全書</strong>：解答你所有關於社宅生活的疑問</span></p>
                        <p className={styles.featureItem}>📷 <span><strong>社區的相簿</strong>：記錄每一個精彩的活動和溫暖的時刻</span></p>
                        <p className={styles.featureItem}>🗺️ <span><strong>社區的藏寶圖</strong>：前人的經驗都是後人的寶藏</span></p>
                        <p className={styles.featureItem}>📝 <span><strong>社區的成果展</strong>：讓外界看見社宅的活力與價值</span></p>
                    </div>
                </Card>

                {/* Section 2: 我們是誰 */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>我們是誰？青創戶的故事</h2>
                    <p className={styles.textBlock} style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        你可能會好奇，這些青創戶是誰呢？
                    </p>
                    <p className={styles.textBlock}>
                        我們是透過台北市政府都發局「青年創新回饋計畫」徵選入住的居民。簡單說，我們的租金沒有比較便宜，但我們有更多的熱情！
                    </p>
                    <p className={styles.textBlock}>
                        這個計畫從2017年開始，是全國首創的社區營造模式。申請者要提出社區回饋計畫，通過審核後可以免抽籤入住。我們就像社區的「種子」，用自己的專長為社區帶來活力。
                    </p>

                    <h3 className={styles.heroTitle} style={{ fontSize: '1.5rem', marginTop: '2rem' }}>青創戶在做什麼？</h3>
                    <p className={styles.textBlock}>每個青創戶都有自己的專長：</p>
                    <ul className={styles.activityGrid}>
                        <li className={styles.activityItem}>🧘 有人帶大家做瑜珈、健身</li>
                        <li className={styles.activityItem}>👨‍🍳 有人辦共餐聚會、料理教室</li>
                        <li className={styles.activityItem}>👶 有人做親子手作、說故事時間</li>
                        <li className={styles.activityItem}>♻️ 有人辦二手市集、資源交換</li>
                        <li className={styles.activityItem}>📚 有人組讀書會、電影欣賞</li>
                    </ul>
                    <div className={styles.highlightBox} style={{ textAlign: 'center', fontStyle: 'italic' }}>
                        這些活動都是無償舉辦的，純粹因為我們相信：好的社區需要大家一起經營。
                    </div>
                </Card>

                {/* Section 3: 社宅是什麼 */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>但社宅到底是什麼？</h2>
                    <p className={styles.textBlock}>
                        說了這麼多，你可能還是想問：社會住宅到底是什麼？是給弱勢族群住的嗎？
                    </p>
                    <p className={styles.textBlock} style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: '2rem' }}>
                        其實不完全是這樣！讓我們從頭說起。
                    </p>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 className={styles.lifestyleColumn} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                            <span style={{ borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>社宅 = 政府當房東的長期租屋</span>
                        </h3>
                        <p className={styles.textBlock}>社會住宅是政府興建或補助興建的住宅，只租不賣，以較低的租金出租給民眾。</p>
                        <p className={styles.textBlock}>想像一下，社宅就像是政府經營的「品質保證租屋」：</p>
                        <ul className={styles.checkList}>
                            <li className={styles.checkItem}>
                                <span className={styles.checkIcon}>✅</span>
                                <div>租金比市價便宜（約市價5-8折）</div>
                            </li>
                            <li className={styles.checkItem}>
                                <span className={styles.checkIcon}>✅</span>
                                <div>房子品質有保證（新建築、有管理）</div>
                            </li>
                            <li className={styles.checkItem}>
                                <span className={styles.checkIcon}>✅</span>
                                <div>租期穩定（3+3年，最長可住6年）</div>
                            </li>
                            <li className={styles.checkItem}>
                                <span className={styles.checkIcon}>✅</span>
                                <div>不用擔心惡房東或突然被趕走</div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={styles.lifestyleColumn} style={{ display: 'inline-block', marginBottom: '1rem' }}>
                            <span style={{ borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', fontSize: '1.3rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>不是只給特定族群</span>
                        </h3>
                        <p className={styles.textBlock}>
                            依據《住宅法》規定，社宅會提供至少40%給經濟或社會弱勢族群，其餘開放給一般市民申請。
                        </p>
                        <p className={styles.textBlock}>主要申請條件包括：</p>
                        <div style={{ background: 'var(--color-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-main)' }}>
                                <li style={{ marginBottom: '0.5rem' }}>在台北市設籍或在此就學就業</li>
                                <li style={{ marginBottom: '0.5rem' }}>家庭成員都沒有自有住宅</li>
                                <li>家庭年收入低於台北市50%分位點（2025年為180萬元以下）</li>
                            </ul>
                        </div>
                        <p className={styles.textBlock}>
                            所以社宅是一個「混居」的社區，住著各種背景的居民——剛出社會的年輕人、小家庭、單親家庭、銀髮族、身心障礙朋友。大家都是鄰居！
                        </p>
                    </div>
                </Card>

                {/* Section 4: 社宅想創造的未來 */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>社宅想創造的未來</h2>
                    <div className={styles.visionGrid}>
                        <div className={styles.visionCard}>
                            <h3 className={styles.visionTitle}>居住正義的實踐</h3>
                            <p className={styles.quoteText} style={{ fontStyle: 'normal' }}>
                                讓買不起房子的人，也能有穩定、有品質的居住環境。不用一輩子為了房貸煩惱，可以把錢用在提升生活品質和追求夢想上。
                            </p>
                        </div>
                        <div className={styles.visionCard}>
                            <h3 className={styles.visionTitle}>打破階級的圍牆</h3>
                            <p className={styles.quoteText} style={{ fontStyle: 'normal' }}>
                                社宅要打破過去「國宅」的刻板印象，證明不同收入、不同背景的人可以當好鄰居。透過公共參與和相互理解，建立真正友善的社區。
                            </p>
                        </div>
                        <div className={styles.visionCard}>
                            <h3 className={styles.visionTitle}>永續的互助精神</h3>
                            <p className={styles.quoteText} style={{ fontStyle: 'normal' }}>
                                房子只租不賣，確保這些資源永遠能幫助需要的人。今天你需要，就住社宅；未來換別人需要，就換他住。這是一種城市的互助精神。
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Section 5: 興隆社宅的日常 */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>興隆社宅的日常</h2>
                    <p className={styles.textBlock}>
                        在興隆社宅，你會發現這裡不只是「住」的地方，更是「生活」的地方。
                    </p>
                    <div className={styles.lifestyleGrid}>
                        <div className={styles.lifestyleColumn}>
                            <h3>平日晚上，你可能會看到：</h3>
                            <ul className={styles.lifestyleList}>
                                <li>一樓教室有瑜珈課正在進行</li>
                                <li>交誼廳傳來料理教室的香味</li>
                                <li>中庭有孩子們在玩耍</li>
                                <li>小花園躺椅上有鄰居在交換育兒心得</li>
                            </ul>
                        </div>
                        <div className={styles.lifestyleColumn}>
                            <h3>週末更熱鬧：</h3>
                            <ul className={styles.lifestyleList}>
                                <li>早上的晨跑團</li>
                                <li>下午的手作市集</li>
                                <li>傍晚的電影欣賞</li>
                                <li>不定期的社區音樂會</li>
                            </ul>
                        </div>
                    </div>
                    <p className={styles.textBlock} style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
                        這些都是青創戶和熱心居民一起創造的社區生活。
                    </p>
                </Card>



                {/* Section 6: 一起寫下社區的故事 (CTA) */}
                <Card padding="lg">
                    <h2 className={styles.sectionTitle}>一起寫下社區的故事</h2>
                    <p className={styles.textBlock}>
                        社宅不是終點，而是人生的中繼站。在這裡，我們一起生活、一起成長，然後帶著美好的回憶，繼續人生的下一段旅程。
                        不管你是新住戶、老鄰居，還是對社宅好奇的朋友，都歡迎你：
                    </p>
                    <div className={styles.ctaGrid}>
                        <div className={styles.ctaCard}>
                            <span className={styles.ctaIcon}>📱</span>
                            <p className={styles.ctaTitle}>追蹤粉專</p>
                            <p className={styles.ctaDesc}>掌握最新活動資訊</p>
                        </div>
                        <div className={styles.ctaCard}>
                            <span className={styles.ctaIcon}>💬</span>
                            <p className={styles.ctaTitle}>加入群組</p>
                            <p className={styles.ctaDesc}>認識更多鄰居朋友</p>
                        </div>
                        <div className={styles.ctaCard}>
                            <span className={styles.ctaIcon}>🙋</span>
                            <p className={styles.ctaTitle}>參加活動</p>
                            <p className={styles.ctaDesc}>創造美好社區回憶</p>
                        </div>
                        <div className={styles.ctaCard}>
                            <span className={styles.ctaIcon}>✏️</span>
                            <p className={styles.ctaTitle}>分享經驗</p>
                            <p className={styles.ctaDesc}>讓網站內容更豐富</p>
                        </div>
                    </div>

                    <div className={styles.finalMessage}>
                        <p style={{ marginBottom: '1rem' }}>記住，興隆社宅不只是一個地址，更是一個充滿可能的家。<br />讓我們一起努力，讓這裡成為台北最有溫度的社區！</p>
                        <p style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--color-text-main)', marginTop: '2rem' }}>
                            如果你有任何問題或建議，歡迎點擊右下角聯絡我們，或直接到粉絲專頁留言。
                        </p>
                    </div>
                </Card>

                {/* Section 7: 青創夥伴牆 Innovators Showcase (Final Section) */}
                <Card padding="lg">
                    <InnovatorGrid />
                </Card>

            </div>
        </div>
    )
}

export default Funding
