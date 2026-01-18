# Sermon Features Implementation Status

This document tracks which sermons have implemented:
1. **HTML Routing for Tabs** - URL hash navigation that allows direct linking to specific tabs (e.g., `#overview`, `#sermon`)
2. **Tags in Hero Header** - Dynamic tag display in the hero section that links to filtered sermon listings

## ✅ Fully Implemented (Both Features)

These sermons have both HTML routing for tabs and tags in the hero header:

### December 2025
- `2025-12-07-the-weary-world-rejoices-rejoice-in-the-unexpected.html`
- `2025-12-14-the-weary-world-rejoices-choosing-joy-in-the-struggle.html`
- `2025-12-21-the-weary-world-rejoices-rejoice-in-opposition.html`
- `2025-12-28-the-weary-world-rejoices-rejoice-in-anticipation.html`

### January 2026
- `2026-01-04-soul-garden-above-all-else.html`
- `2026-01-11-soul-garden-where-are-we-growing.html`
- `2026-01-18-soul-garden-pruning-for-life.html`

### April 2025
- `2025-04-06-i-am-the-vine.html`

**Total: 8 sermons** ✅

---

## ❌ Missing Both Features

All other sermons are missing both HTML routing for tabs and tags in the hero header:

### January 2025
- `2025-01-05-people-of-god-made-to-worship.html`
- `2025-01-12-people-of-god-what-are-you-made-for.html`
- `2025-01-19-people-of-gods-but-first-look-inside.html`
- `2025-01-26-people-of-god-on-fire.html`

### February 2025
- `2025-02-02-well-spring-true-blessedness-and-true-wholeness.html`
- `2025-02-09-well-spring-no-excuse-and-as-your-heart-desires.html`
- `2025-02-16-seek-first-increase-our-faith.html`
- `2025-02-23-breaking-ground-building-people.html`

### March 2025
- `2025-03-02-breaking-ground-building-the-city.html`
- `2025-03-09-breaking-ground-building-legacy.html`
- `2025-03-16-i-am-the-light-of-the-world.html`
- `2025-03-23-i-am-the-door.html`
- `2025-03-30-i-am-the-good-shepherd.html`

### April 2025
- `2025-04-13-i-am-the-way-the-truth-and-the-life.html`
- `2025-04-20-i-am-The-resurrection-and-the-life.html`
- `2025-04-27-known-jehovah-shalom-the-lord-is-peace.html`

### May 2025
- `2025-05-04-known-jehovah-nissi-the-lord-is-my-banner.html`
- `2025-05-11-known-jehovah-rapha-lord-who-heals.html`
- `2025-05-18-known-el-roi-god-who-sees-me-and-jehovah-jireh-the-lord-will-provide.html`
- `2025-05-25-known-jehovah-mekoddishkem-the-lord-who-sanctifies.html`

### June 2025
- `2025-06-01-known-qanna-jealous-god.html`
- `2025-06-08-sticky-stuff-contempt.html`
- `2025-06-15-sticky-stuff-discouragement.html`
- `2025-06-22-sticky-stuff-disagreement.html`
- `2025-06-29-sticky-stuff-resentment.html`

### July 2025
- `2025-07-06-sticky-stuff-spiritual-imbalance.html`
- `2025-07-13-sticky-stuff-annoyance.html`
- `2025-07-27-clickbait-battle-is-real.html`

### August 2025
- `2025-08-03-clickbait-satan-father-of-lies.html`
- `2025-08-10-clickbait-temptations-triple-threat-battle-plan.html`
- `2025-08-17-clickbait-outwitting-satan.html`
- `2025-08-24-clickbait-defeating-strongholds.html`
- `2025-08-31-the-heart-of-hearing-1.html`

### September 2025
- `2025-09-07-the-heart-of-hearing-navigating-pride.html`
- `2025-09-14-the-heart-of-hearing-anger-management.html`
- `2025-09-21-fresh-start-awake.html`
- `2025-09-28-fresh-start-see-clearer.html`

### October 2025
- `2025-10-05-fresh-start-trust-deeper.html`
- `2025-10-12-fresh-start-pray-bigger.html`
- `2025-10-19-fresh-start-give-easier.html`
- `2025-10-26-fresh-start-live-bolder.html`

### November 2025
- `2025-11-02-turning-tides-you-can-run-but-you-cant-hide.html`
- `2025-11-09-turning-tides-swallowed-by-grace.html`
- `2025-11-16-turning-tides-the-god-of-second-chances.html`
- `2025-11-23-turning-tides-not-so-righteous-righteous-anger.html`
- `2025-11-30-the-weary-world-rejoices-rejoice-in-the-waiting.html`

### November 2024
- `2024-11-17-rewriting-my-worldview-finding-purpose-in-singleness-marriage-and-parenting.html`

**Total: 47 sermons** ❌

---

## Implementation Details

### HTML Routing for Tabs
The implemented version includes:
- URL hash navigation (e.g., `#overview`, `#sermon`, `#verses`)
- Browser back/forward button support
- Direct linking to specific tabs
- Smooth scrolling to tab content

**Example implementation pattern:**
```javascript
// Handle hash changes (back/forward navigation)
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        switchToTab(hash);
    }
});

// Update URL hash on tab click
window.location.hash = targetId;
```

### Tags in Hero Header
The implemented version includes:
- Dynamic tag loading from `sermons_data.json`
- Clickable tags that filter sermons on the index page
- Visual tag categories (series, themes, topics, scriptures)
- Responsive tag display in hero section

**Example implementation pattern:**
```html
<div class="sermon-tags-container" id="sermon-tags">
    <!-- Tags will be dynamically loaded -->
</div>
```

```javascript
// Tags link to filtered index page
const tagUrl = `index.html?tags=${encodeURIComponent(tagId)}`;
```

---

## Summary

- **Implemented**: 8 sermons (14.5%)
- **Missing**: 47 sermons (85.5%)
- **Total**: 55 sermons

---

*Last updated: Based on current codebase analysis*
*Files checked for: `hashchange` event listeners and `sermon-tags-container` elements*
