class TreeSpeciesDatabase {
    constructor() {
        this.data = []; // Array to store all tree species data
        this.filteredData = []; // Array to store filtered search results
        this.currentSuggestionIndex = -1; // Track which suggestion is highlighted
        this.currentMatches = []; // Store current suggestion matches
        this.speciesImages = {}; // Store species image configuration
        
        // Initialize fuzzy search engine
        this.fuzzyEngine = new FuzzySearchEngine({
            minSimilarity: 0.4, // Lower threshold for more forgiving search
            maxResults: 8,
            scientificWeight: 1.2, // Slightly favor scientific names
            chineseWeight: 1.0,
            alternativeWeight: 0.8
        });
        
        this.init(); // Start the application
    }

    // Initialize the application by loading data and setting up functionality
    async init() {
        await this.loadData(); // Load tree species data from JSON file
        await this.loadImageConfiguration(); // Load species image configuration
        this.setupEventListeners(); // Set up user interaction handlers
        this.renderTable(this.data); // Display all data initially
        this.updateStats(); // Update the statistics display
    }

    // Load tree species data from the JSON file
    async loadData() {
        try {
            const response = await fetch('tree-database.json');
            const jsonData = await response.json();
            this.data = jsonData.species; // Store the species array
            this.filteredData = [...this.data]; // Copy all data to filtered array initially
        } catch (error) {
            console.error('Error loading tree data:', error);
            // Fallback: could load embedded data here if JSON file fails
        }
    }

    // Load species image configuration from JSON file
    async loadImageConfiguration() {
        try {
            const response = await fetch('species_images.json');
            const imageConfig = await response.json();
            
            // Create a lookup object for quick access
            this.speciesImages = {};
            imageConfig.speciesWithImages.forEach(species => {
                this.speciesImages[species.id] = species;
            });
            
            console.log('Loaded image configuration for', Object.keys(this.speciesImages).length, 'species');
        } catch (error) {
            console.error('Error loading image configuration:', error);
            this.speciesImages = {};
        }
    }

    // Set up all the event listeners for user interactions
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const suggestions = document.getElementById('suggestions');

