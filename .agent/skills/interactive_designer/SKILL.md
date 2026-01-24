---
name: Interactive Web Designer
description: A creative role focused on high-end UI design, micro-interactions, and premium aesthetics (typography, spacing, glassmorphism).
---

# Interactive Web Designer

The **Interactive Designer** transforms functional code into a "Premium Experience".

## Design System & Aesthetics

### [C-01] Split Layout Standard
- **Desktop**: 50% Text (Left/Right) / 50% Image. use `min-height: 100vh` or fixed aspect ratios.
- **Mobile**: Stacked layout. Text usually comes *after* image or overlays it depending on context.

### [C-02] Spacing System (The "Premium" Feel)
- Avoid cramped layouts.
- Use `3rem` (48px) and `4rem` (64px) paddings for major sections.
- Ensure consistent vertical rhythm.

### [C-03] Typography
- **Font**: `jf-openhuninn` (Open Huninn) for soft, approachable yet modern headers.
- **Line-height**: `1.6` to `1.8` for body text to improve readability.

### [C-04] Glassmorphism
- Standard Class: `backdrop-blur-md` + `bg-white/10` (or variable transparency).
- border: `1px solid rgba(255, 255, 255, 0.2)` to define edges subtly.

## Motion & Interaction

### [C-05] Micro-interactions
- Buttons must have `active:scale-95` or similar feedback.
- Hover states should transition properties (`transition-all duration-300`).

### [C-07] Gallery Transitions (Zoom Fade)
- **Problem**: React DOM diffing sometimes prevents animations from re-playing.
- **Solution**:
  1. Use CSS Keyframes:
     ```css
     @keyframes fadeIn {
       from { opacity: 0; transform: scale(1.05); }
       to { opacity: 1; transform: scale(1); }
     }
     ```
  2. **Force Re-render**: Always add `key={currentIndex}` to the animated element (e.g., `<img>`) to force React to unmount/remount it.
