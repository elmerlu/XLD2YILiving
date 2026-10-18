# 興隆社宅 D2 青創回饋 募知募資網頁 (Xinglong D2 Youth Innovators Living)

為什麼要做這個網站？
社宅是一個很特別的居住型態——多數居民以6年為階段，居住、活動、流動於此，社區永遠的流動，新鄰居不斷的搬離，如果沒有好好記錄，許多寶貴的經驗和故事就會消失。

這樣的日常社宅生活，卻包含許多值得記錄的時刻

## 專案簡介

本網站用於展示計畫內容、活動紀錄、生活故事以及相關募資/募知資訊。
網站採用現代化靜態網頁技術建置，以提供最佳的瀏覽體驗與視覺呈現。

### 技術架構

*   **框架**: React 19 + Vite
*   **語言**: JavaScript (ES6+)
*   **樣式**: CSS Modules + CSS Variables
*   **路由**: React Router v7
*   **部署**: GitHub Pages

## 授權宣告 (License & Copyright)

本專案採用 **混合授權模式 (Hybrid License)**：

### 1. 程式碼 (Source Code) - MIT License
本專案的「程式碼邏輯」部分（包含 .js, .jsx, .css 等程式架構）採用 **MIT License** 授權。
歡迎開發者參考、學習或改寫本專案的程式架構。詳細條款請參閱 [LICENSE](./LICENSE) 檔案。

### 2. 內容與資產 (Content & Assets) - All Rights Reserved
本專案網站內的所有「內容資產」，包含但不限於：
*   所有照片、攝影作品
*   Logo 圖片、插畫、設計圖稿
*   文章文字、故事內容、訪談記錄
*   影片素材

**皆保留所有權利 (All Rights Reserved)**，歸屬於 **興隆社宅 D2 青年創新回饋計畫** 或原作者所有。
**未經未面授權，禁止擅自轉載、重製或用於商業用途。**

---

## 本地開發 (Development)

1.  Clone 專案：
    ```bash
    git clone https://github.com/elmerlu/XLD2YILiving.git
    ```
2.  安裝依賴：
    ```bash
    npm install
    ```
3.  啟動開發伺服器：
    ```bash
    npm run dev
    ```

## Medium 文章同步 (Stories 頁)

文章顯示採「紀錄 + 即時同步」雙層機制：

1. **紀錄**：`src/data/mediumArticles.json`，頁面一打開就顯示（離線、阻擋皆不受影響）。
2. **即時同步**：前端背景自動向 `rss2json`（備援為 `allorigins`）探測，成功即動態補上最新文章；若遇外圍服務阻擋則優雅降級顯示本地文章與專屬引導連結。

```bash
npm run sync:medium              # 同步並更新紀錄（Medium 發新文後執行）
npm run sync:medium -- --check   # 只比對紀錄與 Medium 差異，不寫檔（定期檢視用）
npm run sync:medium -- --health  # 測試各同步來源在 Node 環境下的可用性
```

> **內部檢測頁**：可透過 `/sync-status` 路由查看即時各來源在線燈號與文章比對狀態。

### 未來優化規劃 (TODO)
- [ ] **GitHub Actions 自動化定時同步**：建立 GitHub Actions 排程（Cron Job），每天定時在無 CORS 限制的環境執行 `npm run sync:medium` 並自動 commit / deploy。
- [ ] **Cloudflare Workers 專屬 RSS 代理**：自建輕量無伺服器 Worker，統一加上 CORS 標頭與邊緣快取，擺脫第三方公共 Proxy 的限制。

## 部署 (Deployment)

本專案配置為部署至 GitHub Pages：
```bash
npm run deploy
```
詳細部署流程請參考 [DEPLOY.md](./DEPLOY.md)。
