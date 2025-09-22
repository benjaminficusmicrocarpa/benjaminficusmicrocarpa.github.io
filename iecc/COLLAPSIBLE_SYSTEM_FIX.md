# Collapsible System Fix Documentation

## Recent Updates (December 2024)

### Additional Fixes Applied

#### 1. Collapsible Content Height Expansion
**Date:** December 15, 2024  
**Issue:** Long sermon content was being cut off in collapsible sections due to insufficient max-height values.

**Changes Made:**
- Increased `.collapsible-content.active` max-height from `1000px` to `3000px`
- Increased `.collapsible .collapsible-content.active` max-height from `500px` to `2500px`
- Updated CSS comments to reflect the changes

**Files Modified:**
- `css/iecc-generic2.css` (lines 463, 497)

**Impact:** Resolves content visibility issues in main sermon tabs with extensive collapsible sections.

#### 2. Tab Button Text Contrast Enhancement
**Date:** December 15, 2024  
**Issue:** Active tab text (white) was blending into light backgrounds, causing poor readability.

**Changes Made:**
- Added `!important` declarations to `.tab-button.active` color properties
- Enhanced healing theme with dedicated `--color-tab-active` variable using darker cyan-600
- Added `!important` to inactive tab colors for consistent readability

**Files Modified:**
- `css/iecc-generic2.css` (lines 277-278, 285, 804)

**Impact:** 
- Active tabs now have crisp white text on darker cyan backgrounds
- Improved accessibility and WCAG contrast compliance
- Better readability across all themes

---

## Original Problem Summary
The collapsible elements in sermon pages were experiencing a "rapid open/close" behavior where clicking a collapsible would open it briefly and then immediately close it again.

## Root Cause Analysis

### The Double Initialization Bug
The issue was caused by **double initialization** of the Generic2 framework:

1. **Auto-initialization**: The `iecc-generic2.js` framework automatically initializes when the DOM loads
2. **Manual initialization**: HTML files were also calling `window.IECCGeneric2.init()` in their custom scripts
3. **Result**: Event listeners were attached twice to the same elements

### Technical Flow of the Bug
```javascript
// What was happening:
1. iecc-generic2.js loads → auto-initializes → attaches click listeners
2. HTML custom script runs → calls init() again → attaches duplicate listeners
3. User clicks collapsible trigger
4. First listener fires → opens collapsible
5. Second listener fires immediately → closes collapsible
6. User sees rapid open/close behavior
```

### Console Evidence
The bug manifested in console logs showing rapid successive messages:
```
Collapsible singleness opened
Collapsible singleness closed
```

## Solution Implemented

### 1. Removed Double Initialization
**Before (Problematic)**:
```javascript
// In HTML files
document.addEventListener('DOMContentLoaded', function() {
    window.IECCGeneric2.init({  // ❌ This caused duplicate listeners
        enableThemeDetection: true,
        // ... config
    });
});
```

**After (Fixed)**:
```javascript
// In HTML files
document.addEventListener('DOMContentLoaded', function() {
    // Set theme (safe to call multiple times)
    if (window.IECCGeneric2 && window.IECCGeneric2.ThemeManager) {
        window.IECCGeneric2.ThemeManager.setTheme('fresh-hope');
    }
    
    // Add custom event listeners (these don't conflict)
    window.addEventListener('collapsibleToggled', function(e) {
        console.log('Collapsible toggled:', e.detail);
    });
    
    // ✅ No manual init() call - framework auto-initializes
});
```

### 2. Enhanced CSS Specificity
Added higher specificity CSS rules to override any conflicts from the base framework:

```css
/* Higher specificity to override iecc-generic2.css */
.collapsible .collapsible-content,
[data-collapsible-content] {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out;
    padding: 0;
    margin: 0;
}

.collapsible .collapsible-content.active,
[data-collapsible-content].active {
    max-height: 2000px;
    transition: max-height 0.5s ease-in;
}
```

### 3. Improved Arrow Rotation
Ensured smooth arrow rotation transitions:

```css
.collapsible-trigger span:last-child {
    transition: transform 0.3s ease;
}

.collapsible-trigger.active span:last-child {
    transform: rotate(180deg);
}
```

