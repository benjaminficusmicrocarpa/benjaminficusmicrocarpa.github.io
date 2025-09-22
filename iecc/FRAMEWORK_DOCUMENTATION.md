# IECC Sermon Framework Documentation

## Overview

The Island ECC (IECC) Sermon Framework provides two complementary approaches for creating interactive sermon study pages. Both systems share the same goal of making sermons more engaging and accessible through interactive web experiences.

## 📋 Table of Contents

- [System Comparison](#system-comparison)
- [Generic System (Component-Based)](#generic-system-component-based)
- [Generic2 System (Utility-First)](#generic2-system-utility-first)
- [When to Use Which System](#when-to-use-which-system)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## System Comparison

| Feature | Generic (v1) | Generic2 (v2) |
|---------|--------------|---------------|
| **Philosophy** | Component-based, semantic classes | Utility-first, composable patterns |
| **CSS Framework** | Custom semantic CSS | Tailwind-compatible utilities |
| **HTML Structure** | Fixed component structure | Flexible utility composition |
| **JavaScript** | Event-driven, DOM manipulation | Functional, state-based |
| **Theming** | Separate theme CSS files | CSS variables + data attributes |
| **Learning Curve** | Lower (semantic naming) | Higher (utility knowledge) |
| **Bundle Size** | Larger (includes unused styles) | Smaller (only used utilities) |
| **Customization** | Override-based | Composition-based |
| **Performance** | Good | Excellent |
| **Maintenance** | Moderate | Easy |

---

# Generic System (Component-Based)

## 🎯 Overview

The Generic system provides pre-built, semantic components that follow consistent patterns across all sermon pages. It's designed for teams and content creators who want reliable, accessible components without deep CSS knowledge.

## 📁 File Structure

```
css/
├── iecc-base.css          # Foundation styles
├── iecc-generic.css       # Component library
└── themes/
    ├── pride-theme.css    # Theme-specific overrides
    └── anger-theme.css    # Theme-specific overrides

js/
├── iecc-common.js         # Shared utilities
└── iecc-generic.js        # Component behaviors
```

## 🚀 Quick Start

### HTML Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sermon Title</title>
    
    <!-- Generic Framework -->
    <link rel="stylesheet" href="css/iecc-generic.css">
    <link rel="stylesheet" href="css/pride-theme.css"> <!-- Optional theme -->
    <script src="js/iecc-generic.js" defer></script>
</head>
<body>
    <div class="container">
        <!-- Content goes here -->
    </div>
</body>
</html>
```

## 🧩 Core Components

### Header Component
```html
<header class="header">
    <h1>Sermon Title</h1>
    <p class="subtitle">Sermon subtitle or description</p>
    
    <div class="sermon-meta">
        <div class="meta-item">
            <span>📅</span>
            <span>Date</span>
        </div>
        <div class="meta-item">
            <span>🎤</span>
            <span>Pastor Name</span>
        </div>
    </div>
    
    <div class="header-buttons">
        <a href="#" class="btn btn-primary">Watch Video</a>
        <a href="#" class="btn btn-outline">All Sermons</a>
    </div>
</header>
```

### Tab Navigation
```html
<nav class="tab-navigation" role="tablist">
    <button class="tab-btn active" data-tab="overview" role="tab">
        🎯 Overview
    </button>
    <button class="tab-btn" data-tab="sermon" role="tab">
        📖 Sermon
    </button>
    <button class="tab-btn" data-tab="bible" role="tab">
        📜 Bible Verses
    </button>
</nav>

<div class="tab-content active" id="overview" role="tabpanel">
    <!-- Overview content -->
</div>
<div class="tab-content" id="sermon" role="tabpanel">
    <!-- Sermon content -->
</div>
```

### Bento Grid Layout
```html
<div class="bento-grid">
    <div class="bento-item">
        <h3>Component Title</h3>
        <p>Component description or content</p>
    </div>
    <div class="bento-item">
        <h3>Another Component</h3>
        <p>More content here</p>
    </div>
</div>
```

### Accordion Component
```html
<div class="accordion">
    <div class="accordion-item">
        <div class="accordion-header">
            <span class="accordion-title">Accordion Title</span>
            <span class="accordion-icon">▶</span>
        </div>
        <div class="accordion-content">
            <p>Accordion content goes here</p>
        </div>
    </div>
</div>
```

### Bible Verse Styling
```html
<div class="bible-verse">
    <div class="bible-verse-text">
        "For God so loved the world that he gave his one and only Son..."
    </div>
    <div class="bible-reference">John 3:16</div>
</div>
```

### Modal Component
```html
<div class="modal" id="example-modal">
    <div class="modal-content">
        <button class="modal-close" onclick="SermonUtils.closeModal('example-modal')">×</button>
        <h3>Modal Title</h3>
        <p>Modal content</p>
    </div>
</div>
```

## 🎨 Theming

### Creating a Theme
Create a new CSS file (e.g., `healing-theme.css`):

```css
/* Theme Variables */
:root {
    --primary-color: #06b6d4;
    --secondary-color: #0891b2;
    --accent-color: #ec4899;
}

/* Component Overrides */
.header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.btn-primary {
    background: var(--primary-color);
}

.tab-btn.active {
    background: var(--primary-color);
}

.bento-item:hover {
    border-color: var(--primary-color);
}
```

### Using Themes
```html
<link rel="stylesheet" href="css/iecc-generic.css">
<link rel="stylesheet" href="css/healing-theme.css">
```

## 📱 JavaScript API

### Initialization
```javascript
// Auto-initializes on page load
// Manual initialization:
SermonUtils.initializeGenericFeatures();
```

### Available Functions
```javascript
// Tab management
SermonUtils.initializeTabs();

// Accordion management
SermonUtils.initializeAccordions();

// Modal management
SermonUtils.openModal('modal-id');
SermonUtils.closeModal('modal-id');

// Smooth scrolling
SermonUtils.initializeSmoothScrolling();

// Mobile tooltips
SermonUtils.initializeMobileTooltips();
```

## ✅ Pros of Generic System

1. **Easy to Learn** - Semantic class names are self-documenting
2. **Consistent Design** - Enforces uniform look across sermons
3. **Accessibility Built-in** - ARIA attributes and keyboard navigation included
4. **Team-Friendly** - Multiple developers can work with same patterns
5. **Rapid Development** - Pre-built components speed up creation
6. **Proven Patterns** - Based on established UI/UX principles

## ❌ Cons of Generic System

1. **Limited Flexibility** - Hard to create unique layouts
2. **CSS Bloat** - Loads unused styles
3. **Override Complexity** - Customization requires CSS knowledge
4. **Rigid Structure** - Components have fixed HTML patterns
5. **Theme Maintenance** - Multiple theme files to manage

---

# Generic2 System (Utility-First)

## 🎯 Overview

Generic2 is a modern, utility-first framework built on Tailwind CSS principles. It provides maximum flexibility while maintaining consistency through composable utility classes and CSS custom properties.

## 📁 File Structure

```
css/
├── iecc-generic2.css      # Complete utility framework

js/
├── iecc-generic2.js       # Functional utilities
```

## 🚀 Quick Start

### HTML Setup
```html
<!DOCTYPE html>
<html lang="en" data-theme="healing">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sermon Title</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Generic2 Framework -->
    <link rel="stylesheet" href="css/iecc-generic2.css">
    <script src="js/iecc-generic2.js" defer></script>
    
    <!-- Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'theme-primary': 'rgb(var(--theme-primary) / <alpha-value>)',
                        'theme-secondary': 'rgb(var(--theme-secondary) / <alpha-value>)',
                    }
                }
            }
        }
    </script>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
    <!-- Content with utility classes -->