        // Handle typing in the search box
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Handle keyboard navigation in search suggestions
        searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        // Hide suggestions when user clicks away from search box
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200); // Small delay to allow clicking on suggestions
        });

        // Show suggestions again when user clicks back in search box
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.showSuggestions(e.target.value);
            }
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('infoModal');
            const carouselModal = document.getElementById('carouselModal');
            if (e.target === modal) {
                this.closeModal();
            }
            if (e.target === carouselModal) {
                this.closeCarouselModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeCarouselModal();
            }
            
            // Carousel keyboard navigation
            const carouselModal = document.getElementById('carouselModal');
            if (carouselModal.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextImage();
                }
            }
        });

        // Handle tooltip positioning
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('tooltip-header')) {
                const tooltip = e.target.querySelector('.tooltip');
                if (tooltip) {
                    const rect = e.target.getBoundingClientRect();
                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                }
            }
        });
    }

    // Handle search functionality when user types
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            // If search is empty, show all species
            this.filteredData = [...this.data];
            this.hideSuggestions();
        } else {
            // Use fuzzy search for filtering
            this.filteredData = this.fuzzyEngine.search(this.data, trimmedQuery);
            this.showSuggestions(trimmedQuery);
        }

        // Update the table and statistics
        this.renderTable(this.filteredData);
        this.updateStats();
    }

    // Show dropdown suggestions while user is typing (now with fuzzy matching)
    showSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        
        // Get fuzzy search suggestions
        const suggestionResults = this.fuzzyEngine.getSuggestions(this.data, query);

        if (suggestionResults.length === 0) {
            this.hideSuggestions();
            return;
        }

        // Create HTML for each suggestion item with relevance indicators
        const suggestionsHTML = suggestionResults.map((result, index) => {
            const { species, highlightedScientific, relevanceIndicator } = result;
            
            // Add relevance indicator styling
            const relevanceClass = `relevance-${relevanceIndicator}`;
            
            return `
                <div class="suggestion-item ${relevanceClass}" data-index="${index}" onclick="app.selectSuggestionByIndex(${index})">
                    <div class="suggestion-content">
                        <span class="suggestion-scientific">${highlightedScientific}</span>
                        <span class="suggestion-chinese">
                            ${species.chinese}${species.alternative ? ' • ' + species.alternative : ''}
                        </span>
                    </div>
                </div>
            `;
        }).join('');

        suggestions.innerHTML = suggestionsHTML;
        suggestions.style.display = 'block';
        this.currentSuggestionIndex = -1; // Reset selection
        
        // Store current matching species for selection
        this.currentMatches = suggestionResults.map(r => r.species);
    }

    // Hide the suggestions dropdown
    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
        this.currentSuggestionIndex = -1;
        this.currentMatches = [];
    }

    // Handle keyboard navigation in suggestion dropdown
    handleKeyNavigation(e) {
        const suggestions = document.getElementById('suggestions');
        const suggestionItems = suggestions.querySelectorAll('.suggestion-item');

        // Only handle keys if suggestions are visible
        if (suggestions.style.display === 'none' || suggestionItems.length === 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault(); // Prevent cursor from moving in input
                this.currentSuggestionIndex = Math.min(
                    this.currentSuggestionIndex + 1,
                    suggestionItems.length - 1
                );
                this.updateSuggestionHighlight(suggestionItems);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.currentSuggestionIndex = Math.max(
                    this.currentSuggestionIndex - 1,
                    -1
                );
                this.updateSuggestionHighlight(suggestionItems);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.currentSuggestionIndex >= 0 && this.currentMatches) {
                    const selectedSpecies = this.currentMatches[this.currentSuggestionIndex];
                    if (selectedSpecies) {
                        this.selectSuggestionBySpecies(selectedSpecies);
                    }
                }
                break;

            case 'Escape':
                this.hideSuggestions();
                document.getElementById('searchInput').blur(); // Remove focus from search box
                break;
        }
    }

    // Update which suggestion is highlighted during keyboard navigation
    updateSuggestionHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });
    }

    // Select suggestion by index (for onclick)
    selectSuggestionByIndex(index) {
        if (this.currentMatches && this.currentMatches[index]) {
            this.selectSuggestionBySpecies(this.currentMatches[index]);
        }
    }

    // Select suggestion by species object
    selectSuggestionBySpecies(species) {
        // Strip HTML tags for the search input
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };
        
        const plainScientificName = stripHtml(species.scientific);
        document.getElementById('searchInput').value = plainScientificName;
        this.hideSuggestions();
        this.handleSearch(plainScientificName);
    }

    // Functions to open and close the information modal
    openModal() {
        document.getElementById('infoModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        document.getElementById('infoModal').style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }

    // Generate POWO (Plants of the World Online) link for a species
    generatePowoLink(species) {
        // Remove HTML tags from scientific name
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const plainScientific = stripHtml(species.scientific);

        // Skip link for special cases
        if (this.shouldSkipExternalLink(plainScientific)) {
            return '';
        }

        // Process scientific name for URL
        let searchTerm = plainScientific;
        searchTerm = searchTerm.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp." suffix
        const encodedTerm = encodeURIComponent(searchTerm.trim());

        // Return HTML for POWO link
        return `
            <a href="https://powo.science.kew.org/results?q=${encodedTerm}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="powo-link"
               title="View in Plants of the World Online">
                🌿
            </a>
        `;
    }

    // Generate WFO (World Flora Online) link for a species
    generateWfoLink(species) {
        // Remove HTML tags from scientific name
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const plainScientific = stripHtml(species.scientific);

        // Skip link for special cases
        if (this.shouldSkipExternalLink(plainScientific)) {
            return '';
        }

        // Process scientific name for URL
        let searchTerm = plainScientific;
        searchTerm = searchTerm.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp." suffix
        const encodedTerm = encodeURIComponent(searchTerm.trim());

        // Return HTML for WFO link with icon
        return `
            <a href="https://worldfloraonline.org/search?query=${encodedTerm}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="wfo-link"
               title="View in World Flora Online">
                <img src="WFOIcon.png" alt="WFO" class="wfo-icon">
            </a>
        `;
    }

    // Determine if external database links should be skipped for a species
    shouldSkipExternalLink(scientificName) {
        const name = scientificName.toLowerCase().trim();

        // Skip for special non-species entries
        if (name === 'others' || name === 'unidentified') {
            return true;
        }

        // Skip for cultivars (marked with single quotes or 'cv')
        if (name.includes("'") || name.includes("cv")) {
            return true;
        }

        // Note: "var." (variety) is NOT a cultivar and should have links
        // Only skip if it also has cultivar markers

        // Skip if empty or just a dash
        if (name === '-' || name === '') {
            return true;
        }

        return false;
    }

    // Generate and display the main data table
    renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        const noResults = document.getElementById('noResults');

        // Show "no results" message if no data to display
        if (data.length === 0) {
            tableBody.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        // Show table and hide "no results" message
        tableBody.style.display = '';
        noResults.style.display = 'none';

        // Generate HTML for each species row
        const rows = data.map(species => {
            const hasImages = this.speciesImages[species.id];
            const clickableClass = hasImages ? 'scientific-name clickable' : 'scientific-name';
            const clickHandler = hasImages ? `onclick="app.openCarousel(${JSON.stringify(species).replace(/"/g, '&quot;')})"` : '';
            
            return `
                <tr>
                    <td>${species.id}</td>
                    <td class="${clickableClass}" data-species-id="${species.id}" ${clickHandler}>${species.scientific}</td>
                    <td class="chinese-name">${species.chinese}</td>
                    <td class="alternative-name">${species.alternative || ''}</td>
                    <td class="powo-column">${this.generatePowoLink(species)}</td>
                    <td class="wfo-column">${this.generateWfoLink(species)}</td>
                </tr>
            `;
        }).join('');

        // Insert all rows into table body
        tableBody.innerHTML = rows;
        
        console.log('Table rendered with', data.length, 'rows');
        console.log('First row scientific name:', data[0]?.scientific);
        console.log('Species with images:', Object.keys(this.speciesImages).length);
    }

    // Update the statistics display (total count and visible count)
    updateStats() {
        document.getElementById('totalCount').textContent = this.data.length;
        document.getElementById('visibleCount').textContent = this.filteredData.length;
    }



    // Carousel functionality
    carouselData = {
        images: [],
        currentIndex: 0,
        speciesName: ''
    };

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
        
        // Convert scientific name to folder name format
        const folderName = this.convertToFolderName(scientificName);
        console.log('Folder name:', folderName);
        
        // Check if images exist for this species
        this.loadSpeciesImages(folderName, scientificName);
    }

    // Convert scientific name to folder name format
    convertToFolderName(scientificName) {
        return scientificName.toLowerCase().replace(/\s+/g, '_');
    }

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
        
        // Show the modal
        document.getElementById('carouselModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Load first image and thumbnails
        this.loadCurrentImage();
        this.loadThumbnails();
        
        // Update license information from configuration
        this.updateLicenseInfo();
    }

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
            }
        }
    }

    // Get image URL - configurable for future CDN migration
    getImageUrl(folderName, imageName) {
        // Use configuration for easy CDN migration
        const baseUrl = CONFIG.images.baseUrl;
        return `${baseUrl}/${folderName}/${imageName}`;
    }

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
    }

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
    }

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
    }

    // Select a thumbnail
    selectThumbnail(index) {
        this.carouselData.currentIndex = index;
        this.loadCurrentImage();
    }

    // Update thumbnail selection
    updateThumbnailSelection() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.carouselData.currentIndex);
        });
    }

    // Update carousel navigation buttons (circular - no disabled state)
    updateCarouselButtons() {
        // For circular carousel, buttons are never disabled
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');
        
        if (prevButton) prevButton.disabled = false;
        if (nextButton) nextButton.disabled = false;
    }

    // Navigate to previous image (circular)
    previousImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
            this.loadCurrentImage();
        }
    }

    // Navigate to next image (circular)
    nextImage() {
        const { images, currentIndex } = this.carouselData;
        if (images.length > 0) {
            this.carouselData.currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            this.loadCurrentImage();
        }
    }

    // Close carousel modal
    closeCarouselModal() {
        document.getElementById('carouselModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.carouselData.images = [];
        this.carouselData.currentIndex = 0;
    }
}

// Global functions that can be called from HTML onclick attributes
function openModal() {
    app.openModal();
}

function closeModal() {
    app.closeModal();
}

// Carousel global functions
function closeCarouselModal() {
    app.closeCarouselModal();
}

function previousImage() {
    app.previousImage();
}

function nextImage() {
    app.nextImage();
}



// Start the application when page loads
const app = new TreeSpeciesDatabase();
