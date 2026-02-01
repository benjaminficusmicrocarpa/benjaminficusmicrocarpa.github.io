# Sermon Features Implementation Status

This document tracks which sermons have implemented:
1. **HTML Routing for Tabs** - URL hash navigation that allows direct linking to specific tabs (e.g., `#overview`, `#sermon`)
2. **Tags in Hero Header** - Dynamic tag display in the hero section that links to filtered sermon listings
3. **External CSS/JS** - Separated stylesheets and scripts for maintainability

## Index Page Features
- **Random Scripture Display** - Hero header shows a random key scripture from `key_scriptures.json` on each page load, with link to source sermon (43 scriptures total)

## CSS/JS Architecture

### External Files (New)
- `css/iecc-base.css` - Common structural styles shared across all sermon pages
- `css/soul-garden.css` - Theme styles for Soul Garden series
- `css/weary-world.css` - Theme styles for Weary World Rejoices series
- `css/i-am.css` - Theme styles for I Am series (includes theme variations: `.theme-light`, `.theme-door`, `.theme-shepherd`, default vine)
- `css/rewriting-worldview.css` - Theme styles for Rewriting My Worldview series (classic theological palette, worldview cards, framework grid)
- `js/iecc-common.js` - Common JavaScript functionality (tabs, accordions, slideshows, tag loading)
- `key_scriptures.json` - Collection of key scriptures from all sermons (used for random scripture display on index page)

### Usage
Each sermon page should include:
```html
<link rel="stylesheet" href="css/iecc-base.css">
<link rel="stylesheet" href="css/[theme-name].css">
<script src="js/iecc-common.js"></script>
```

---

## ✅ Fully Implemented (All Features + External CSS/JS)

These sermons have HTML routing for tabs, tags in the hero header, and use external CSS/JS:

### December 2025 - The Weary World Rejoices Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2025-12-07 | Rejoice in the Unexpected | ✅ | ✅ | ✅ |
| 2025-12-14 | Choosing Joy in the Struggle | ✅ | ✅ | ✅ |
| 2025-12-21 | Rejoice in Opposition | ✅ | ✅ | ✅ |
| 2025-12-28 | Rejoice in Anticipation | ✅ | ✅ | ✅ |

### January-February 2026 - Soul Garden Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2026-02-01 | Sacred Edits | ✅ | ✅ | ✅ |
| 2026-01-04 | Above All Else | ✅ | ✅ | ✅ |
| 2026-01-11 | Where Are We Growing? | ✅ | ✅ | ✅ |
| 2026-01-18 | Pruning For Life | ✅ | ✅ | ✅ |

### March 2025 - I Am Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2025-03-16 | I Am The Light of the World | ✅ | ✅ | ✅ |
| 2025-03-23 | I Am The Door | ✅ | ✅ | ✅ |
| 2025-03-30 | I Am The Good Shepherd | ✅ | ✅ | ✅ |

### April 2025 - I Am Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2025-04-06 | I Am The Vine | ✅ | ✅ | ✅ |
| 2025-04-13 | I Am The Way, The Truth and The Life | ✅ | ✅ | ✅ |
| 2025-04-20 | I Am The Resurrection and The Life | ✅ | ✅ | ✅ |

### October 2024 - Rewiring My Worldview Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2024-10-27 | How We Make Sense of Life | ✅ | ✅ | ✅ |

**Total Fully Implemented: 15 sermons** (with external CSS/JS)

---

## ❌ Missing Features

All other sermons are missing HTML routing for tabs, tags in the hero header, and external CSS/JS:

### January 2025 - People of God Series
- `2025-01-05-people-of-god-made-to-worship.html`
- `2025-01-12-people-of-god-what-are-you-made-for.html`
- `2025-01-19-people-of-gods-but-first-look-inside.html`
- `2025-01-26-people-of-god-on-fire.html`

### February 2025 - Well Spring / Seek First Series
- `2025-02-02-well-spring-true-blessedness-and-true-wholeness.html`
- `2025-02-09-well-spring-no-excuse-and-as-your-heart-desires.html`
- `2025-02-16-seek-first-increase-our-faith.html`
- `2025-02-23-breaking-ground-building-people.html`

### March 2025 - Breaking Ground Series
- `2025-03-02-breaking-ground-building-the-city.html`
- `2025-03-09-breaking-ground-building-legacy.html`

### April 2025 - Known Series
- `2025-04-27-known-jehovah-shalom-the-lord-is-peace.html`