</body>
</html>
```

## 🧩 Core Components

### Header Component
```html
<header class="sermon-header px-4 py-6">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
            Sermon Title
        </h1>
        <p class="text-white/80 text-sm md:text-base">
            Pastor • Church • Date
        </p>
        <div class="flex gap-3 mt-4">
            <a href="#" class="btn btn-primary">
                <span>Watch Video</span>
            </a>
            <a href="#" class="btn btn-secondary">
                <span>All Sermons</span>
            </a>
        </div>
    </div>
</header>
```

### Tab Navigation
```html
<nav class="tab-navigation">
    <div class="max-w-6xl mx-auto px-4">
        <div class="flex space-x-1 overflow-x-auto">
            <button data-tab-trigger="main" class="tab-button active">
                <span>Main Sermon</span>
            </button>
            <button data-tab-trigger="bible" class="tab-button">
                <span>Bible Verses</span>
            </button>
        </div>
    </div>
</nav>

<div data-tab-content="main" class="active">
    <!-- Main content -->
</div>
<div data-tab-content="bible" class="hidden">
    <!-- Bible content -->
</div>
```

### Bento Grid Layout
```html
<div class="bento-grid mb-8">
    <div class="bento-item text-center">
        <div class="text-4xl mb-3">📖</div>
        <h3 class="text-xl font-bold text-theme-primary mb-2">Title</h3>
        <p class="text-gray-600 text-sm">Description text</p>
    </div>
    <div class="bento-item text-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div class="text-4xl mb-3">⭐</div>
        <h3 class="text-xl font-bold text-blue-700 mb-2">Another Item</h3>
        <p class="text-blue-600 text-sm">More content</p>
    </div>
