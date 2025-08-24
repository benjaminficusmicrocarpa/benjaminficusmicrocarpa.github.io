# Tree Species Database - Technical Documentation

## Overview

The Tree Species Database is a web-based application that displays and manages information about tree species with integrated photo galleries, search functionality, and external database links. The application is built using vanilla JavaScript, HTML5, and CSS3, with no external dependencies.

## Architecture

### File Structure
```
db/tree_form_1/
├── index.html                 # Main entry point
├── tree-database-with-ids.json # Primary species data
├── species_images.json        # Photo configuration
├── gbif-mark-green-logo.svg   # GBIF logo for external links
├── css/
│   ├── base.css              # Base styles and variables
│   ├── components.css        # Component-specific styles
│   └── modal.css             # Modal and carousel styles
├── js/
│   ├── config.js             # Configuration constants
│   ├── main.js               # Core application logic
│   ├── utils.js              # Utility functions
│   ├── fuzzy-search.js       # Search algorithm
│   ├── search.js             # Search functionality
│   ├── carousel.js           # Photo carousel
│   └── app.js                # Application initialization
└── species_photos/           # Photo assets organized by Latin29 ID
    ├── MK33/                 # Acacia auriculiformis
    ├── 2B57/                 # Acacia confusa
    └── ...                   # Additional species folders
```

## Data Architecture

### 1. Primary Data Source: `tree-database-with-ids.json`

**Structure:**
```json
[
  {
    "id": 1,
    "scientific": "<i>Acacia auriculiformis</i>",
    "chinese": "耳果相思",
    "alternative": "耳葉相思",
    "latin29_id": "MK33"
  }
]
```

**Fields:**
- `id`: Unique identifier (1-based indexing)
- `scientific`: Scientific name with HTML formatting
- `chinese`: Chinese common name
- `alternative`: Alternative Chinese names
- `latin29_id`: Latin29 identifier for photo folder mapping

### 2. Photo Configuration: `species_images.json`

**Structure:**
```json
{
  "metadata": {
    "description": "Species image configuration",
    "version": "1.1",
    "lastUpdated": "2025-08-24",
    "imageFormat": "webp",
    "folderStructure": "species_photos/[latin29_id]/[numbered_images].webp",
    "totalSpeciesWithImages": 60
  },
  "speciesWithImages": [
    {
      "id": 1,
      "scientificName": "Acacia auriculiformis",
      "folderName": "MK33",
      "imageCount": 6,
      "images": ["01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp"]
    }
  ]
}
```

**Key Features:**
- Maps species IDs to photo folders using Latin29 IDs
- Tracks image count and file names
- Supports versioning and metadata

## Core Application Logic

### 1. Main Application Class: `TreeSpeciesDatabase`

**Location:** `js/main.js`

**Key Methods:**
- `constructor()`: Initializes data structures and loads configuration
- `init()`: Main initialization sequence
- `renderTable()`: Generates HTML table from species data
- `updateStats()`: Updates statistics display
- `openCarousel()`: Opens photo carousel modal

**Data Flow:**
1. Load `tree-database-with-ids.json` → `this.data`
2. Load `species_images.json` → `this.speciesImages`
3. Initialize filtered data → `this.filteredData`
4. Render table and update statistics

### 2. Search Implementation

**Fuzzy Search Algorithm:** `js/fuzzy-search.js`

**Features:**
- Multi-field search (scientific name, Chinese name, Latin29 ID)
- Weighted scoring system
- Prefix matching
- Token-based matching
- Configurable weights for different fields

**Search Weights:**
```javascript
{
  scientificWeight: 3.0,    // Scientific name priority
  chineseWeight: 2.0,       // Chinese name
  alternativeWeight: 1.5,   // Alternative names
  latin29Weight: 1.0        // Latin29 ID
}
```

**Search Process:**
1. Normalize input and data (lowercase, remove diacritics)
2. Calculate exact matches
3. Calculate prefix matches
4. Calculate fuzzy matches using Levenshtein distance
5. Calculate token-based matches
6. Combine scores with weights
7. Sort results by relevance

### 3. Photo Carousel System

**Location:** `js/carousel.js`

**Features:**
- Modal-based photo display
- Navigation controls (previous/next)
- Keyboard shortcuts (arrow keys, ESC)
- Touch/swipe support
- Image preloading
- Responsive design

**Modal Structure:**
```html
<div id="carouselModal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="carousel-container">
      <img id="carouselImage" src="" alt="">
      <button class="nav-btn prev">❮</button>
      <button class="nav-btn next">❯</button>
    </div>
    <div class="carousel-info">
      <span id="imageCounter"></span>
    </div>
  </div>
</div>
```

## Utility Functions

### External Database Links: `js/utils.js`

