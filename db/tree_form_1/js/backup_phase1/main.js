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
            const response = await fetch('tree-database-with-ids.json');
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
        const photosOnlyToggle = document.getElementById('photosOnlyToggle');

        // Check if elements exist before adding event listeners
        if (!searchInput) {
            console.error('Search input element not found');
            return;
        }

        if (!suggestions) {
            console.error('Suggestions element not found');
            return;
        }

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
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
            }, 200); // Small delay to allow clicking on suggestions
        });

        // Show suggestions again when user clicks back in search box
        searchInput.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.showSuggestions(e.target.value);
            }
        });

        // Handle photos only toggle (if it exists)
        if (photosOnlyToggle) {
            photosOnlyToggle.addEventListener('change', (e) => {
                this.handlePhotosOnlyToggle(e.target.checked);
            });
        } else {
            console.warn('Photos only toggle not found - feature disabled');
        }

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

    // Handle photos only toggle
    handlePhotosOnlyToggle(showPhotosOnly) {
        if (showPhotosOnly) {
            // Filter to show only species with photos
            this.filteredData = this.data.filter(species => this.speciesImages[species.id]);
        } else {
            // Show all species
            this.filteredData = [...this.data];
        }
        
        // Re-apply current search if any
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            this.handleSearch(searchInput.value);
        } else {
            this.renderTable(this.filteredData);
            this.updateStats();
        }
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
            const clickHandler = hasImages ? `onclick="if(window.app) app.openCarousel(${JSON.stringify(species).replace(/"/g, '&quot;')})"` : '';
            
            return `
                <tr>
                    <td>${species.id}</td>
                    <td class="${clickableClass}" data-species-id="${species.id}" ${clickHandler}>${species.scientific}</td>
                    <td class="chinese-name">${species.chinese}</td>
                    <td class="alternative-name">${species.alternative || ''}</td>
                    <td class="latin29-id">${species.latin29_id || ''}</td>
                    <td class="gbif-column">${this.generateGbifLink(species)}</td>
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

    // Update the statistics display (total count, visible count, and species with photos count)
    updateStats() {
        const totalCount = this.data.length;
        const visibleCount = this.filteredData.length;
        const speciesWithPhotosCount = this.data.filter(species => this.speciesImages[species.id]).length;
        
        const totalCountElement = document.getElementById('totalCount');
        const visibleCountElement = document.getElementById('visibleCount');
        const speciesWithPhotosCountElement = document.getElementById('speciesWithPhotosCount');
        
        if (totalCountElement) {
            totalCountElement.textContent = totalCount;
        }
        if (visibleCountElement) {
            visibleCountElement.textContent = visibleCount;
        }
        if (speciesWithPhotosCountElement) {
            speciesWithPhotosCountElement.textContent = speciesWithPhotosCount;
        }
    }

    // Functions to open and close the information modal
    openModal() {
        const modal = document.getElementById('infoModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        const modal = document.getElementById('infoModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }
}

// Start the application when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TreeSpeciesDatabase();
    window.app = app; // Make app globally accessible
});