</div>
```

### Accordion Component
```html
<div class="content-card">
    <button data-accordion-trigger="point1" class="accordion-trigger">
        <div class="flex items-center space-x-3">
            <h3 class="text-xl font-semibold text-gray-800">Point 1: Title</h3>
        </div>
        <svg class="w-5 h-5 accordion-icon text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
    </button>
    <div data-accordion-content="point1" class="accordion-content">
        <p class="text-gray-700 mb-4">Accordion content goes here</p>
    </div>
</div>
```

### Bible Verse Styling
```html
<div class="bible-verse">
    <p class="text-lg leading-relaxed mb-2">
        "For God so loved the world that he gave his one and only Son..."
    </p>
    <p class="text-right font-semibold text-theme-primary">- John 3:16</p>
</div>
```

### Modal Component
```html
<div data-modal="example-modal" class="modal-overlay">
    <div class="modal-content p-6">
        <div class="flex justify-between items-center mb-4">
            <h3 data-modal-title class="text-xl font-bold text-theme-primary">Modal Title</h3>
            <button data-modal-close="example-modal" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div data-modal-content>
            Modal content goes here
        </div>
    </div>
</div>
```

## 🎨 Theming System

### Built-in Themes
Generic2 includes several pre-defined themes:

```html
<!-- Set theme via data attribute -->
<html data-theme="healing">   <!-- Cyan/teal theme -->
<html data-theme="pride">     <!-- Blue theme -->
<html data-theme="anger">     <!-- Red theme -->
<html data-theme="dark">      <!-- Dark theme -->
```

### Theme Switching
```javascript
// Switch themes dynamically
IECCGeneric2.ThemeManager.setTheme('healing');
IECCGeneric2.ThemeManager.setTheme('pride');

// Auto-detect theme from page content
IECCGeneric2.ThemeManager.autoDetectTheme();

// Get current theme
const currentTheme = IECCGeneric2.ThemeManager.getCurrentTheme();
```

### Custom Themes
Add custom themes directly in CSS:

```css
/* Custom theme in iecc-generic2.css */
[data-theme="custom"] {
  --theme-primary: 168 85 247;   /* purple-500 */
  --theme-secondary: 139 69 19;  /* amber-800 */
  --theme-accent: 34 197 94;     /* green-500 */
}
```

### Theme Variables
Available CSS custom properties:

```css
:root {
  --theme-primary: /* RGB values */
  --theme-secondary: /* RGB values */
  --theme-accent: /* RGB values */
  --color-header-bg: /* Semantic mapping */
  --color-tab-active: /* Semantic mapping */
  --color-accordion-header: /* Semantic mapping */
}
```

## 📱 JavaScript API

### Initialization
```javascript
// Auto-initializes with default config
// Custom initialization:
IECCGeneric2.init({
    enableThemeDetection: true,
    tabConfig: {
        storageKey: 'sermon-tab',
        onTabChange: (tabId) => console.log('Tab:', tabId)
    },
    accordionConfig: {
        allowMultiple: false,
        storageKey: 'sermon-accordions'
    }
});
```

### Theme Management
```javascript
// Theme operations
IECCGeneric2.ThemeManager.setTheme('healing');
IECCGeneric2.ThemeManager.getCurrentTheme();
IECCGeneric2.ThemeManager.loadSavedTheme();
IECCGeneric2.ThemeManager.autoDetectTheme();
```

### Tab System
```javascript
// Tab operations
IECCGeneric2.TabSystem.switchTo('bible');
IECCGeneric2.TabSystem.init({
    storageKey: 'my-tabs',
    onTabChange: (tabId) => { /* callback */ }
});
```

### Accordion System
```javascript
// Accordion operations
IECCGeneric2.AccordionSystem.toggle('point1');
IECCGeneric2.AccordionSystem.open('point1');
IECCGeneric2.AccordionSystem.close('point1');
```

### Modal System
```javascript
// Modal operations
IECCGeneric2.ModalSystem.open('modal-id', {
    title: 'Dynamic Title',
    content: '<p>Dynamic content</p>'
});
IECCGeneric2.ModalSystem.close('modal-id');
```

### Utility Functions
```javascript
// Utility functions
IECCGeneric2.smoothScrollTo('#section');
IECCGeneric2.initScrollAnimations('.fade-in');
IECCGeneric2.initMobileTooltips();