**Functions:**
- `generateGbifLink(species)`: Global Biodiversity Information Facility
- `generatePowoLink(species)`: Plants of the World Online
- `generateWfoLink(species)`: World Flora Online
- `shouldSkipExternalLink(species)`: Skip rules for special cases

**Link Generation Process:**
1. Strip HTML tags from scientific name
2. Apply skip rules (spp., hybrids, etc.)
3. Remove "spp." suffix
4. URL encode the search term
5. Generate HTML with appropriate icon/emoji

**Skip Rules:**
- Species ending with "spp."
- Hybrid indicators
- Generic or placeholder names

## Styling Architecture

### CSS Organization

**1. Base Styles (`css/base.css`)**
- CSS custom properties (variables)
- Global typography
- Layout fundamentals
- Color scheme

**2. Component Styles (`css/components.css`)**
- Table styling
- Search interface
- External link buttons (GBIF, POWO, WFO)
- Responsive design
- Interactive elements

**3. Modal Styles (`css/modal.css`)**
- Carousel modal
- Photo display
- Navigation controls
- Overlay effects

### Responsive Design

**Breakpoints:**
- Desktop: Default styles
- Tablet: `@media (max-width: 768px)`
- Mobile: `@media (max-width: 480px)`

**Mobile Adaptations:**
- Simplified table layout
- Reduced column widths
- Touch-friendly controls
- Optimized photo display

## JavaScript Module Loading

### Script Loading Order
```html
<script src="js/config.js"></script>      <!-- Configuration constants -->
<script src="js/fuzzy-search.js"></script> <!-- Search algorithm -->
<script src="js/main.js"></script>        <!-- Core application -->
<script src="js/search.js"></script>      <!-- Search functionality -->
<script src="js/carousel.js"></script>    <!-- Photo carousel -->
<script src="js/utils.js"></script>       <!-- Utility functions -->
```

**Critical Dependencies:**
- `main.js` depends on `utils.js` for external link generation
- `search.js` depends on `fuzzy-search.js` for search algorithm
- `carousel.js` is independent but used by `main.js`

### Initialization Flow
1. `DOMContentLoaded` event fires
2. `TreeSpeciesDatabase` constructor runs
3. `this.init()` called automatically
4. Data loading and table rendering
5. Event listeners attached

## Performance Optimizations

### 1. Image Optimization
- WebP format for smaller file sizes
- Progressive loading in carousel
- Preloading of adjacent images
- Responsive image sizing

### 2. Search Performance
- Debounced search input
- Efficient string normalization
- Cached search results
- Optimized scoring algorithm

### 3. Memory Management
- Event listener cleanup
- Modal state management
- Efficient DOM manipulation
- Minimal global variables

## Browser Compatibility

### Supported Features
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties
- Fetch API
- Modern DOM APIs

### Fallbacks
- Graceful degradation for older browsers
- Polyfills for critical features
- Progressive enhancement approach

## Development Guidelines

### Code Organization
- Modular JavaScript architecture
- Separation of concerns
- Consistent naming conventions
- Comprehensive error handling

### Data Management
- JSON-based data storage
- Version control for data files
- Backup and recovery procedures
- Data validation and sanitization

### Testing Considerations
- Cross-browser testing
- Mobile device testing
- Performance testing
- Accessibility testing

## Future Enhancements

### Potential Improvements
1. **Database Integration**: Replace JSON with proper database
2. **API Development**: RESTful API for data access
3. **Advanced Search**: Full-text search with filters
4. **User Management**: Authentication and user preferences
5. **Data Import/Export**: CSV/Excel support
6. **Analytics**: Usage tracking and reporting
7. **Offline Support**: Service Worker implementation
8. **Progressive Web App**: PWA features

### Scalability Considerations
- Database optimization for large datasets
- Caching strategies
- CDN integration for assets
- Load balancing for high traffic
- Microservices architecture

## Troubleshooting

### Common Issues
1. **Photo Loading Errors**: Check file paths and permissions
2. **Search Not Working**: Verify JavaScript console for errors
3. **Modal Not Opening**: Check CSS and JavaScript conflicts
4. **Performance Issues**: Monitor network and memory usage

### Debug Tools
- Browser Developer Tools
- Network tab for asset loading
- Console for JavaScript errors
- Performance profiling
- Memory usage monitoring

## Security Considerations

### Data Security
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure file uploads (if implemented)

### Privacy
- No user data collection
- No tracking scripts
- GDPR compliance considerations
- Data retention policies

## Deployment

### Production Setup
1. **Web Server**: Apache/Nginx configuration
2. **HTTPS**: SSL certificate installation
3. **Caching**: Browser and server-side caching
4. **Compression**: Gzip/Brotli compression
5. **Monitoring**: Error tracking and performance monitoring

### Environment Variables
- API endpoints (if applicable)
- Database connections
- Feature flags
- Debug settings

---

*This documentation is maintained as part of the Tree Species Database project. For questions or contributions, please refer to the project repository.*
