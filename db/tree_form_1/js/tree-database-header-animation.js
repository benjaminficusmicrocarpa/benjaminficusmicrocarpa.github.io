/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🌳 TREE DATABASE HEADER ANIMATION SYSTEM
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎯 ANIMATED BACKGROUND HEADER
 * ──────────────────────────────────────
 * • Randomly selects species images from species_images.json
 * • Creates smooth, natural animations with gradual enlargement, contraction, and displacement
 * • Applies blue tint overlay for consistent branding
 * • Cycles through different images for visual variety
 * • Optimized for performance with preloading and smooth transitions
 * 
 * 🚀 KEY FEATURES:
 * ─────────────────
 * • Random image selection from available species photos
 * • Multiple animation patterns for visual variety
 * • Smooth transitions between images
 * • Performance optimized with image preloading
 * • Responsive design support
 * • Graceful fallback for missing images
 * 
 * ════════════════════════════════════════════════════════════════════════════════
 */

class HeaderAnimationSystem {
    constructor() {
        this.speciesImages = null;
        this.currentImageIndex = 0;
        this.animationInterval = null;
        this.preloadedImages = new Set();
        this.animationDuration = 20000; // 20 seconds per image
        this.transitionDuration = 3000; // 3 seconds transition
        this.maxConcurrentImages = 1; // Show only one image at a time
        
        this.init();
    }

    /**
     * Initialize the header animation system
     */
    async init() {
        try {
            await this.loadSpeciesImages();
            this.setupHeaderBackground();
            this.startAnimation();
        } catch (error) {
            console.warn('Header animation initialization failed:', error);
            this.setupFallbackBackground();
        }
    }

    /**
     * Load species images data from JSON file
     */
    async loadSpeciesImages() {
        try {
            const response = await fetch('species_images.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.speciesImages = data.speciesWithImages || [];
            
            if (this.speciesImages.length === 0) {
                throw new Error('No species images found in JSON data');
            }
        } catch (error) {
            console.error('Failed to load species images:', error);
            throw error;
        }
    }

    /**
     * Setup the header background container
     */
    setupHeaderBackground() {
        const backgroundContainer = document.getElementById('headerBackground');
        if (!backgroundContainer) {
            console.warn('Header background container not found');
            return;
        }

        // Clear any existing content
        backgroundContainer.innerHTML = '';

        // Create initial background image
        this.addBackgroundImage(backgroundContainer, 0);
    }

    /**
     * Add a background image to the container
     */
    addBackgroundImage(container, index) {
        const imageData = this.getRandomSpeciesImage();
        if (!imageData) return;

        const img = document.createElement('img');
        img.className = 'header-bg-image';
        img.src = `species_photos/${imageData.folderName}/${imageData.image}`;
        img.alt = `Background image of ${imageData.scientificName}`;
        
        // Apply random animation pattern
        const animationPatterns = ['backgroundFloat', 'backgroundFloat2', 'backgroundFloat3'];
        const randomPattern = animationPatterns[Math.floor(Math.random() * animationPatterns.length)];
        img.style.animationName = randomPattern;
        
        // Randomize animation duration slightly for variety
        const baseDuration = this.animationDuration;
        const variation = baseDuration * 0.3; // ±30% variation
        const randomDuration = baseDuration + (Math.random() - 0.5) * variation;
        img.style.animationDuration = `${randomDuration}ms`;
        
        // Ensure image covers the entire canvas
        img.style.left = '0%';
        img.style.top = '0%';
        
        // Set z-index for layering
        img.style.zIndex = 1;
        
        // Add opacity variation for depth
        const baseOpacity = 0.35;
        const opacityVariation = 0.05;
        img.style.opacity = baseOpacity + (Math.random() - 0.5) * opacityVariation;
        
        // Handle image load errors gracefully
        img.onerror = () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.display = 'none';
        };

        // Preload the image
        this.preloadImage(img.src);
        
        container.appendChild(img);
    }

    /**
     * Get a random species image from the available data
     */
    getRandomSpeciesImage() {
        if (!this.speciesImages || this.speciesImages.length === 0) {
            return null;
        }

        const randomSpecies = this.speciesImages[Math.floor(Math.random() * this.speciesImages.length)];
        const randomImage = randomSpecies.images[Math.floor(Math.random() * randomSpecies.images.length)];
        
        return {
            scientificName: randomSpecies.scientificName,
            folderName: randomSpecies.folderName,
            image: randomImage
        };
    }

    /**
     * Preload an image for better performance
     */
    preloadImage(src) {
        if (this.preloadedImages.has(src)) {
            return;
        }

        const img = new Image();
        img.onload = () => {
            this.preloadedImages.add(src);
        };
        img.onerror = () => {
            console.warn(`Failed to preload image: ${src}`);
        };
        img.src = src;
    }