// Debounce utility
const debouncedFunction = IECCGeneric2.debounce(() => {
    console.log('Debounced!');
}, 300);
```

## ✅ Pros of Generic2 System

1. **Maximum Flexibility** - Create any layout with utility classes
2. **Smaller Bundle Size** - Only loads utilities you use
3. **Modern Development** - Aligns with current web practices
4. **No Theme Files** - All theming in one place
5. **Dynamic Theming** - Switch themes without page reload
6. **Performance** - Optimized for speed
7. **Tailwind Compatible** - Works with existing Tailwind knowledge

## ❌ Cons of Generic2 System

1. **Learning Curve** - Requires Tailwind/utility knowledge
2. **Verbose HTML** - More classes per element
3. **Consistency Risk** - Easy to create inconsistent designs
4. **Decision Fatigue** - Many options can slow development
5. **Manual Accessibility** - Must implement ARIA patterns yourself

---

# When to Use Which System

## Choose Generic (v1) When:

- ✅ **Team Development** - Multiple people creating similar content
- ✅ **Consistent Design** - Need uniform look across all sermons
- ✅ **Quick Turnaround** - Fast development with proven patterns
- ✅ **Accessibility Priority** - Built-in ARIA and keyboard navigation
- ✅ **Content-Heavy Pages** - Lots of text and standard components
- ✅ **Lower Technical Skill** - Team members less familiar with CSS

### Example Use Cases:
- Weekly sermon series with consistent format
- Multiple content creators working on sermons
- Church websites with standard layouts
- Educational content with accessibility requirements

## Choose Generic2 (v2) When:

- ✅ **Unique Designs** - Need custom, artistic layouts
- ✅ **Performance Critical** - Bundle size and speed matter
- ✅ **Single Developer** - One person with CSS/Tailwind knowledge
- ✅ **Experimental Layouts** - Trying new design patterns
- ✅ **Mobile-First** - Precise responsive control needed
- ✅ **Interactive Features** - Complex user interactions

### Example Use Cases:
- Special sermon series with unique visual themes
- High-traffic pages where performance matters
- Mobile-heavy audiences requiring optimized experiences
- Experimental or artistic sermon presentations

---

# Migration Guide

## From Generic to Generic2

### 1. Update HTML Structure
```html
<!-- Generic (Old) -->
<div class="bento-grid">
    <div class="bento-item">
        <h3>Title</h3>
        <p>Content</p>
    </div>
</div>

<!-- Generic2 (New) -->
<div class="bento-grid">
    <div class="bento-item text-center">
        <h3 class="text-xl font-bold text-theme-primary mb-2">Title</h3>
        <p class="text-gray-600 text-sm">Content</p>
    </div>
</div>
```

### 2. Update Tab System
```html
<!-- Generic (Old) -->
<button class="tab-btn active" data-tab="overview">Overview</button>
<div class="tab-content active" id="overview">Content</div>

<!-- Generic2 (New) -->
<button data-tab-trigger="overview" class="tab-button active">Overview</button>
<div data-tab-content="overview" class="active">Content</div>
```

### 3. Update Accordion System
```html
<!-- Generic (Old) -->
<div class="accordion-header">Title</div>
<div class="accordion-content">Content</div>

<!-- Generic2 (New) -->
<button data-accordion-trigger="item1" class="accordion-trigger">Title</button>
<div data-accordion-content="item1" class="accordion-content">Content</div>
```

### 4. Update JavaScript Calls
```javascript
// Generic (Old)
SermonUtils.openModal('modal-id');

// Generic2 (New)
IECCGeneric2.ModalSystem.open('modal-id');
```

### 5. Convert Theme to Data Attribute
```html
<!-- Generic (Old) -->
<link rel="stylesheet" href="css/healing-theme.css">