### May 2025 - Known Series
- `2025-05-04-known-jehovah-nissi-the-lord-is-my-banner.html`
- `2025-05-11-known-jehovah-rapha-lord-who-heals.html`
- `2025-05-18-known-el-roi-god-who-sees-me-and-jehovah-jireh-the-lord-will-provide.html`
- `2025-05-25-known-jehovah-mekoddishkem-the-lord-who-sanctifies.html`

### June 2025 - Known / Sticky Stuff Series
- `2025-06-01-known-qanna-jealous-god.html`
- `2025-06-08-sticky-stuff-contempt.html`
- `2025-06-15-sticky-stuff-discouragement.html`
- `2025-06-22-sticky-stuff-disagreement.html`
- `2025-06-29-sticky-stuff-resentment.html`

### July 2025 - Sticky Stuff / Clickbait Series
- `2025-07-06-sticky-stuff-spiritual-imbalance.html`
- `2025-07-13-sticky-stuff-annoyance.html`
- `2025-07-27-clickbait-battle-is-real.html`

### August 2025 - Clickbait / Heart of Hearing Series
- `2025-08-03-clickbait-satan-father-of-lies.html`
- `2025-08-10-clickbait-temptations-triple-threat-battle-plan.html`
- `2025-08-17-clickbait-outwitting-satan.html`
- `2025-08-24-clickbait-defeating-strongholds.html`
- `2025-08-31-the-heart-of-hearing-1.html`

### September 2025 - Heart of Hearing / Fresh Start Series
- `2025-09-07-the-heart-of-hearing-navigating-pride.html`
- `2025-09-14-the-heart-of-hearing-anger-management.html`
- `2025-09-21-fresh-start-awake.html`
- `2025-09-28-fresh-start-see-clearer.html`

### October 2025 - Fresh Start Series
- `2025-10-05-fresh-start-trust-deeper.html`
- `2025-10-12-fresh-start-pray-bigger.html`
- `2025-10-19-fresh-start-give-easier.html`
- `2025-10-26-fresh-start-live-bolder.html`

### November 2025 - Turning Tides / Weary World Series
- `2025-11-02-turning-tides-you-can-run-but-you-cant-hide.html`
- `2025-11-09-turning-tides-swallowed-by-grace.html`
- `2025-11-16-turning-tides-the-god-of-second-chances.html`
- `2025-11-23-turning-tides-not-so-righteous-righteous-anger.html`
- `2025-11-30-the-weary-world-rejoices-rejoice-in-the-waiting.html`

### November 2024
- `2024-11-17-rewriting-my-worldview-finding-purpose-in-singleness-marriage-and-parenting.html`

**Total Missing: 42 sermons** ❌

---

## Implementation Details

### HTML Routing for Tabs
The implemented version includes:
- URL hash navigation (e.g., `#overview`, `#sermon`, `#verses`)
- Browser back/forward button support
- Direct linking to specific tabs
- Smooth scrolling to tab content
- Keyboard navigation (arrow keys)

**Implementation in iecc-common.js:**
```javascript
// Automatically handles hash changes and tab switching
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) switchToTab(hash);
});
```

### Tags in Hero Header
The implemented version includes:
- Dynamic tag loading from `sermons_data.json`
- Clickable tags that filter sermons on the index page
- Visual tag categories (series, themes, topics, scriptures)
- Responsive tag display in hero section

**HTML Structure:**
```html
<div class="sermon-tags-container" id="sermon-tags">
    <!-- Tags dynamically loaded -->
</div>
```

**JavaScript (in iecc-common.js):**
```javascript
loadSermonTags('YYYY-MM-DD'); // Pass the sermon date
```

### Random Scripture Display (Index Page)
The index page hero header displays a random key scripture that changes on each page load/refresh:
- Scriptures are stored in `key_scriptures.json` (43 scriptures total)
- Each scripture links to its source sermon page
- Styled to blend with the purple/indigo gradient hero theme

**JSON Structure (`key_scriptures.json`):**
```json
{
  "scriptures": [
    {
      "reference": "John 15:5",
      "text": "I am the vine; you are the branches...",
      "sermon": "I AM: The Vine",
      "link": "2025-04-06-i-am-the-vine.html"
    }
  ]
}
```

**HTML Structure (in index.html hero):**
```html
<div class="scripture-quote" id="scripture-quote">
    <p class="scripture-text" id="scripture-text">Loading scripture...</p>
    <p class="scripture-reference" id="scripture-reference"></p>
    <a href="#" class="scripture-sermon-link" id="scripture-sermon-link">
        📖 From sermon: <span id="sermon-title"></span>
    </a>
</div>
```

**JavaScript (in index.html):**
```javascript
async function loadRandomScripture() {
    const response = await fetch('key_scriptures.json');
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.scriptures.length);
    // Update DOM with random scripture
}
document.addEventListener('DOMContentLoaded', loadRandomScripture);
```

