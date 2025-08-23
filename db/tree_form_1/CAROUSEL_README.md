# Tree Species Image Carousel

## Overview
This feature adds an interactive image carousel to the Tree Species Database. When users click on a species name in the table, a modal opens displaying images of that species in a carousel format.

## Features

### 🖼️ Image Display
- **Modal Carousel**: Opens a full-screen modal with image carousel
- **Circular Navigation**: Previous/Next buttons loop around (no end/beginning)
- **Keyboard Navigation**: Arrow keys for navigation
- **Thumbnails**: Clickable thumbnails at the bottom for quick navigation
- **Image Counter**: Shows current image position (e.g., "3 / 6")
- **Responsive Design**: Works on desktop and mobile devices
- **CC BY-SA License**: Creative Commons license icon with tooltip

### 🎨 Visual Enhancements
- **Proper Scientific Name Formatting**: HTML-formatted names matching tree-database.json
- **Smart UI**: Only species with images show camera icon and are clickable
- **License Attribution**: CC BY-SA 4.0 license icon (88×31px) on all images
- **Custom Tooltips**: High z-index tooltips that display above all other elements

### 🎯 User Interaction
- **Click to Open**: Click on any species name in the table to open carousel
- **Visual Feedback**: Species names show a camera icon (📷) on hover
- **Keyboard Navigation**: Use arrow keys to navigate images
- **Escape Key**: Press Escape to close the carousel

### 📁 File Structure
```
species_photos/
├── acacia_auriculiformis/
│   ├── 01.webp
│   ├── 02.webp
│   ├── 03.webp
│   ├── 04.webp
│   ├── 05.webp
│   └── 06.webp
└── [other_species]/
    └── [numbered_images].webp
```

### 📋 Configuration File
The system uses `species_images.json` to specify which species have images and their details:

```json
{
  "speciesWithImages": [
    {
      "id": 1,
      "scientificName": "Acacia auriculiformis",
      "folderName": "acacia_auriculiformis",
      "imageCount": 6,
      "images": ["01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp"]
    }
  ]
}
```

## How to Add Images for New Species

1. **Create Folder**: Create a folder in `species_photos/` with the species name in lowercase, using underscores for spaces
   - Example: `acacia_auriculiformis` for "Acacia auriculiformis"

2. **Add Images**: Place your images in the folder with any naming convention you prefer

3. **Update Configuration**: Add an entry to `species_images.json`:
   - `id`: The species ID from the main database
   - `scientificName`: The exact scientific name
   - `folderName`: The folder name in species_photos/
   - `imageCount`: Number of images
   - `images`: Array of image filenames

4. **Benefits of This Approach**:
   - Only species with images show camera icon and are clickable
   - No 404 errors for missing images
   - Flexible image naming (not limited to numbered format)
   - Easy to manage and update

## Technical Implementation

### Files Modified
- `index.html`: Added carousel modal structure
- `styles.css`: Added carousel styling and responsive design
- `app.js`: Added carousel functionality and event handlers
- `config.js`: Configuration file for easy CDN migration
- `species_images.json`: Image configuration for each species

### CDN Migration
The system is designed for easy migration to CDN:

1. **Edit `config.js`**: Change `CONFIG.images.baseUrl` to your CDN URL
2. **Upload Images**: Upload all images to your CDN maintaining the same folder structure
3. **Update Configuration**: No other changes needed!

Example CDN configuration:
```javascript
images: {
    baseUrl: 'https://your-cdn.com/tree-species-images',
    format: 'webp'
}
```

### Key Functions
- `openCarousel(species)`: Opens carousel for a specific species
- `loadSpeciesImages(folderName, scientificName)`: Loads images for a species
- `loadCurrentImage()`: Displays current image in carousel
- `loadThumbnails()`: Creates thumbnail navigation
- `previousImage()` / `nextImage()`: Navigation functions

### CSS Classes
- `.carousel-modal`: Main carousel modal container
- `.carousel-container`: Image display area
- `.carousel-button`: Navigation buttons
- `.thumbnail`: Thumbnail images
- `.scientific-name`: Clickable species names

## Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design for mobile devices
- Touch-friendly navigation on mobile

## Testing
Use the test file `test_carousel.html` to verify image loading and carousel functionality.

## Example Usage
1. Open the main page (`index.html`)
2. Find "Acacia auriculiformis" in the table (first row)
3. Click on the species name
4. The carousel will open showing 6 images of the species
5. Navigate using arrow buttons, keyboard arrows, or thumbnails
6. Press Escape or click outside to close