<!-- Generic2 (New) -->
<html data-theme="healing">
```

## From Generic2 to Generic

### 1. Create Theme File
Extract theme colors to separate CSS file:

```css
/* healing-theme.css */
:root {
    --primary-color: #06b6d4;
    --secondary-color: #0891b2;
}

.header {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}
```

### 2. Simplify HTML Structure
```html
<!-- Generic2 (Complex) -->
<div class="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1">

<!-- Generic (Simple) -->
<div class="content-card">
```

### 3. Update JavaScript API
```javascript
// Generic2 (Functional)
IECCGeneric2.TabSystem.switchTo('bible');

// Generic (Event-driven)
SermonUtils.initializeTabs();
```

---

# Best Practices

## General Guidelines

### File Organization
```
iecc/
├── css/
│   ├── iecc-base.css          # Shared foundation
│   ├── iecc-generic.css       # Component system
│   ├── iecc-generic2.css      # Utility system
│   └── themes/                # Generic themes only
│       ├── pride-theme.css
│       └── anger-theme.css
├── js/
│   ├── iecc-common.js         # Shared utilities
│   ├── iecc-generic.js        # Component behaviors
│   └── iecc-generic2.js       # Utility behaviors
└── sermons/
    ├── 2025-01-01-sermon.html
    └── 2025-01-08-sermon.html
```

### Naming Conventions

#### Generic System
```css
/* Component-based naming */
.sermon-header { }
.tab-navigation { }
.bento-grid { }
.accordion-item { }
.bible-verse { }
```

#### Generic2 System
```html
<!-- Data attribute naming -->
data-tab-trigger="main"
data-accordion-content="point1"
data-modal="context-modal"
data-theme="healing"
```

### Performance Optimization

#### Generic System
```html
<!-- Minimize theme files -->
<link rel="stylesheet" href="css/iecc-generic.css">
<link rel="stylesheet" href="css/healing-theme.css"> <!-- Only one theme -->
```

#### Generic2 System
```html
<!-- Use CDN for Tailwind in development -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Use build process for production -->
<link rel="stylesheet" href="css/tailwind-built.css">
<link rel="stylesheet" href="css/iecc-generic2.css">
```

### Accessibility Guidelines

#### Both Systems
```html
<!-- Always include ARIA attributes -->
<button role="tab" aria-selected="true">Tab</button>
<div role="tabpanel" aria-hidden="false">Content</div>

<!-- Keyboard navigation -->
<div tabindex="0" role="button">Interactive element</div>