## Technical Architecture

### HTML Structure Required
```html
<div class="collapsible">
    <button class="collapsible-trigger" data-collapsible-trigger="unique-id">
        <div class="flex justify-between items-center">
            <div>
                <h3>Section Title</h3>
                <p>Description</p>
            </div>
            <span class="text-2xl transition-transform duration-300">▼</span>
        </div>
    </button>
    
    <div class="collapsible-content" data-collapsible-content="unique-id">
        <div class="p-6">
            <!-- Your content here -->
        </div>
    </div>
</div>
```

### JavaScript Event Flow
1. User clicks trigger with `data-collapsible-trigger="id"`
2. `CollapsibleSystem.toggle(id)` is called **once**
3. Method finds elements using `data-collapsible-content="id"`
4. Toggles `.active` class on both trigger and content
5. CSS transitions handle the visual animation
6. Custom event `collapsibleToggled` is dispatched

### CSS Transition System
- **Collapsed state**: `max-height: 0`, `overflow: hidden`
- **Expanded state**: `max-height: 2000px` (adjust if content is taller)
- **Animation**: Uses `max-height` transitions for smooth expand/collapse
- **Why not `display: none`**: Would break CSS transitions

## Files Modified

### 1. `/iecc/css/iecc-generic2.css`
- Added comprehensive documentation comments
- Enhanced CSS specificity for collapsible rules
- Added troubleshooting checklist in comments

### 2. `/iecc/js/iecc-generic2.js`
- Added detailed documentation to `CollapsibleSystem`
- Enhanced the `toggle()` method with extensive comments
- Added auto-initialization documentation
- Improved error handling and debug logging

### 3. HTML Files (e.g., purpose sermon)
- Removed duplicate `init()` calls
- Added CSS overrides for theme-specific styling
- Simplified JavaScript initialization

## Testing Checklist

To verify the fix is working:

1. **✅ Single Toggle**: Click a collapsible - it should open smoothly
2. **✅ Single Toggle**: Click again - it should close smoothly  
3. **✅ No Rapid Messages**: Console should show single open/close messages
4. **✅ Arrow Rotation**: Arrow should rotate 180° when opening/closing
5. **✅ Smooth Animation**: Transitions should be fluid, not jerky
6. **✅ Multiple Collapsibles**: All collapsibles on page should work independently

## Troubleshooting Guide

### Issue: Collapsible opens and immediately closes
**Cause**: Duplicate event listeners
**Solution**: Check for multiple `init()` calls or conflicting click handlers

### Issue: No animation or jerky movement
**Cause**: CSS transition problems
**Solution**: 
- Verify `max-height` values are sufficient
- Ensure `overflow: hidden` is set
- Check transition properties

### Issue: Arrow doesn't rotate
**Cause**: CSS selector issues
**Solution**:
- Ensure arrow is last child of trigger button
- Check CSS selector specificity
- Verify `.active` class is being toggled

### Issue: Content gets cut off
**Cause**: `max-height` too small
**Solution**: Increase `max-height` value in CSS `.active` state

## Future Maintenance

### When Adding New Collapsibles
1. Use the documented HTML structure exactly
2. Ensure `data-collapsible-trigger` and `data-collapsible-content` IDs match
3. Don't add manual click handlers - let the framework handle it
4. Test for double-click behavior

### When Updating the Framework
1. Maintain single auto-initialization pattern
2. Don't break the CSS specificity hierarchy
3. Keep debug logging for troubleshooting
4. Test with existing sermon pages

### Migration for Existing Pages
If you find pages with manual `init()` calls:
1. Remove the `window.IECCGeneric2.init()` call
2. Keep theme setting and custom event listeners
3. Test collapsible functionality
4. Check console for error messages

## Performance Impact
- **Positive**: Eliminates duplicate event listeners
- **Positive**: Reduces JavaScript execution on page load
- **Neutral**: CSS transitions use hardware acceleration
- **Positive**: Cleaner, more maintainable code structure

This fix ensures reliable, smooth collapsible functionality across all sermon pages while maintaining the flexibility and theming capabilities of the Generic2 framework.
