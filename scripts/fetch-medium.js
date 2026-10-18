/**
 * fetch-medium.js —— Medium 文章同步與紀錄比對
 * ------------------------------------------------------------
 * 指令：
 *   npm run sync:medium            同步並寫入紀錄（src/data/mediumArticles.json）
 *   npm run sync:medium -- --check 只比對、不寫檔（定期檢視用）
 *   npm run sync:medium -- --health 逐一測試所有來源是否可用
 *
 * 紀錄規則：
 *  - 新文章 → 加入紀錄，標記 firstSyncedAt
 *  - 既有文章 → 更新內容，刷新 lastSeenAt
 *  - RSS 裡已經沒有的文章（Medium 只給最近 10 篇）→ 保留在紀錄，不刪除
 *  - 全部來源都失敗 → 不動紀錄
 * ------------------------------------------------------------
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { SOURCES, fetchMediumArticles, mergeArticles, probeSource, diffArticles } from '../src/utils/mediumFeed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT = path.resolve(__dirname, '../src/data/mediumArticles.json')

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const HEALTH = args.includes('--health')

const log = (name, ok, detail) => console.log(`  ${ok ? '✅' : '❌'} ${name.padEnd(15)} ${detail}`)

/** 健康檢查：每個來源都打一次，不管成功與否 */
const healthCheck = async () => {
    console.log('來源健康檢查（Node 環境，不受 CORS 限制；瀏覽器結果請看 /sync-status 頁）\n')
    for (const src of SOURCES) {
        const r = await probeSource(src, { isNode: true, timeoutMs: 15000 })
        const note = src.nodeOnly ? '（僅腳本用）' : ''
        log(src.name, r.ok, r.ok ? `${r.count} 篇，${r.ms}ms ${note}` : `${r.error}，${r.ms}ms`)
    }
}

const diff = diffArticles

const main = async () => {
    if (HEALTH) return healthCheck()

    console.log(`同步 Medium 文章${CHECK_ONLY ? '（只比對，不寫檔）' : ''}\n`)
    const { source, articles } = await fetchMediumArticles({ isNode: true, timeoutMs: 15000, onLog: log })

    const existing = fs.existsSync(OUTPUT) ? JSON.parse(fs.readFileSync(OUTPUT, 'utf8')) : []
    const { added, changed, archivedOnly } = diff(existing, articles)

    // ---- 比對報告 ----
    console.log(`\n使用來源：${source}`)
    console.log(`RSS 目前 ${articles.length} 篇｜紀錄原有 ${existing.length} 篇\n`)
    console.log(`🆕 新文章 ${added.length} 篇`)
    added.forEach((a) => console.log(`   + ${a.pubDate.slice(0, 10)}  ${a.title}`))
    console.log(`✏️  內容有變動 ${changed.length} 篇`)
    changed.forEach((a) => console.log(`   ~ ${a.pubDate.slice(0, 10)}  ${a.title}`))
    console.log(`📦 RSS 已沒有、紀錄保留 ${archivedOnly.length} 篇`)
    archivedOnly.forEach((a) => console.log(`   = ${a.pubDate.slice(0, 10)}  ${a.title}（最後出現：${a.lastSeenAt?.slice(0, 10) || '未知'}）`))

    if (CHECK_ONLY) {
        console.log('\n（--check 模式，未寫入紀錄）')
        return
    }

    // ---- 寫入紀錄 ----
    const now = new Date().toISOString()
    const oldMap = new Map(existing.map((a) => [a.id, a]))
    const stamped = articles.map((a) => ({
        ...a,
        firstSyncedAt: oldMap.get(a.id)?.firstSyncedAt || now,
        lastSeenAt: now,
    }))
    const merged = mergeArticles(existing, stamped)
    fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2) + '\n', 'utf8')
    console.log(`\n✅ 紀錄已更新，共 ${merged.length} 篇 → src/data/mediumArticles.json`)
}

main().catch((err) => {
    console.error(`\n❌ 同步失敗（紀錄未變動）：${err.message}`)
    process.exit(1)
})
