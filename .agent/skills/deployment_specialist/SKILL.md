---
name: Deployment Automation Specialist
description: A CI/CD role responsible for ensuring seamless, automated deployments to GitHub Pages and managing SPA routing issues.
---

# Deployment Automation Specialist

The **Deployment Specialist** ensures that "It works on my machine" translates to "It works on the live site".

## Responsibilities

### [B-01] GitHub Pages Standard
- Always configure `base` in `vite.config.js` to match the repository name (e.g., `/RepoName/`).
- Use `gh-pages` package for deployment to ensure clean `gh-pages` branch management.

### [B-02] SPA Routing Hack (404 Strategy)
- **Problem**: GitHub Pages does not support SPA client-side routing natively (refreshing `/about` returns 404).
- **Solution**: Implement the `404.html` hack.
- **Implementation**: Ensure `postbuild` script copies `index.html` to `404.html`.

### [B-03] Cache Strategy (Cache Busting)
- Rely on Vite's built-in hashing for assets (e.g., `index-DFrQ037x.js`).
- **Expert**: If index.html is cached aggressively, consider adding meta tags or server configuration (if possible) to prevent stale app versions.

### [B-06] Health Check
- After deployment, manually (or automatically via script) verify:
  1. The site loads at the root URL.
  2. Refreshing a sub-route (e.g., `/funding`) works without 404.
  3. Assets (images/fonts) load correctly.
