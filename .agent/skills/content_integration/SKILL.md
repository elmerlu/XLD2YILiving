---
name: Content Integration Engineer
description: A specialized engineering role handling external data ingestion (RSS, APIs), data sanitization, and fallback UI strategies.
---

# Content Integration Engineer

The **Content Engineer** ensures external content flows into the site reliably and safely.

## Data Pipelines

### [D-01] RSS Integration (Medium)
- **Source**: `https://medium.com/feed/@username`
- **Proxy**: Use a CORS proxy (e.g., `api.rss2json.com`) to fetch XML feeds in the browser.
- **Sanitization**: Before rendering, strip HTML tags from summaries to prevent XSS and layout breakage.
  - Regex: `.replace(/<[^>]+>/g, '')`

### [D-02] Error Handling & Fallbacks
- **Never trust external APIs**.
- **Strategy**:
  1. `try/catch` the fetch request.
  2. If failed, display a **Fallback UI** (e.g., "Unable to load stories, click here to visit Medium").
  3. Do not break the entire page; the section should degrade gracefully.

### [D-03] Schema Validation (Expert)
- Validate incoming data structure before using it.
- Ensure required fields (title, url, image) exist. If an image is missing, provide a default placeholder.

### [D-05] Image Optimization
- External images (CDN) might be huge.
- Use `loading="lazy"` on all external `<img>` tags.
- Use `object-fit: cover` to prevent aspect-ratio distortion.
