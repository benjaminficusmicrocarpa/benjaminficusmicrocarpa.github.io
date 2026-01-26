// Extend TreeSpeciesDatabase with carousel functionality
Object.assign(TreeSpeciesDatabase.prototype, {

    // Carousel functionality
    carouselData: {
        images: [],
        currentIndex: 0,
        speciesName: '',
        speciesChineseName: ''
    },

    // Open carousel modal for a specific species
    openCarousel(species) {
        console.log('openCarousel called with species:', species);
        
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

    // Convert scientific name to folder name format
    convertToFolderName(scientificName) {
        return scientificName.toLowerCase().replace(/\s+/g, '_');
    },

    // Load images for a species
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
        document.getElementById('carouselTitle').innerHTML = `${formattedTitle} - Images`;
        
        // Update Chinese name display
        document.getElementById('carouselChineseName').textContent = this.carouselData.speciesChineseName;
        
        // Show the modal
        const modal = document.getElementById('carouselModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Load first image and thumbnails
        this.loadCurrentImage();
        this.loadThumbnails();
        
        // Update license information from configuration
        this.updateLicenseInfo();
    },

    // Update license information from configuration
    updateLicenseInfo() {
        if (CONFIG.carousel.showLicense) {
            const ccLicense = document.getElementById('ccLicense');
            const ccIcon = ccLicense.querySelector('.cc-icon');
            
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

    // Setup CC license tooltip with proper positioning
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

    // Get image URL - configurable for future CDN migration
    getImageUrl(folderName, imageName) {
        // Use configuration for easy CDN migration
        const baseUrl = CONFIG.images.baseUrl;
        return `${baseUrl}/${folderName}/${imageName}`;
    },

    // Format scientific name with HTML tags (same as in tree-database.json)
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

    // Load the current image in the carousel
    loadCurrentImage() {
        const { images, currentIndex } = this.carouselData;
        const carouselImage = document.getElementById('carouselImage');
        const currentImageIndex = document.getElementById('currentImageIndex');
        const totalImages = document.getElementById('totalImages');
        
        if (images.length > 0 && images[currentIndex]) {
            carouselImage.src = images[currentIndex];
            carouselImage.onload = () => {
                // Image loaded successfully
                currentImageIndex.textContent = currentIndex + 1;
                totalImages.textContent = images.length;
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
                    carouselImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlcyBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
                    currentImageIndex.textContent = '0';
                    totalImages.textContent = '0';
                    this.updateCarouselButtons();
                    this.updateThumbnailSelection();
                }
            };
        } else {
            // No images available
            carouselImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIGltYWdlcyBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
            currentImageIndex.textContent = '0';
            totalImages.textContent = '0';
            this.updateCarouselButtons();
            this.updateThumbnailSelection();
        }
    },

    // Load thumbnails for the carousel
    loadThumbnails() {
        const { images } = this.carouselData;
        const thumbnailsContainer = document.getElementById('carouselThumbnails');
        
        if (images.length === 0) {
            thumbnailsContainer.innerHTML = '<p style="text-align: center; color: #666;">No images available</p>';
            return;
        }

        const thumbnailsHTML = images.map((imagePath, index) => `
            <img src="${imagePath}" 
                 alt="Thumbnail ${index + 1}" 
                 class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="app.selectThumbnail(${index})"
                 onerror="this.style.display='none'">
        `).join('');

        thumbnailsContainer.innerHTML = thumbnailsHTML;
    },

    // Select a thumbnail
    selectThumbnail(index) {
        this.carouselData.currentIndex = index;
        this.loadCurrentImage();
    },

    // Update thumbnail selection
    updateThumbnailSelection() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.carouselData.currentIndex);
        });
    },

    // Update carousel navigation buttons (circular - no disabled state)
    updateCarouselButtons() {
        // For circular carousel, buttons are never disabled
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        
        if (prevButton) prevButton.disabled = false;
        if (nextButton) nextButton.disabled = false;
    },

    // Navigate to previous image (circular)
    previousImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            this.loadCurrentImage();
        }
    },

    // Navigate to next image (circular)
    nextImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            this.loadCurrentImage();
        }
    },

    // Close carousel modal
    closeCarouselModal() {
        const modal = document.getElementById('carouselModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        this.carouselData.images = [];
        this.carouselData.currentIndex = 0;
    }
});

// Global carousel functions that can be called from HTML onclick attributes
function closeCarouselModal() {
    if (app) {
        app.closeCarouselModal();
    }
}

function previousImage() {
    if (app) {
        app.previousImage();
    }
}

function nextImage() {
    if (app) {
        app.nextImage();
    }
}


