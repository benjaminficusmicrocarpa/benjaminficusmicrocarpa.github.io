/**
 * Tree Database Carousel - Specialized Component
 * Phase 3: Specialized Features Isolation
 * 
 * This file contains the complex image carousel functionality specifically
 * designed for botanical species photography with specialized features
 * for scientific image management and Creative Commons licensing.
 * 
 * SPECIALIZED FEATURES:
 * - Species-specific image organization and loading
 * - Complex image format handling and error recovery
 * - Thumbnail generation and navigation
 * - Creative Commons license integration
 * - Performance optimization for large image sets
 * - Scientific name formatting and display
 */

// Extend TreeDatabaseApp with carousel functionality
Object.assign(TreeDatabaseApp.prototype, {

    /**
     * Open carousel modal for a specific species
     * MODERNIZED: Now called from event delegation with species ID
     */
    openCarousel(speciesId) {
        console.log('openCarousel called with species ID:', speciesId);
        
        // Find species by ID
        const species = this.data.find(s => s.id == speciesId);
        if (!species) {
            console.error('Species not found with ID:', speciesId);
            return;
        }
        
        console.log('Found species:', species);
        
        // Extract plain scientific name without HTML tags
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const scientificName = stripHtml(species.scientific);
        console.log('Scientific name (cleaned):', scientificName);
        this.carouselData.speciesName = scientificName;
        this.carouselData.speciesChineseName = species.chinese;
        
        // Convert scientific name to folder name format
        const folderName = this.convertToFolderName(scientificName);
        console.log('Folder name:', folderName);
        
        // Check if images exist for this species
        this.loadSpeciesImages(folderName, scientificName);
    },

    /**
     * Convert scientific name to folder name format
     * PRESERVED: Exact folder naming logic
     */
    convertToFolderName(scientificName) {
        return scientificName.toLowerCase().replace(/\s+/g, '_');
    },

    /**
     * Load images for a species
     * PRESERVED: Complex image loading logic with species-specific configuration
     */
    async loadSpeciesImages(folderName, scientificName) {
        // Find the species in our image configuration
        const speciesConfig = Object.values(this.speciesImages).find(species => 
            species.folderName === folderName || 
            species.scientificName.toLowerCase() === scientificName.toLowerCase()
        );
        
        if (!speciesConfig) {
            console.error('No image configuration found for:', scientificName);
            return;
        }
        
        const images = speciesConfig.images.map(imageName => 
            this.getImageUrl(speciesConfig.folderName, imageName)
        );

        this.carouselData.images = images;
        this.carouselData.currentIndex = 0;
        
        // Update modal title with properly formatted scientific name
        const formattedTitle = this.formatScientificName(scientificName);
        const titleElement = document.getElementById('carouselTitle');
        if (titleElement) {
            titleElement.innerHTML = `${formattedTitle} - Images`;
        }
        
        // Update Chinese name display
        const chineseElement = document.getElementById('carouselChineseName');
        if (chineseElement) {
            chineseElement.textContent = this.carouselData.speciesChineseName;
        }
        
        // Show the modal
        const modal = document.getElementById('carouselModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        // Load first image and thumbnails
        this.loadCurrentImage();
        this.loadThumbnails();
        
        // Update license information from configuration
        this.updateLicenseInfo();
    },

    /**
     * Update license information from configuration
     * PRESERVED: CC license integration
     */
    updateLicenseInfo() {
        if (CONFIG.carousel.showLicense) {
            const ccLicense = document.getElementById('ccLicense');
            const ccIcon = ccLicense ? ccLicense.querySelector('.cc-icon') : null;
            
            if (ccIcon) {
                ccIcon.src = CONFIG.license.icon;
                ccIcon.alt = CONFIG.license.type;
            }
            
            if (ccLicense) {
                ccLicense.setAttribute('data-tooltip', CONFIG.license.tooltip);
                this.setupCCTooltip(ccLicense);
            }
        }
    },

    /**
     * Setup CC license tooltip with proper positioning
     * PRESERVED: Complex tooltip positioning logic
     */
    setupCCTooltip(ccLicenseElement) {
        let tooltip = document.querySelector('.cc-tooltip');
        
        // Create tooltip if it doesn't exist
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'cc-tooltip';
            document.body.appendChild(tooltip);
        }

        const showTooltip = (e) => {
            const rect = ccLicenseElement.getBoundingClientRect();
            const tooltipText = ccLicenseElement.getAttribute('data-tooltip');
            
            tooltip.textContent = tooltipText;
            
            // First make tooltip visible to get its dimensions
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '0';
            
            // Calculate initial position (above the CC license element)
            let top = rect.top - tooltip.offsetHeight - 10;
            let left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2);
            
            // Check if there's enough space above, if not position below
            if (top < 10) {
                top = rect.bottom + 10;
                tooltip.classList.add('tooltip-below');
            } else {
                tooltip.classList.remove('tooltip-below');
            }
            
            // Ensure tooltip doesn't go off-screen horizontally
            if (left < 10) {
                left = 10;
            } else if (left + tooltip.offsetWidth > window.innerWidth - 10) {
                left = window.innerWidth - tooltip.offsetWidth - 10;
            }
            
            // Apply the calculated position
            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
            
            // Show the tooltip
            tooltip.style.opacity = '1';
        };

        const hideTooltip = () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        };

        // Remove existing event listeners
        ccLicenseElement.removeEventListener('mouseenter', showTooltip);
        ccLicenseElement.removeEventListener('mouseleave', hideTooltip);
        
        // Add new event listeners
        ccLicenseElement.addEventListener('mouseenter', showTooltip);
        ccLicenseElement.addEventListener('mouseleave', hideTooltip);
    },

    /**
     * Get image URL - configurable for future CDN migration
     * PRESERVED: CDN-ready image URL generation
     */
    getImageUrl(folderName, imageName) {
        // Use configuration for easy CDN migration
        const baseUrl = CONFIG.images.baseUrl;
        return `${baseUrl}/${folderName}/${imageName}`;
    },

    /**
     * Format scientific name with HTML tags (same as in tree-database.json)
     * PRESERVED: Exact HTML formatting logic
     */
    formatScientificName(scientificName) {
        // Convert plain text to HTML formatted scientific name
        // This matches the format used in tree-database.json
        return scientificName
            .replace(/^([A-Z][a-z]+)\s+([a-z]+)/, '<i>$1 $2</i>') // Genus + species
            .replace(/\s+var\.\s+([a-z]+)/g, ' var. <i>$1</i>') // Variety
            .replace(/\s+subsp\.\s+([a-z]+)/g, ' subsp. <i>$1</i>') // Subspecies
            .replace(/\s+×\s+([a-z]+)/g, ' × <i>$1</i>') // Hybrid
            .replace(/\s+spp\./g, ' spp.') // Species plural
            .replace(/\s+cv\.\s+([^<]+)/g, ' cv. $1') // Cultivar
            .replace(/'([^']+)'/g, "'$1'"); // Cultivar names in quotes
    },

    /**
     * Load the current image in the carousel
     * PRESERVED: Complex image loading with error handling
     */
    loadCurrentImage() {
        const { images, currentIndex } = this.carouselData;
        const carouselImage = document.getElementById('carouselImage');
        const currentImageIndex = document.getElementById('currentImageIndex');
        const totalImages = document.getElementById('totalImages');
        
        if (images.length > 0 && images[currentIndex]) {
            if (carouselImage) {
                carouselImage.src = images[currentIndex];
                carouselImage.onload = () => {
                    // Image loaded successfully
                    if (currentImageIndex) currentImageIndex.textContent = currentIndex + 1;
                    if (totalImages) totalImages.textContent = images.length;
                    this.updateCarouselButtons();
                    this.updateThumbnailSelection();
                };
                carouselImage.onerror = () => {
                    // Image failed to load, try next one
                    if (currentIndex < images.length - 1) {
                        this.carouselData.currentIndex++;
                        this.loadCurrentImage();
                    } else {
                        // No images found, show placeholder
                        this.showImagePlaceholder(carouselImage, currentImageIndex, totalImages);
                    }
                };
            }
        } else {
            // No images available
            this.showImagePlaceholder(carouselImage, currentImageIndex, totalImages);
        }
    },

    /**
     * Show placeholder when no images are available
     * PRESERVED: SVG placeholder generation
     */
    showImagePlaceholder(carouselImage, currentImageIndex, totalImages) {
        const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlcyBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
        
        if (carouselImage) carouselImage.src = placeholderSvg;
        if (currentImageIndex) currentImageIndex.textContent = '0';
        if (totalImages) totalImages.textContent = '0';
        this.updateCarouselButtons();
        this.updateThumbnailSelection();
    },

    /**
     * Load thumbnails for the carousel
     * MODERNIZED: Using data attributes instead of onclick
     */
    loadThumbnails() {
        const { images } = this.carouselData;
        const thumbnailsContainer = document.getElementById('carouselThumbnails');
        
        if (images.length === 0) {
            if (thumbnailsContainer) {
                thumbnailsContainer.innerHTML = '<p style="text-align: center; color: #666;">No images available</p>';
            }
            return;
        }

        // MODERNIZED: Use data attributes for thumbnail selection
        const thumbnailsHTML = images.map((imagePath, index) => `
            <img src="${imagePath}" 
                 alt="Thumbnail ${index + 1}" 
                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                 data-carousel-thumbnail="${index}"
                 onerror="this.style.display='none'">
        `).join('');

        if (thumbnailsContainer) {
            thumbnailsContainer.innerHTML = thumbnailsHTML;
        }
    },

    /**
     * Select a thumbnail
     * MODERNIZED: Now called from event delegation
     */
    selectThumbnail(index) {
        this.carouselData.currentIndex = index;
        this.loadCurrentImage();
    },

    /**
     * Update thumbnail selection
     */
    updateThumbnailSelection() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.carouselData.currentIndex);
        });
    },

    /**
     * Update carousel navigation buttons (circular - no disabled state)
     * PRESERVED: Circular navigation logic
     */
    updateCarouselButtons() {
        // For circular carousel, buttons are never disabled
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        
        if (prevButton) prevButton.disabled = false;
        if (nextButton) nextButton.disabled = false;
    },

    /**
     * Navigate to previous image (circular)
     * PRESERVED: Circular navigation logic
     */
    previousImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            this.loadCurrentImage();
        }
    },

    /**
     * Navigate to next image (circular)
     * PRESERVED: Circular navigation logic
     */
    nextImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            this.loadCurrentImage();
        }
    },

    /**
     * Close carousel modal
     */
    closeCarouselModal() {
        const modal = document.getElementById('carouselModal');
        if (modal) {
            modal.style.display = 'none';
        }
        document.body.style.overflow = 'auto';
        this.carouselData.images = [];
        this.carouselData.currentIndex = 0;
    }
});
