# Xinglong D2 Youth Innovators Living Platform

> A dedicated community platform documenting life stories, creative initiatives, and collaborative knowledge/fundraising for the Xinglong Public Housing D2 Youth Innovation Project.

### Why This Project?
Public housing is a unique living arrangement—most residents stay for up to six years, living, engaging, and transitioning through the community. Because neighbors continually arrive and depart in this dynamic flow, many valuable stories, experiences, and community bonds would easily be lost if not mindfully recorded. 

This platform exists to capture and preserve those precious everyday moments.

---

## Overview

This website showcases project initiatives, activity archives, community stories, and collaborative fundraising/knowledge-sharing opportunities. It is built as a high-performance, modern Single Page Application (SPA) with a focus on polished visuals, micro-interactions, and accessible information.

### Tech Stack

- **Framework**: React 19 + Vite
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules + CSS Custom Properties (Design Tokens)
- **Routing**: React Router v7
- **Deployment**: GitHub Pages

---

## License & Copyright

This repository adopts a **Hybrid License Model**:

### 1. Source Code — MIT License
The underlying source code, architecture, and logic (including all `.js`, `.jsx`, `.css`, and build configs) are licensed under the **MIT License**. Developers are welcome to learn from, reference, or fork the architectural design. See [LICENSE](./LICENSE) for full details.

### 2. Content & Media Assets — All Rights Reserved
All content, branding, and creative media within this project—including but not limited to:
- Photographs and portrait assets
- Project logos, custom illustrations, and graphics
- Written articles, resident stories, and interview transcripts
- Video assets and multimedia content

**All Rights Reserved.** These materials remain the intellectual property of the **Xinglong D2 Youth Innovation Return Project** and their respective authors. Unauthorized reproduction, distribution, or commercial use is strictly prohibited without prior written permission.

---

## Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/elmerlu/XLD2YILiving.git
   cd XLD2YILiving
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

---

## Medium Article Synchronization (Stories)

The **Stories** section uses a resilient two-layer architecture:

1. **Local Snapshot**: `src/data/mediumArticles.json` delivers instant initial rendering with zero layout shift, working seamlessly even offline or when third-party proxies are throttled.
2. **Live Feed Sync**: The client-side gracefully probes live RSS via `rss2json` (with `allorigins` as a fallback) to ingest new posts. If external services are blocked, it gracefully degrades to the local archive with a direct channel referral.

### CLI Commands:
```bash
npm run sync:medium              # Fetch latest stories and update the local archive
npm run sync:medium -- --check   # Check for diffs between Medium and local archive without writing
npm run sync:medium -- --health  # Test connectivity across all syndication endpoints in Node
```

> **Diagnostics**: Visit the `/sync-status` route in the browser to view real-time latency, health indicators, and article diff comparisons.

---

## Deployment

The project is configured for automated builds and deployment to GitHub Pages:

```bash
npm run deploy
```

This runs `vite build`, generates static SPA route endpoints (`postbuild.js`), and publishes the `dist/` directory to the `gh-pages` branch. For more details, see [DEPLOY.md](./DEPLOY.md).