### External CSS Architecture

**iecc-base.css** contains:
- CSS variables (customizable per theme)
- Base reset and typography
- Hero/header styles
- Tab navigation
- Content cards and verse cards
- Timeline and accordion
- Quote blocks and highlight boxes
- Application/reflection cards
- Attribution badge
- Responsive breakpoints
- Print styles
- Accessibility features

**Theme files** (soul-garden.css, weary-world.css) contain:
- Color scheme overrides
- Series-specific animations
- Unique visual elements
- Custom components

---

## Fixes Required / Applied

This section records bugs that were identified and fixed so the same issues can be avoided or quickly resolved on other sermons.

### I Am Series (2025-03-16, 2025-03-23, 2025-03-30)

**Affected pages:**
- `2025-03-16-i-am-the-light-of-the-world.html`
- `2025-03-23-i-am-the-door.html`
- `2025-03-30-i-am-the-good-shepherd.html`

#### 1. Accordion not functioning

**Symptom:** Clicking accordion headers did not expand/collapse sections, or accordion appeared to toggle open then immediately close.

**Cause:** Both inline `onclick="toggleAccordion(this)"` and `initAccordions()` in `iecc-common.js` were attaching click handlers to the same `.accordion-header` elements. The same click fired both handlers, so the accordion opened then closed again.

**Fix (js/iecc-common.js):** In `initAccordions()`, skip headers that already have an inline `onclick` handler so only one handler runs:

```javascript
accordionHeaders.forEach(header => {
    if (header.hasAttribute('onclick')) {
        return;
    }
    header.addEventListener('click', () => { ... });
});
```

#### 2. Text colour not visible against background

**Symptom:** Accordion body text, content cards, verse text, timeline text, and quote boxes had poor contrast—text was hard or impossible to read against the theme background.

**Cause:** Base styles from `iecc-base.css` set accordion body and other content to `color: var(--text-muted)` (a gray). Theme files (`i-am.css`) overrode header/card colours but did not override body text for accordion content, content cards, verse text, or quote boxes. On light themes (Door, Shepherd) the muted gray had low contrast on cream/white; on the dark theme (Light) verse text used a muted tone that was too faint.

**Fix (css/i-am.css):** Add theme-specific text colour overrides so content is readable in each theme:

| Theme | Selectors | Colour variable |
|-------|-----------|-----------------|
| **theme-light** | `.accordion-body`, `.accordion-content`, `.accordion-body p, li, ul, ol` | `var(--light-text)` |
| **theme-light** | `.verse-text` | `var(--light-text)` with opacity 0.9 |
| **theme-door** | `.accordion-body`, `.accordion-content`, `.accordion-body p, li, ul, ol` | `var(--door-text)` |
| **theme-door** | `.content-card p, li`, `.timeline-item p`, `.quote-box p`, `.key-quote p` | `var(--door-text)` |
| **theme-shepherd** | `.accordion-body`, `.accordion-content`, `.accordion-body p, li, ul, ol` | `var(--shepherd-deep)` |
| **theme-shepherd** | `.content-card p, li`, `.verse-text`, `.timeline-item p` | `var(--shepherd-deep)` |

**Checklist for future theme/sermon pages:**
- [ ] Accordion headers: either use inline `onclick` **or** rely on `initAccordions()`, not both on the same element.
- [ ] For each theme, set text colour on: `.accordion-body`, `.accordion-content`, `.content-card` paragraphs/lists, `.verse-text`, `.timeline-item`/`.timeline-content` text, and `.quote-box`/`.key-quote` if used.
- [ ] Use theme variables (e.g. `--light-text`, `--door-text`, `--shepherd-deep`) so text contrasts with the theme background.

#### 3. I Am The Vine (2025-04-06) – text colour on default vine theme

**Affected page:** `2025-04-06-i-am-the-vine.html`

**Symptom:** Body text in content cards, accordion, Bible verses tab, and tooltip was hard or impossible to read against the white/cream background (same cause as (2): base styles use `--text-muted` / `--text-light`).

**Fix (css/i-am.css):** For the default Vine theme (no `.theme-light` / `.theme-door` / `.theme-shepherd`), added overrides so all main content uses `var(--bark-dark)`:
- `.content-card p, li, ul, ol`
- `.accordion-body`, `.accordion-content`, and their `p, li, ul, ol`
- `.masonry-item`, `.masonry-item p`
- `.tooltip-content` and `.attribution-full`

#### 4. I Am The Resurrection and The Life (2025-04-20) – tab content not showing

**Affected page:** `2025-04-20-i-am-The-resurrection-and-the-life.html`

