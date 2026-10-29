/**
 * mediumFeed.js —— Medium 文章多重來源同步模組
 * ------------------------------------------------------------
 * 瀏覽器（Stories 頁）與 Node 腳本（scripts/fetch-medium.js）共用。
 * 不依賴 DOMParser，用正規表示式解析，兩邊都能跑。
 *
 * 運作方式：照順序一個一個試，成功就停；全部失敗就丟錯，
 * 由呼叫端退回「已儲存的文章紀錄」(src/data/mediumArticles.json)。
 *
 * 統一輸出格式（Article）：
 *   { id, title, link, pubDate(ISO), thumbnail, excerpt, categories[] }
 * ------------------------------------------------------------
 */

export const MEDIUM_USER = 'xinglongphd2'
export const MEDIUM_URL = `https://medium.com/@${MEDIUM_USER}`
export const FEED_URL = `https://medium.com/feed/@${MEDIUM_USER}`

const enc = encodeURIComponent(FEED_URL)

/* ---------- 共用小工具 ---------- */

/** 解碼常見 HTML 實體 */
const decode = (s = '') =>
    s
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
        .replace(/&amp;/g, '&')

/** 去 HTML 標籤 → 純文字摘要 */
export const toExcerpt = (html = '', len = 150) => {
    const text = decode(
        html
            .replace(/<figcaption[\s\S]*?<\/figcaption>/g, '') // 圖說不算內文
            .replace(/<[^>]*>?/g, ' ')
    )
        .replace(/\s+/g, ' ')
        .trim()
    return text.length > len ? text.substring(0, len) + '...' : text
}

/** Medium RSS 沒有縮圖欄位 → 取內文第一張圖（排除 1x1 追蹤像素），並換成 1024px */
export const firstImage = (html = '') => {
    const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
    const src = imgs.find((s) => !s.includes('/_/stat')) || ''
    return src.replace(/\/max\/\d+\//, '/max/1024/')
}

/** 去掉 ?source=rss... 追蹤參數 */
const cleanLink = (link = '') => link.split('?')[0]

/** 統一 id：都用 https://medium.com/p/xxxx 形式 */
const toId = (guid, link) => guid || cleanLink(link)

/* ---------- 三種格式的解析器 ---------- */

/** 原始 RSS XML */
export const parseRssXml = (xml) => {
    const pick = (it, tag) => {
        const m = it.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
        if (!m) return ''
        const raw = m[1].trim()
        const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/)
        return cdata ? cdata[1] : decode(raw)
    }
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
        const content = pick(it, 'content:encoded')
        return {
            id: toId(pick(it, 'guid'), pick(it, 'link')),
            title: pick(it, 'title'),
            link: cleanLink(pick(it, 'link')),
            pubDate: new Date(pick(it, 'pubDate')).toISOString(),
            thumbnail: firstImage(content),
            excerpt: toExcerpt(content),
            categories: [...it.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g)].map((m) => m[1]),
        }
    })
}

/** rss2json 格式 */
const parseRss2json = (data) => {
    if (data.status !== 'ok') throw new Error(data.message || 'rss2json status not ok')
    return data.items.map((i) => {
        const html = i.content || i.description || ''
        return {
            id: toId(i.guid, i.link),
            title: decode(i.title),
            link: cleanLink(i.link),
            // rss2json 時間格式 "2026-06-22 07:03:16"（UTC）
            pubDate: new Date(i.pubDate.replace(' ', 'T') + 'Z').toISOString(),
            thumbnail: firstImage(html) || i.thumbnail || '',
            excerpt: toExcerpt(html),
            categories: i.categories || [],
        }
    })
}

/* ---------- 來源清單（照順序嘗試） ---------- */

/**
 * 同步來源清單：
 *  - medium-direct: 僅 Node.js 腳本使用（不受瀏覽器 CORS 限制，直打官方 Feed）
 *  - rss2json: 前端主力即時轉換（帶有 CORS 標頭與全域快取）
 *  - allorigins: 前端備援代理（僅在 rss2json 失敗時嘗試）
 */
