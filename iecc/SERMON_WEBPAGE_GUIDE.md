# 📖 Island ECC Sermon Webpage Generation Guide

> **A comprehensive guide for generating sermon infographic webpages using LLM (Claude series) from transcripts**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Input Format](#input-format)
3. [Output Specifications](#output-specifications)
4. [Design System](#design-system)
5. [UI Components Library](#ui-components-library)
6. [Content Rules](#content-rules)
7. [Header Configuration](#header-configuration)
8. [Tab Navigation](#tab-navigation)
9. [Required Elements](#required-elements)
10. [Accessibility Requirements](#accessibility-requirements)
11. [Animation Guidelines](#animation-guidelines)
12. [Responsiveness](#responsiveness)
13. [File Conventions](#file-conventions)
14. [Workflow Options](#workflow-options)
15. [Example Prompt Template](#example-prompt-template)

---

## Overview

This folder contains interactive HTML sermon webpages generated through LLM (primarily Claude series) from video transcripts. Each page transforms a sermon into an engaging, accessible, and visually appealing infographic-style webpage.

### Goals
- Transform sermon transcripts into digestible, organized content
- Create beautiful, theme-appropriate visual presentations
- Ensure full accessibility and responsiveness
- Maintain theological accuracy with proper citations

---

## Input Format

### Transcript Source
Transcripts are typically generated using MacWhisper from Island ECC YouTube videos.

### Transcript Structure
```
URL: https://www.youtube.com/watch?v=XXXXXXXXXXX
Title: DD Month YYYY | Series Name: Sermon Title
Channel: Island ECC

[Description from YouTube]
...

[Reflection Questions]
1. Question one?
2. Question two?

[Transcript with timestamps]
Speaker 1:
00:00
Content...
```

### Required Information to Extract
| Field | Description | Example |
|-------|-------------|---------|
| `source_video_title` | Full title from YouTube | "21 December 2025 \| The Weary World Rejoices: Rejoice in Opposition" |
| `source_video_channel` | Channel name | "Island ECC" |
| `source_video_url` | Full YouTube URL | "https://www.youtube.com/watch?v=mPTcXEgBS8Q" |
| `sermon_description` | Description from video | From YouTube description |
| `reflection_questions` | Questions from video | Listed in video description |
| `speaker` | Speaker name(s) | "Pastor Kevin", "Pastor Albert" |

---

## Output Specifications

### Format
- **Single HTML file** with embedded CSS and JavaScript (Vanilla JS)

### Dependencies (Choose Based on Approach)

#### Standalone Approach
```html
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=...&display=swap" rel="stylesheet">
```

### Performance Requirements
- Fast initial load time
- Lazy-load images where applicable
- Minimize external dependencies
- Print-friendly styles (optional)
- Respect `prefers-reduced-motion`

---

## Design System

### Design Archetypes

Choose or blend archetypes based on sermon tone and content:

| Archetype | Traits | Best For |
|-----------|--------|----------|
| **Swiss Minimalist** | Large typography, grid-based, high contrast, minimal shadows, sans-serif | Analytical sermons, step-by-step teachings |
| **Modern Organic** | Soft border-radius, pastel palette, serif headings, paper textures, floating cards | Sermons about growth, nature metaphors (e.g., "The Vine") |
| **Digital Brutalist** | Monospace fonts, neon accents, thick borders, sharp edges, high saturation | Spiritual warfare, confrontational topics |
| **Classic Theological** | Traditional serif, gold/deep red/navy palette, centered layouts, divider ornaments | Names of God series, foundational doctrine |
| **Cosmic/Celestial** | Dark backgrounds, star animations, gold accents, dramatic gradients | Advent series, prophetic themes |
| **Ocean/Nature** | Wave patterns, blues/teals, organic shapes, flowing animations | Jonah series, transformation themes |
| **Contextual Wildcard** | Custom style matching the sermon's central metaphor | Any unique sermon theme |

### Color Strategy Options

| Strategy | Description | Example Use |
|----------|-------------|-------------|
| **Monochromatic** | Single hue, varying lightness | Contemplative sermons |
| **Complementary** | High contrast, dynamic | Battle/warfare themes |
| **Split-Complementary** | Rich, nuanced | Complex theological topics |
| **Pastel/Muted** | Calm, reflective | Healing, peace sermons |
| **Dark Mode Default** | Cinematic, immersive | Evening services, dramatic themes |
| **Thematic Extraction** | Extract colors from sermon imagery | Match sermon metaphors |

### CSS Variables Pattern

```css
:root {
    --primary: #2C5F7C;
    --primary-dark: #1A3D4F;
    --secondary: #D4AF37;
    --accent: #C9A961;
    --bg-light: #FAF7F2;
    --bg-dark: #1A1612;
    --text-light: #F5F5DC;
    --text-dark: #2C2416;
}
```

### Typography Pairings

| Pairing | Style | Example Fonts |
|---------|-------|---------------|
| **Serif Header + Sans Body** | Classic, authoritative | Cinzel + Inter, Crimson Pro + Inter |
| **Sans Header + Serif Body** | Editorial, modern | Montserrat + Merriweather |
| **Display Header + Monospace Body** | Artistic, unique | Playfair Display + Courier Prime |
| **Geometric Sans + Sans** | Modern, clean | Inter throughout |
| **Mood Match** | Custom to content tone | Match sermon atmosphere |

### Font Import Pattern

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

body {
    font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4 {
    font-family: 'Cinzel', serif;
}
```

---

## UI Components Library

### Selection Logic
Select **3-5 components** that best fit the specific content density. Not all components are required for every sermon.

### Navigation Components

| Component | Use Case | Implementation |
|-----------|----------|----------------|
| **Sticky Tabs** | Primary navigation (REQUIRED) | Fixed at top after scroll |
| **Sidebar Dot Nav** | Long single-page scrolling | Visual progress indicator |
| **Floating FAB** | Quick actions | Scroll-to-top, share |
| **Mega Footer** | Additional resources | Links, credits |

### Content Display Components

| Component | Use Case | Best For |
|-----------|----------|----------|
| **Accordion** 📖 | Scripture readings, sermon breakdowns | Multiple expandable sections |
| **Collapsible** ✨ | Deeper personal application notes | Optional content reveal |
| **Timeline** | Historical context, story progression | Narrative sermons, Jonah series |
| **Bento Grid** 🎯 | Visual summary, key points overview | Overview tabs |
| **Masonry Grid** | Many verses or quotes | Bible-heavy sermons |
| **Carousel** | Image backgrounds, multiple views | Header images |
| **Table** 📋 | Comparisons, structured data | Contrasting concepts |
| **Chart** 📊 | Visualize data, impact metrics | Illustrative data |

### Interactive Components

| Component | Use Case | Behavior |
|-----------|----------|----------|
| **Tooltip** 💡 | Term definitions, quick context | Hover/tap to reveal |
| **Modal** 🪟 | Full scripture context, author quotes | Click to open popup |
| **Flip Cards** | Before/after, two sides of concept | Click to flip |
| **Hover Effects** | Engagement, visual feedback | Mouse interaction |

### Component Selection Constraints

```
IF many_verses → Use Masonry Grid or Carousel
IF long_reflection → Use Accordion or Read More Expandable
IF structured_points → Use Timeline or Step-by-Step Progress
IF comparison_needed → Use Table
IF overview_summary → Use Bento Grid
```

### Tooltip Specification

```css
.tooltip {
    position: relative;
    cursor: help;
    border-bottom: 1px dotted currentColor;
}

.tooltip-content {
    position: absolute;
    z-index: 9999; /* Above everything */
    background: var(--bg-dark);
    color: var(--text-light);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    max-width: 300px; /* Adjusts for mobile */
    white-space: normal;
    word-wrap: break-word;
    /* Dynamic repositioning to avoid overflow */
}
```

**Tooltip Requirements:**
- Must be above everything else (high z-index)
- Dynamically repositions to avoid viewport overflow
- Wraps text properly on all devices
- Works on both hover (desktop) and tap (mobile)

---

## Content Rules

### Bible Verses

| Rule | Specification |
|------|---------------|
| **Version** | NIV (verbatim quotes only) |
| **Include All** | All verses referenced in sermon |
| **Long Passages** | Excerpt most relevant portions |
| **Formatting** | Distinguish clearly from other text |

#### Bible Verse Card Pattern

```html
<div class="bible-verse">
    <div class="bible-verse-text">
        "The people walking in darkness have seen a great light..."
    </div>
    <div class="bible-reference" onclick="openModal('isaiah-modal')">
        Isaiah 9:2 (NIV)
    </div>
</div>
```

### Author Quotes

| Rule | Specification |
|------|---------------|
| **Include All** | Any author quoted or paraphrased |
| **Citations** | Always include author name |
| **Paraphrases** | Mark as paraphrase if not verbatim |
| **Scope** | Books, theologians, speakers quoted |

#### Author Quote Pattern

```html
<div class="author-quote">
    <div class="quote-text">
        "Everything we do, all the comparisons we make, is to make a case that we count."
    </div>
    <div class="quote-author">— Tim Keller</div>
</div>
```

### Speaker Quotes

Include quotes from the sermon speaker if they add value:
- Personal stories that illustrate points
- Memorable phrases or summaries
- Pastoral applications

### Structure Rules

| Rule | Specification |
|------|---------------|
| **Flow** | Follow chronological order unless messy; restructure for clarity |
| **Paraphrasing** | Quote Bible verbatim; paraphrase authors faithfully |
| **Implied Points** | Include implied sermon points if they add key context |
| **UI Conflict Resolution** | Dual placement with cross-links between sections |

---

## Header Configuration

### Layout Options

| Layout | Description | Best For |
|--------|-------------|----------|
| **Full Bleed** | Full-screen immersive header | Dramatic themes |
| **Split Screen** | Content on one side, image on other | Balanced approach |
| **Minimalist** | Clean, simple, text-focused | Teaching-heavy sermons |
| **Experimental** | Visual mimics content title | Creative themes |

### Background Options

| Type | Description | Implementation |
|------|-------------|----------------|
| **Image Carousel** | 3+ rotating images with Ken Burns effect | Auto-advance with indicators |
| **Static Image** | Single background with overlay | Simpler implementation |
| **Generative CSS** | CSS patterns or gradients | No external images needed |
| **Video Loop** | Background video (muted) | High impact, higher bandwidth |

#### Carousel Implementation Pattern

```html
<div class="carousel-container">
    <div class="carousel-slide active" style="background-image: url('image1.jpg')"></div>
    <div class="carousel-slide" style="background-image: url('image2.jpg')"></div>
    <div class="carousel-slide" style="background-image: url('image3.jpg')"></div>
    <div class="carousel-indicators">
        <button class="carousel-indicator active"></button>
        <button class="carousel-indicator"></button>
        <button class="carousel-indicator"></button>
    </div>
</div>
```

### Image Requirements
- Royalty-free sources (Unsplash, Pexels)
- Theme-matched content
- Minimum 1920x1080 resolution
- Compressed to <300KB each

### Header Content Structure

```html
<header class="hero-header">
    <div class="hero-background"><!-- Background/Carousel --></div>
    <div class="hero-overlay"><!-- Gradient overlay --></div>
    <div class="hero-content">
        <h1 class="hero-title">Sermon Title</h1>
        <p class="hero-subtitle">Series Name or Description</p>
        <div class="sermon-meta">
            <span>📅 DD MMM YYYY</span>
            <span>🎤 Speaker Name</span>
            <span>⛪ Island ECC</span>
        </div>
        <div class="button-group">
            <!-- Required buttons here -->
        </div>
    </div>
</header>
```

### Animation Options

| Animation | Description | CSS |
|-----------|-------------|-----|
| **Ken Burns Fade** | Slow zoom with fade transitions | `animation: kenBurns 20s ease-in-out infinite` |
| **Parallax** | Depth movement on scroll | JavaScript scroll handler |
| **Slide** | Horizontal slide transitions | `transform: translateX()` |
| **Static** | No animation | For accessibility preference |
| **Custom Keyframes** | Mood-specific animation | Custom @keyframes |

---

## Tab Navigation

### Required Tabs

| Tab | Content | Icon |
|-----|---------|------|
| **Overview** | Bento grid summary, key insights | 🎯 |
| **Main Sermon** | Full sermon content with accordions | 📖 |
| **Bible Verses** | All scripture references | 📜 |
| **Application** / **Practical Steps** | How to apply the message | ✨ or 💡 |
| **Reflection Questions** | Questions from video description | 🤔 or 🙏 |

### Optional/Contextual Tabs

Add custom tabs based on sermon content:

| Tab | Use Case |
|-----|----------|
| **Historical Context** | Background information needed |
| **Greek/Hebrew Word Study** | Language analysis in sermon |
| **Prayer Points** | Sermon includes specific prayers |
| **Mindmap** | Visual concept mapping |
| **Quotes Collection** | Quote-heavy sermons |
| **Timeline** | Narrative/story-based sermons |

### Tab Implementation Pattern

```html
<nav class="sticky-tabs" role="tablist">
    <button class="tab-button active" data-tab="overview" role="tab" aria-selected="true">
        🎯 Overview
    </button>
    <button class="tab-button" data-tab="sermon" role="tab" aria-selected="false">
        📖 Main Sermon
    </button>
    <!-- Additional tabs -->
</nav>

<div class="tab-content active" id="overview" role="tabpanel">
    <!-- Content -->
</div>
```

### Tab Styling Requirements

```css
.sticky-tabs {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-color);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
}

.tab-button {
    padding: 1rem 1.5rem;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
}

.tab-button.active {
    border-bottom-color: var(--accent);
    color: var(--accent);
}
```

### Default States

| Section | Default State |
|---------|---------------|
| Main content | Expanded |
| Accordions | First item open, others closed |
| Collapsibles | Closed by default |
| Other sections | Closed unless beneficial |

---

## Required Elements

### 1. Watch Original Sermon Button

**Placement:** End of header, in button group

```html
<a href="{{source_video_url}}" 
   class="btn btn-primary"
   target="_blank"
   rel="noopener noreferrer">
    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
    <span>Watch Original Sermon</span>
</a>
```

### 2. View All Sermons Button

**Placement:** End of header, in button group

```html
<a href="index.html" class="btn btn-secondary">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
    </svg>
    <span>View All Sermons</span>
</a>
```

### 3. Attribution Badge

**Placement:** Fixed bottom-right (desktop), relative/static (mobile)

```html
<div class="attribution-badge">
    <div class="attribution-short">ℹ️</div>
    <div class="attribution-full">
        <div class="attribution-text">
            Generated using LLM with supervision and polishing by 
            <a href="../index.html" target="_blank">benjaminficusmicrocarpa</a>
        </div>
        <div>
            <a href="../license.html" target="_blank">Released under the MIT License</a>
        </div>
    </div>
</div>
```

#### Attribution Badge Behavior

```css
.attribution-badge {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.95);
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    z-index: 1000;
    backdrop-filter: blur(10px);
    max-width: 300px;
    transition: transform 0.3s ease;
}

/* Desktop: Collapsed by default, expands on hover */
@media (min-width: 768px) {
    .attribution-badge:not(:hover) {
        transform: translateX(calc(100% - 40px));
    }
}

/* Mobile: Always visible, relative position */
@media (max-width: 767px) {
    .attribution-badge {
        position: relative;
        margin: 2rem auto;
    }
}
```

---

## Accessibility Requirements

### WCAG AA Compliance

| Requirement | Implementation |
|-------------|----------------|
| **ARIA Labels** | All interactive elements must have proper ARIA labels |
| **Keyboard Navigation** | All interactive elements accessible via Tab key |
| **Focus Management** | Visible focus indicators, logical focus order |
| **Color Contrast** | Minimum 4.5:1 for normal text, 3:1 for large text |
| **Reduced Motion** | Respect `prefers-reduced-motion` media query |

### Implementation Patterns

```css
/* Focus indicators */
*:focus {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

```html
<!-- ARIA implementation -->
<button class="tab-button" 
        role="tab" 
        aria-selected="true" 
        aria-controls="panel-overview"
        tabindex="0">
    Overview
</button>

<div id="panel-overview" 
     role="tabpanel" 
     aria-labelledby="tab-overview">
    <!-- Content -->
</div>
```

### Keyboard Support

```javascript
// Tab navigation with arrow keys
tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const next = tabButtons[index + 1] || tabButtons[0];
            next.focus();
        }
        if (e.key === 'ArrowLeft') {
            const prev = tabButtons[index - 1] || tabButtons[tabButtons.length - 1];
            prev.focus();
        }
    });
});

// Modal escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});
```

---

## Animation Guidelines

### General Principles

1. **Purpose-driven**: Animations should enhance UX, not distract
2. **Performance**: Target 60fps, use GPU-accelerated properties
3. **Subtle**: Most animations should be barely noticeable
4. **Theme-appropriate**: Match animation style to sermon tone

### Recommended Animations

| Animation | Use | Duration | Easing |
|-----------|-----|----------|--------|
| **Fade In** | Content appearance | 0.3-0.5s | ease-out |
| **Slide Up** | Tab content change | 0.3-0.5s | ease-out |
| **Scale** | Button hover | 0.2s | ease |
| **Color transition** | State changes | 0.3s | ease |

### Animation Patterns

```css
/* Content fade-in */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.tab-content.active {
    animation: fadeIn 0.5s ease-out;
}

/* Ken Burns for backgrounds */
@keyframes kenBurns {
    0% { transform: scale(1); }
    100% { transform: scale(1.1); }
}

/* Subtle float */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* Pulse for emphasis */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

### Performance Tips

```css
/* Use GPU-accelerated properties */
.animated-element {
    transform: translateZ(0); /* Force GPU layer */
    will-change: transform, opacity;
}

/* Avoid animating layout properties */
/* ❌ Don't animate: width, height, margin, padding */
/* ✅ Do animate: transform, opacity */
```

---

## Responsiveness

### Breakpoints

| Breakpoint | Target | Width |
|------------|--------|-------|
| **Mobile** | Phones | < 640px |
| **Tablet** | iPad, Android tablets | 640px - 1024px |
| **Desktop** | Standard monitors | 1024px - 1440px |
| **Large Desktop** | 27"+ monitors | > 1440px |

### Mobile-First Approach

```css
/* Base styles (mobile) */
.container {
    padding: 1rem;
}

/* Tablet */
@media (min-width: 640px) {
    .container {
        padding: 1.5rem;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }
}
```

### Component Responsiveness

```css
/* Bento grid */
.bento-grid {
    display: grid;
    grid-template-columns: 1fr; /* Mobile: single column */
    gap: 1rem;
}

@media (min-width: 640px) {
    .bento-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .bento-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Tab navigation horizontal scroll on mobile */
.tab-nav {
    overflow-x: auto;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
}
```

### Typography Scaling

```css
/* Fluid typography */
.hero-title {
    font-size: clamp(2rem, 6vw, 4.5rem);
}

.hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.5rem);
}
```

---

## File Conventions

### Naming Pattern

```
YYYY-MM-DD-series-name-sermon-title.html
```

**Examples:**
- `2025-12-21-the-weary-world-rejoices-rejoice-in-opposition.html`
- `2025-06-01-known-qanna-jealous-god.html`
- `2025-04-06-i-am-the-vine.html`

### Date Format in Content

```
DD MMM YYYY
```

**Examples:** `21 Dec 2025`, `06 Apr 2025`

---

## Workflow

### Single-Stage Workflow (Faster)

1. LLM analyzes content tone
2. Automatically selects appropriate theme
3. Generates complete HTML in one pass
4. User reviews and requests changes


---

## Quick Reference Checklist

### Before Generation
- [ ] Extract video URL, title, channel, description
- [ ] Extract reflection questions
- [ ] Identify speaker name(s)
- [ ] Identify sermon series (if applicable)
- [ ] Note any specific themes or metaphors

### Content Checklist
- [ ] All Bible verses included (NIV)
- [ ] All author quotes included with citations
- [ ] Reflection questions from video included
- [ ] Sermon points follow logical flow
- [ ] Implied points added where beneficial

### UI Checklist
- [ ] Sticky tab navigation
- [ ] Watch Original Sermon button
- [ ] View All Sermons button
- [ ] Attribution badge (fixed position)
- [ ] Accordions for expandable content
- [ ] Tooltips for term definitions
- [ ] Appropriate bento grid or summary

### Accessibility Checklist
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Reduced motion supported
- [ ] Color contrast meets WCAG AA

### Responsiveness Checklist
- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Tab navigation scrollable on mobile
- [ ] Typography scales appropriately

### Final Checks
- [ ] File named correctly (YYYY-MM-DD-series-title.html)
- [ ] Date formatted as DD MMM YYYY
- [ ] All links work
- [ ] No console errors
- [ ] Animations respect prefers-reduced-motion

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 28 Dec 2025 | 1.0 | Initial comprehensive guide created |

---

*This guide is maintained alongside the sermon webpage collection. For questions or updates, refer to the main repository.*

