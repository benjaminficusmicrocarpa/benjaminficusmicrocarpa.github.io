# Sermon Features Implementation Status

This document tracks which sermons have implemented:
1. **HTML Routing for Tabs** - URL hash navigation that allows direct linking to specific tabs (e.g., `#overview`, `#sermon`)
2. **Tags in Hero Header** - Dynamic tag display in the hero section that links to filtered sermon listings
3. **External CSS/JS** - Separated stylesheets and scripts for maintainability

## CSS/JS Architecture

### External Files (New)
- `css/iecc-base.css` - Common structural styles shared across all sermon pages
- `css/soul-garden.css` - Theme styles for Soul Garden series
- `css/weary-world.css` - Theme styles for Weary World Rejoices series
- `js/iecc-common.js` - Common JavaScript functionality (tabs, accordions, slideshows, tag loading)

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

### January 2026 - Soul Garden Series
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2026-01-04 | Above All Else | ✅ | ✅ | ✅ |
| 2026-01-11 | Where Are We Growing? | ✅ | ✅ | ✅ |
| 2026-01-18 | Pruning For Life | ✅ | ✅ | ✅ |

### April 2025
| Date | Sermon | Routing | Tags | External CSS/JS |
|------|--------|---------|------|-----------------|
| 2025-04-06 | I Am The Vine | ✅ | ✅ | ❌ |

**Total Fully Implemented: 7 sermons** (with external CSS/JS)
**Total with Routing + Tags: 8 sermons**

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

### March 2025 - Breaking Ground / I Am Series
- `2025-03-02-breaking-ground-building-the-city.html`
- `2025-03-09-breaking-ground-building-legacy.html`
- `2025-03-16-i-am-the-light-of-the-world.html`
- `2025-03-23-i-am-the-door.html`
- `2025-03-30-i-am-the-good-shepherd.html`

### April 2025 - I Am / Known Series
- `2025-04-13-i-am-the-way-the-truth-and-the-life.html`
- `2025-04-20-i-am-The-resurrection-and-the-life.html`
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

**Total Missing: 47 sermons** ❌

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

## Summary

| Category | Count | Percentage |
|----------|-------|------------|
| Fully Implemented (all features) | 7 | 12.7% |
| Routing + Tags (no external CSS/JS) | 1 | 1.8% |
| Missing All Features | 47 | 85.5% |
| **Total** | **55** | 100% |

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

*Last updated: 2026-01-26*
*Updated to reflect external CSS/JS integration for 7 sermons*
