// postbuild: make every SPA route a real static page on GitHub Pages.
// GitHub Pages answers unknown paths (e.g. /funding) with HTTP 404 (it only
// falls back to 404.html), so the browser logs "404 Not Found" even though the
// SPA still renders. Generating dist/<route>/index.html gives each route a real
// 200 response, and 404.html stays as a fallback for unknown/typo URLs.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const indexHtml = join(dist, 'index.html')

if (!existsSync(indexHtml)) {
    console.error('[postbuild] dist/index.html not found, did the build fail?')
    process.exit(1)
}

// Keep this list in sync with the <Route path="..."> entries in src/App.jsx
// ("/" is already dist/index.html, "/index" just redirects to "/", "/cropper" is DEV-only)
const routes = ['stories', 'guide', 'funding', 'activities', 'sync-status', 'index']

// Fallback page for any unknown URL
copyFileSync(indexHtml, join(dist, '404.html'))

for (const route of routes) {
    const dir = join(dist, route)
    mkdirSync(dir, { recursive: true })
    copyFileSync(indexHtml, join(dir, 'index.html'))
}

console.log(`[postbuild] 404.html + ${routes.length} route pages generated: ${routes.join(', ')}`)