export const SOURCES = [
    {
        name: 'medium-direct',
        nodeOnly: true,
        url: FEED_URL,
        parse: async (res) => parseRssXml(await res.text()),
    },
    {
        name: 'rss2json',
        url: `https://api.rss2json.com/v1/api.json?rss_url=${enc}`,
        parse: async (res) => parseRss2json(await res.json()),
    },
    {
        name: 'allorigins',
        url: `https://api.allorigins.win/get?url=${enc}`,
        parse: async (res) => parseRssXml((await res.json()).contents || ''),
    },
]

/**
 * 檢測單一來源：回傳完整結果，不丟錯
 * @returns {Promise<{name, ok, ms, count, articles, error}>}
 *   瀏覽器中 fetch 直接 TypeError（Failed to fetch），多半是 CORS 被擋或網路不通
 */
export const probeSource = async (src, { isNode = false, timeoutMs = 10000 } = {}) => {
    const t0 = Date.now()
    try {
        const res = await fetch(src.url, {
            signal: AbortSignal.timeout(timeoutMs),
            // Node 抓 Medium 時帶瀏覽器 UA，比較不會被 Cloudflare 擋
            ...(isNode ? { headers: { 'User-Agent': 'Mozilla/5.0' } } : {}),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const articles = await src.parse(res)
        if (!articles.length) throw new Error('沒有任何文章（可能被擋或格式改變）')
        return { name: src.name, ok: true, ms: Date.now() - t0, count: articles.length, articles, error: null }
    } catch (err) {
        const isTimeout = err.name === 'TimeoutError' || err.name === 'AbortError'
        const isBlocked = !isNode && err instanceof TypeError // 瀏覽器的 "Failed to fetch"
        return {
            name: src.name,
            ok: false,
            ms: Date.now() - t0,
            count: 0,
            articles: [],
            error: isTimeout ? `逾時（>${timeoutMs / 1000}s）` : isBlocked ? 'CORS 被擋或網路不通' : err.message,
        }
    }
}

/**
 * 依序嘗試各來源，回傳第一個成功的結果
 * @param {object}   opts
 * @param {boolean}  opts.isNode     是否在 Node 環境（決定要不要用 nodeOnly 來源）
 * @param {number}   opts.timeoutMs  每個來源的逾時時間
 * @param {function} opts.onLog      紀錄每次嘗試的結果 (name, ok, detail)
 * @returns {Promise<{source: string, articles: Article[]}>}
 */
export const fetchMediumArticles = async ({ isNode = false, timeoutMs = 10000, onLog = () => {} } = {}) => {
    const list = SOURCES.filter((s) => isNode || !s.nodeOnly)
    for (const src of list) {
        const r = await probeSource(src, { isNode, timeoutMs })
        onLog(src.name, r.ok, r.ok ? `${r.count} 篇，${r.ms}ms` : `${r.error}，${r.ms}ms`)
        if (r.ok) return { source: src.name, articles: r.articles }
    }
    throw new Error('所有同步來源都失敗')
}

/**
 * 比對紀錄與最新抓到的文章
 * @returns {{ added: Article[], changed: Article[], archivedOnly: Article[] }}
 *   added        RSS 有、紀錄沒有（待收錄）
 *   changed      兩邊都有，但標題/連結/摘要/縮圖不同
 *   archivedOnly 紀錄有、RSS 已沒有（Medium 只給最近 10 篇，屬正常）
 */
export const diffArticles = (existing, live) => {
    const oldMap = new Map(existing.map((a) => [a.id, a]))
    const liveIds = new Set(live.map((a) => a.id))
    const added = live.filter((a) => !oldMap.has(a.id))
    const changed = live.filter((a) => {
        const o = oldMap.get(a.id)
        return o && (o.title !== a.title || o.link !== a.link || o.excerpt !== a.excerpt || o.thumbnail !== a.thumbnail)
    })
    const archivedOnly = existing.filter((a) => !liveIds.has(a.id))
    return { added, changed, archivedOnly }
}

/**
 * 合併：以 base 為底，live 有的同 id 文章用新資料覆蓋；依日期新到舊
 * 縮圖：新資料沒有時保留舊的
 */
export const mergeArticles = (base, live) => {
    const map = new Map(base.map((a) => [a.id, a]))
    live.forEach((a) => {
        const old = map.get(a.id)
        map.set(a.id, { ...old, ...a, thumbnail: a.thumbnail || old?.thumbnail || '' })
    })
    return [...map.values()].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
}