    /**
     * Start the animation cycle
     */
    startAnimation() {
        // Change images every animation duration
        this.animationInterval = setInterval(() => {
            this.cycleBackgroundImages();
        }, this.animationDuration);
    }

    /**
     * Cycle through background images with smooth crossfade
     */
    cycleBackgroundImages() {
        const backgroundContainer = document.getElementById('headerBackground');
        if (!backgroundContainer) return;

        const images = backgroundContainer.querySelectorAll('.header-bg-image');
        
        if (images.length > 0) {
            // Add new image first (invisible)
            const newImage = this.createBackgroundImage(0);
            newImage.style.opacity = '0';
            backgroundContainer.appendChild(newImage);
            
            // Fade in new image while fading out old image
            this.crossfadeImages(images[0], newImage);
        } else {
            // If no images exist, add one directly
            this.addBackgroundImage(backgroundContainer, 0);
        }
    }

    /**
     * Create a background image element (without adding to DOM)
     */
    createBackgroundImage(index) {
        const imageData = this.getRandomSpeciesImage();
        if (!imageData) return null;

        const img = document.createElement('img');
        img.className = 'header-bg-image';
        img.src = `species_photos/${imageData.folderName}/${imageData.image}`;
        img.alt = `Background image of ${imageData.scientificName}`;
        
        // Apply random animation pattern
        const animationPatterns = ['backgroundFloat', 'backgroundFloat2', 'backgroundFloat3'];
        const randomPattern = animationPatterns[Math.floor(Math.random() * animationPatterns.length)];
        img.style.animationName = randomPattern;
        
        // Randomize animation duration slightly for variety
        const baseDuration = this.animationDuration;
        const variation = baseDuration * 0.3; // ±30% variation
        const randomDuration = baseDuration + (Math.random() - 0.5) * variation;
        img.style.animationDuration = `${randomDuration}ms`;
        
        // Ensure image covers the entire canvas
        img.style.left = '0%';
        img.style.top = '0%';
        
        // Set z-index for layering
        img.style.zIndex = 1;
        
        // Add opacity variation for depth
        const baseOpacity = 0.5;
        const opacityVariation = 0.05;
        img.style.opacity = baseOpacity + (Math.random() - 0.5) * opacityVariation;
        
        // Handle image load errors gracefully
        img.onerror = () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.display = 'none';
        };

        // Preload the image
        this.preloadImage(img.src);
        
        return img;
    }

    /**
     * Smooth crossfade between two images
     */
    crossfadeImages(oldImage, newImage) {
        // Set transition properties for both images
        const transitionStyle = `opacity ${this.transitionDuration}ms ease-in-out`;
        oldImage.style.transition = transitionStyle;
        newImage.style.transition = transitionStyle;
        
        // Start the crossfade
        oldImage.style.opacity = '0';
        newImage.style.opacity = '0.5';
        
        // Remove old image after transition completes
        setTimeout(() => {
            if (oldImage.parentNode) {
                oldImage.remove();
            }
        }, this.transitionDuration);
    }

    /**
     * Fade out an image with smooth transition (legacy method)
     */
    fadeOutImage(img, callback) {
        img.style.transition = `opacity ${this.transitionDuration}ms ease-out`;
        img.style.opacity = '0';
        
        setTimeout(() => {
            if (callback) callback();
        }, this.transitionDuration);
    }

    /**
     * Setup fallback background when species images are not available
     */
    setupFallbackBackground() {
        const backgroundContainer = document.getElementById('headerBackground');
        if (!backgroundContainer) return;

        // Create a simple gradient fallback
        backgroundContainer.style.background = `
            linear-gradient(135deg, 
                rgba(37, 99, 235, 0.1), 
                rgba(59, 130, 246, 0.05), 
                rgba(37, 99, 235, 0.1)
            )
        `;
    }

    /**
     * Stop the animation system
     */
    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Restart the animation system
     */
    restart() {
        this.stop();
        this.startAnimation();
    }

    /**
     * Update animation settings
     */
    updateSettings(settings) {
        if (settings.animationDuration) {
            this.animationDuration = settings.animationDuration;
        }
        if (settings.transitionDuration) {
            this.transitionDuration = settings.transitionDuration;
        }
        if (settings.maxConcurrentImages) {
            this.maxConcurrentImages = settings.maxConcurrentImages;
        }
        
        // Restart with new settings
        this.restart();
    }
}

// Initialize the header animation system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if the header background container exists
    if (document.getElementById('headerBackground')) {
        window.headerAnimation = new HeaderAnimationSystem();
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderAnimationSystem;
}