**Symptom:** Tab content did not show; clicking tabs had no visible effect.

**Cause:** The tab content wrapper used `class="content-section"`. In `iecc-base.css`, `.content-section` (and `.tab-content`) have `display: none` by default; only `.content-section.active` and `.tab-content.active` get `display: block`. The parent wrapper had `content-section` but no `.active` class, so the whole container stayed hidden even though child `.tab-content.active` elements had the correct class.

**Fix (HTML):** Refactor the page to match other I Am sermons:
- Change the tab content wrapper from `<div class="content-section">` to `<div class="container">` so the parent is not hidden by base styles.
- Move `data-sermon-date` from `<html>` to `<body>` so auto-init in `iecc-common.js` runs correctly.
- Remove the duplicate inline `IECC.initSermonPage()` call; rely on auto-init when `data-sermon-date` is present on the page.

**Checklist for future sermon pages:**
- [ ] Use `.container` (not `.content-section`) as the wrapper for tab content panels when using iecc-base.css.
- [ ] Put `data-sermon-date` on `<body>`, not `<html>`.
- [ ] Do not add a second `IECC.initSermonPage()` call if the page already has `data-sermon-date` (iecc-common.js auto-initializes).

#### 5. I Am The Light of the World (2025-03-16) – hidden text colour (HTML override)

**Affected page:** `2025-03-16-i-am-the-light-of-the-world.html`

**Symptom:** Body text in Overview content cards (Context: Festival of Tabernacles, Key Theme), Application content cards (The Camera Exposure Analogy, Why Increase Your Exposure?, Honest Self-Reflection), and key-quote blocks was nearly invisible—dark grey on dark blue-grey background.

**Fix (HTML only, no CSS change):** Inline style overrides were added in the HTML so content remains readable without modifying `i-am.css`:
- Overview: paragraphs in `.content-card.glow-box` and Key Theme card given `style="color: #e0d6c0;"`.
- Application: paragraphs and quote in The Camera Exposure Analogy card, Why Increase Your Exposure? paragraph and list, Honest Self-Reflection paragraph and list given `color: #e0d6c0` (light cream).

**Note:** For page-specific contrast fixes where CSS should not be changed, use inline `style="color: #e0d6c0;"` (or theme-appropriate light colour) on `<p>`, `<ul>`, or `.key-quote p` inside dark content cards.

---

## Summary

| Category | Count | Percentage |
|----------|-------|------------|
| Fully Implemented (all features) | 15 | 26.3% |
| Missing All Features | 42 | 73.7% |
| **Total** | **57** | **100%** |

---

## Next Steps for Migration

To migrate remaining sermons:

1. Add CSS/JS links to `<head>`:
   ```html
   <link rel="stylesheet" href="css/iecc-base.css">
   <link rel="stylesheet" href="css/[appropriate-theme].css">
   ```

2. Add `<script src="js/iecc-common.js"></script>` before `</body>`

3. Add tags container in hero:
   ```html
   <div class="sermon-tags-container" id="sermon-tags"></div>
   ```

4. Call tag loader with sermon date:
   ```javascript
   document.addEventListener('DOMContentLoaded', function() {
       loadSermonTags('YYYY-MM-DD');
   });
   ```

5. Ensure tab elements have `data-tab` attributes matching section IDs

---

*Last updated: 2026-02-01*
*Added 2026-02-01 (Soul Garden: Sacred Edits) - sermon on throwing off hindrances and sin, four layers of sin (Robert Mulholland), fixing eyes on Jesus.*
*Added "Fixes Required / Applied" section documenting accordion double-handler fix and text colour contrast fixes for I Am series (Light of the World, The Door, Good Shepherd). Added fix (3) for I Am The Vine default theme text colour.*
*Migrated 2025-04-13 (I Am The Way, The Truth and The Life) and 2025-04-20 (I Am The Resurrection and The Life) to external CSS/JS with tags and routing.*
*Added fix (4) for 2025-04-20 (I Am The Resurrection and The Life): tab content not showing—wrapper changed from `.content-section` to `.container`, `data-sermon-date` moved to `<body>`, duplicate init script removed.*
*Added fix (5) for 2025-03-16 (I Am The Light of the World): hidden text colour in Overview and Application cards fixed via HTML inline overrides `color: #e0d6c0`, no CSS change.*
*Added 2024-10-27 (Rewiring My Worldview: How We Make Sense of Life) with new `css/rewriting-worldview.css` theme file.*
*Added `key_scriptures.json` (43 key scriptures extracted from all sermon pages) and random scripture display feature in index.html hero header—displays a different scripture on each page load with link to source sermon.*