<!-- Screen reader support -->
<span class="sr-only">Screen reader only text</span>
```

### Mobile-First Design

#### Generic System
```css
/* Mobile-first responsive design */
.bento-grid {
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .bento-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

#### Generic2 System
```html
<!-- Tailwind responsive utilities -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="bento-item">Content</div>
</div>
```

---

# Troubleshooting

## Common Issues

### Generic System Issues

#### Problem: Theme not applying
```html
<!-- ❌ Wrong order -->
<link rel="stylesheet" href="css/healing-theme.css">
<link rel="stylesheet" href="css/iecc-generic.css">

<!-- ✅ Correct order -->
<link rel="stylesheet" href="css/iecc-generic.css">
<link rel="stylesheet" href="css/healing-theme.css">
```

#### Problem: JavaScript not working
```javascript
// ❌ Called too early
SermonUtils.initializeTabs(); // DOM not ready

// ✅ Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    SermonUtils.initializeTabs();
});

// ✅ Or use defer attribute
<script src="js/iecc-generic.js" defer></script>
```

#### Problem: Accordion not opening
```html
<!-- ❌ Missing required structure -->
<div class="accordion-header">Title</div>
<div class="accordion-content">Content</div>

<!-- ✅ Complete structure -->
<div class="accordion">
    <div class="accordion-item">
        <div class="accordion-header">
            <span class="accordion-title">Title</span>
            <span class="accordion-icon">▶</span>
        </div>
        <div class="accordion-content">Content</div>
    </div>
</div>
```

### Generic2 System Issues

#### Problem: Theme not switching
```javascript
// ❌ Wrong theme name
IECCGeneric2.ThemeManager.setTheme('blue'); // Not defined

// ✅ Use defined theme
IECCGeneric2.ThemeManager.setTheme('pride'); // Defined in CSS
```

#### Problem: Tailwind classes not working
```html
<!-- ❌ Missing Tailwind -->
<link rel="stylesheet" href="css/iecc-generic2.css">

<!-- ✅ Include Tailwind first -->
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="css/iecc-generic2.css">
```

#### Problem: Data attributes not working
```html
<!-- ❌ Wrong attribute name -->
<button data-tab="main">Tab</button>

<!-- ✅ Correct attribute name -->
<button data-tab-trigger="main">Tab</button>
```

### Cross-System Issues

#### Problem: CSS conflicts
```html
<!-- ❌ Loading both systems -->
<link rel="stylesheet" href="css/iecc-generic.css">
<link rel="stylesheet" href="css/iecc-generic2.css">

<!-- ✅ Choose one system -->
<link rel="stylesheet" href="css/iecc-generic2.css">
```

#### Problem: JavaScript conflicts
```javascript
// ❌ Both systems loaded
<script src="js/iecc-generic.js"></script>
<script src="js/iecc-generic2.js"></script>

// ✅ Use one system
<script src="js/iecc-generic2.js"></script>
```

## Debug Tools

### Generic System Debug
```javascript
// Check if components are initialized
console.log(window.SermonUtils);

// Check active tabs
document.querySelectorAll('.tab-btn.active');

// Check accordion state
document.querySelectorAll('.accordion-content.active');
```

### Generic2 System Debug
```javascript
// Check system initialization
console.log(window.IECCGeneric2);

// Check current theme
console.log(IECCGeneric2.ThemeManager.getCurrentTheme());

// Check tab state
document.querySelectorAll('[data-tab-trigger].active');

// Listen for events
window.addEventListener('themeChanged', (e) => {
    console.log('Theme changed to:', e.detail.theme);
});
```

---

## Recent Updates & Fixes

### December 2024 - Generic2 System Improvements

#### Collapsible Content Height Fixes
**Issue:** Long sermon content was being cut off in collapsible sections due to insufficient max-height values.

**Changes Made:**
- Increased `.collapsible-content.active` max-height from `1000px` to `3000px`
- Increased `.collapsible .collapsible-content.active` max-height from `500px` to `2500px`
- These changes ensure comprehensive sermon content is fully visible when expanded

**Files Modified:**
- `css/iecc-generic2.css` (lines 463, 497)

**Impact:** Resolves content visibility issues in main sermon tabs with extensive collapsible sections.

#### Tab Button Contrast Improvements
**Issue:** Active tab text (white) was blending into light backgrounds, causing poor readability.

**Changes Made:**
- Added `!important` declarations to `.tab-button.active` color properties to override inline Tailwind classes
- Enhanced healing theme with dedicated `--color-tab-active` variable using darker cyan-600 (`8 145 178`) for better contrast
- Added `!important` to inactive tab colors for consistent readability

**Files Modified:**
- `css/iecc-generic2.css` (lines 277-278, 285, 804)

**Impact:** 
- Active tabs now have crisp white text on darker cyan backgrounds
- Improved accessibility and readability across all themes
- Maintains design consistency while ensuring WCAG contrast compliance

#### Technical Details

**Collapsible Height Values:**
```css
/* General collapsible content */
.collapsible-content.active {
  max-height: 3000px; /* Previously 1000px */
}

/* Nested collapsible content */
.collapsible .collapsible-content.active {
  max-height: 2500px; /* Previously 500px */
}
```

**Tab Contrast Enhancement:**
```css
/* Enhanced active tab styling */
.tab-button.active {
  color: white !important;
  background: rgb(var(--color-tab-active)) !important;
}

/* Healing theme enhancement */
[data-theme="healing"] {
  --color-tab-active: 8 145 178; /* Darker cyan-600 for better contrast */
}
```

**Browser Compatibility:** These changes maintain full compatibility with all modern browsers and don't affect existing functionality.

**Performance Impact:** Minimal - only affects CSS rendering, no JavaScript changes required.

---

## Conclusion

Both the Generic and Generic2 systems serve different needs in the IECC sermon framework ecosystem. Choose the system that best fits your project requirements, team skills, and design goals. Both systems are actively maintained and can coexist in the same project when needed.

For questions or contributions, please refer to the project repository or contact the development team.

---

**Last Updated:** December 2024  
**Version:** Generic v1.0, Generic2 v2.0  
**License:** MIT
