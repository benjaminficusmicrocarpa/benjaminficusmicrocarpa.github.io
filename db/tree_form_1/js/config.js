// Configuration file for Tree Species Database
// Easy to modify for CDN migration and other settings

const CONFIG = {
    // Image source configuration
    images: {
        // Current local path - change this to CDN URL when migrating
        baseUrl: 'species_photos',
        
        // Example CDN configuration (uncomment when migrating):
        // baseUrl: 'https://your-cdn.com/tree-species-images',
        
        // Alternative CDN configurations:
        // baseUrl: 'https://images.example.com/species',
        // baseUrl: 'https://cdn.example.com/tree-database',
        
        // File format
        format: 'webp'
    },
    
    // Carousel settings
    carousel: {
        circular: true,
        autoPlay: false,
        autoPlayInterval: 5000, // 5 seconds
        showThumbnails: true,
        showCounter: true,
        showLicense: true
    },
    
    // UI settings
    ui: {
        showCameraIcon: true,
        hoverEffects: true,
        responsive: true
    },
    
    // License information
    license: {
        type: 'CC BY-SA 4.0',
        icon: 'by-sa.svg',
        tooltip: 'Creative Commons Attribution-ShareAlike 4.0 International License',
        dimensions: {
            width: 88,
            height: 31
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
