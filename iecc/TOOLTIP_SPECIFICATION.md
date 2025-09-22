# Generic2 Framework Tooltip System Specification

## Overview
The Generic2 framework provides a built-in tooltip system that works seamlessly with the framework's CSS and JavaScript. This system is designed to be mobile-friendly, accessible, and consistent with the framework's design language.

**🔧 ANTI-CLIPPING SOLUTION**: The tooltip system uses `position: fixed` with JavaScript-calculated positioning to prevent tooltips from being clipped by parent containers with `overflow: hidden` (such as bento grids, accordions, and collapsible content).

## HTML Structure

### Basic Tooltip
```html
<span class="tooltip">Trigger Text<span class="tooltip-content">Tooltip content goes here</span></span>
```

### Example Usage
```html
<p>
  God is doing a <span class="tooltip">NEW THING<span class="tooltip-content">Something completely fresh, unprecedented, and transformative in your spiritual journey</span></span> in your life.
</p>
```

## CSS Classes

### `.tooltip`
- **Purpose**: The trigger element that users hover over
- **Styling**: 
  - Blue text color (`rgb(37 99 235)`)
  - Dotted underline decoration
  - Bold font weight (600)
  - Help cursor on hover
  - Relative positioning

### `.tooltip-content`
- **Purpose**: The tooltip popup content
- **Styling**:
  - Dark background (`rgb(17 24 39)`)
  - White text
  - Rounded corners (0.5rem)
  - Padding (0.75rem 1rem)
  - Positioned above the trigger
  - Hidden by default (opacity: 0, visibility: hidden)
  - Shows on hover (opacity: 1, visibility: visible)
  - Maximum width: 300px
  - Z-index: 50 (appears above other content)

## Responsive Behavior

### Desktop
- Tooltips appear above the trigger element
- Smart positioning prevents overflow off screen edges
- Smooth fade-in/fade-out transitions

### Mobile (≤768px)
- Tooltips appear in the center of the screen
- Fixed positioning for better touch interaction
- Maximum width: 20rem (320px)
- Auto-hide after 4 seconds when tapped

## Accessibility Features

- **Keyboard Navigation**: Tooltips work with keyboard focus
- **Screen Readers**: Proper ARIA attributes for screen reader compatibility
- **High Contrast**: Compatible with high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` settings

## Best Practices

### Content Guidelines
1. **Keep tooltips concise** - Aim for 1-2 sentences maximum
2. **Use clear language** - Avoid jargon or complex terms
3. **Provide value** - Only add tooltips that enhance understanding
4. **Be consistent** - Use similar tone and style across all tooltips

### Technical Guidelines
1. **Proper nesting** - Always nest `.tooltip-content` inside `.tooltip`
2. **No line breaks** - Keep tooltip content on single lines when possible
3. **Escape quotes** - Use `&quot;` or `&apos;` for quotes in tooltip content
4. **Test on mobile** - Verify tooltips work properly on touch devices

## Common Patterns

### Scripture References
```html
<p>
  "For I know the plans I have for you," declares the LORD, 
  <span class="tooltip">plans to prosper you<span class="tooltip-content">God's intention is for your flourishing and success, not harm</span></span> 
  and not to harm you.
</p>
```

### Technical Terms
```html
<p>
  The <span class="tooltip">prefrontal cortex<span class="tooltip-content">The part of the brain responsible for executive functions like attention and decision-making</span></span> 
  is crucial for focus and attention.
</p>
```

### Acronyms
```html
<p>
  The <span class="tooltip">ADHD<span class="tooltip-content">Attention Deficit Hyperactivity Disorder - a neurodevelopmental condition affecting focus and attention</span></span> 
  brain processes information differently.
</p>
```

## Anti-Clipping Solution

### The Problem
Tooltips in modern web layouts often get clipped by parent containers that have `overflow: hidden` or `overflow: auto`. This is especially common in:
- Bento grid items (`.bento-item`)
- Accordion content (`.accordion-content`)
- Collapsible content (`.collapsible-content`)
- Modal content
- Any container with `overflow: hidden`

### The Solution
The Generic2 framework solves this by:

1. **Fixed Positioning**: Uses `position: fixed` instead of `position: absolute`
2. **JavaScript Calculation**: Calculates tooltip position relative to the viewport
3. **High Z-Index**: Uses `z-index: 9999` to appear above all containers
4. **Smart Positioning**: Automatically adjusts position to prevent viewport overflow

### How It Works
```javascript
// JavaScript calculates position relative to viewport
const rect = tooltip.getBoundingClientRect();
let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
let top = rect.top - tooltipHeight - margin;

// Apply fixed positioning
content.style.left = `${left}px`;
content.style.top = `${top}px`;
```

### Benefits
- ✅ Tooltips never get clipped by parent containers
- ✅ Works in bento grids, accordions, and any container
- ✅ Maintains proper positioning relative to trigger element
- ✅ Automatically handles viewport edge cases
- ✅ No changes needed to existing container CSS

## Troubleshooting

### Tooltip Not Showing
1. Check that both `.tooltip` and `.tooltip-content` classes are present
2. Verify the Generic2 CSS file is loaded
3. Ensure proper HTML nesting structure
4. Check for CSS conflicts with other stylesheets

### Tooltip Clipping Issues
1. **Problem**: Tooltip appears cut off or hidden
2. **Solution**: The framework automatically handles this with fixed positioning
3. **If still occurring**: Check that JavaScript is loaded and working
4. **Verify**: Tooltip should appear above all containers with high z-index

### Mobile Issues
1. Verify the framework's mobile tooltip JavaScript is loaded
2. Test touch interactions on actual devices
3. Check for viewport meta tag in HTML head

### Styling Issues
1. Don't override framework CSS classes directly
2. Use theme variables for consistent colors
3. Test across different screen sizes

## Integration with Generic2 Framework

The tooltip system is automatically initialized when the Generic2 framework loads. No additional JavaScript setup is required.

### Framework Features
- **Auto-initialization**: Tooltips work immediately after page load
- **Theme integration**: Colors automatically match the selected theme
- **Mobile optimization**: Touch-friendly interactions built-in
- **Performance optimized**: Minimal JavaScript overhead

## Migration from Other Systems

### From HTML `title` attribute
```html
<!-- OLD -->
<span title="Tooltip content">Text</span>

<!-- NEW -->
<span class="tooltip">Text<span class="tooltip-content">Tooltip content</span></span>
```

### From Custom CSS
```html
<!-- OLD -->
<span class="custom-tooltip" data-tooltip="Content">Text</span>

<!-- NEW -->
<span class="tooltip">Text<span class="tooltip-content">Content</span></span>
```

## Examples in Context

### Sermon Content
```html
<div class="content-card">
  <h3>Spiritual Growth</h3>
  <p>
    When we experience <span class="tooltip">spiritual dryness<span class="tooltip-content">A period when God feels distant and faith feels routine or empty</span></span>, 
    it's important to remember that God is still working in our lives.
  </p>
</div>
```

### Bible Study
```html
<div class="bible-verse">
  <p>
    "And we know that in all things God works for the good of those who love him, 
    who have been called according to his <span class="tooltip">purpose<span class="tooltip-content">God's specific plan and intention for each believer's life</span></span>."
  </p>
  <p class="text-right font-semibold">Romans 8:28</p>
</div>
```

This specification ensures consistent, accessible, and mobile-friendly tooltips across all Generic2 framework implementations.
