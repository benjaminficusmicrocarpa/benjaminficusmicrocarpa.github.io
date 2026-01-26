/**
 * Tree Database Core - Modern Architecture with Event Delegation
 * Phase 2: JavaScript Architecture Modernization
 * 
 * This file implements the modern core class with Generic2-inspired patterns:
 * - Auto-initialization system
 * - Centralized event delegation
 * - Data-attribute based interactions
 * - Preserved specialized functionality
 */

class TreeDatabaseApp {
    constructor() {
        // Core data properties
        this.data = []; // Array to store all tree species data
        this.filteredData = []; // Array to store filtered search results
        this.speciesImages = {}; // Store species image configuration
        
        // Search and suggestion properties
        this.currentSuggestionIndex = -1; // Track which suggestion is highlighted
        this.currentMatches = []; // Store current suggestion matches
        
        // Carousel properties
        this.carouselData = {
            images: [],
            currentIndex: 0,
            speciesName: '',
            speciesChineseName: ''
        };
        
        // Initialize fuzzy search engine
        this.fuzzyEngine = new FuzzySearchEngine({
            minSimilarity: 0.4, // Lower threshold for more forgiving search
            maxResults: 8,
            scientificWeight: 1.2, // Slightly favor scientific names
            chineseWeight: 1.0,
            alternativeWeight: 0.8
        });
        
        // Initialize statistics dashboard
        this.statsDashboard = new StatisticsDashboard();
        
        // Auto-initialize the application
        this.init();
    }

    /**
     * Auto-initialization system - Generic2 inspired
     */
    async init() {
        try {
            // Set up event delegation first
            this.setupEventDelegation();
            
            // Load data and configuration
            await this.loadData();
            await this.loadImageConfiguration();
            
            // Initialize components
            this.initializeComponents();
            
            // Initial render
            this.renderTable(this.data);
            this.updateStats();
            
            console.log('Tree Database App initialized successfully');
        } catch (error) {
            console.error('Error initializing Tree Database App:', error);
        }
    }

    /**
     * Centralized event delegation system
     * Generic2-inspired approach for handling all interactions
     */
    setupEventDelegation() {
        // Click events - handle all click interactions
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Input events - handle search and form inputs
        document.addEventListener('input', this.handleInput.bind(this));
        
        // Keyboard events - handle navigation and shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Focus/blur events - handle search suggestions
        document.addEventListener('focus', this.handleFocus.bind(this), true);
        document.addEventListener('blur', this.handleBlur.bind(this), true);
        
        // Mouse events - handle tooltips and hover effects
        document.addEventListener('mouseover', this.handleMouseover.bind(this));
        document.addEventListener('mouseleave', this.handleMouseleave.bind(this));
        
        console.log('Event delegation system initialized');
    }

    /**
     * Centralized click event handler
     */
    handleClick(e) {
        // Modal triggers
        if (e.target.matches('[data-modal-trigger]')) {
            const modalId = e.target.dataset.modalTrigger;
            this.openModal(modalId);
            return;
        }
        
        // Modal close buttons
        if (e.target.matches('[data-modal-close]')) {
            const modalId = e.target.dataset.modalClose;
            if (modalId === 'carouselModal') {
                this.closeCarouselModal();
            } else {
                this.closeModal(modalId);
            }
            return;
        }
        
        // Carousel triggers (species names with photos)
        if (e.target.matches('[data-carousel-trigger]')) {
            const speciesId = e.target.dataset.speciesId;
            this.openCarousel(speciesId);
            return;
        }
        
        // Carousel navigation
        if (e.target.matches('[data-carousel-prev]')) {
            this.previousImage();
            return;
        }
        
        if (e.target.matches('[data-carousel-next]')) {
            this.nextImage();
            return;
        }
        
        // Carousel thumbnail selection
        if (e.target.matches('[data-carousel-thumbnail]')) {
            const index = parseInt(e.target.dataset.carouselThumbnail);
            this.selectThumbnail(index);
            return;
        }
        
        // Suggestion selection
        if (e.target.matches('[data-suggestion-item]')) {
            const index = parseInt(e.target.dataset.suggestionItem);
            this.selectSuggestionByIndex(index);
            return;
        }
        
        // Close modals when clicking outside
        if (e.target.matches('.modal') || e.target.matches('.species-carousel-modal')) {
            if (e.target.id === 'infoModal') {
                this.closeModal('infoModal');
            } else if (e.target.id === 'carouselModal') {
                this.closeCarouselModal();
            }
            return;
        }
    }

    /**
     * Centralized input event handler
     */
    handleInput(e) {
        // Search input
        if (e.target.matches('[data-search-input]')) {
            this.handleSearch(e.target.value);
            return;
        }
        
        // Photos only toggle
        if (e.target.matches('[data-photos-toggle]')) {
            this.handlePhotosOnlyToggle(e.target.checked);
            return;
        }
    }

    /**
     * Centralized keyboard event handler
     */
    handleKeydown(e) {
        // Escape key - close modals
        if (e.key === 'Escape') {
            this.closeModal('infoModal');
            this.closeCarouselModal();
            return;
        }
        
        // Search input keyboard navigation
        if (e.target.matches('[data-search-input]')) {
            this.handleKeyNavigation(e);
            return;
        }
        
        // Carousel keyboard navigation
        const carouselModal = document.getElementById('carouselModal');
        if (carouselModal && carouselModal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextImage();
            }
        }
    }

    /**
     * Focus event handler for search suggestions
     */
    handleFocus(e) {
        if (e.target.matches('[data-search-input]')) {
            if (e.target.value.trim()) {
                this.showSuggestions(e.target.value);
            }
        }
    }

    /**
     * Blur event handler for search suggestions
     */
    handleBlur(e) {
        if (e.target.matches('[data-search-input]')) {
            // Small delay to allow clicking on suggestions
            setTimeout(() => {
                const suggestions = document.getElementById('suggestions');
                if (suggestions) {
                    suggestions.style.display = 'none';
                }
            }, 200);
        }
    }

    /**
     * Mouseover event handler for tooltips
     */
    handleMouseover(e) {
        if (e.target.matches('.tooltip-header')) {
            const tooltip = e.target.querySelector('.tooltip');
            if (tooltip) {
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            }
        }
    }

    /**
     * Mouseleave event handler
     */
    handleMouseleave(e) {
        // Handle any mouse leave events if needed
    }

    /**
     * Initialize components after data loading
     */
    initializeComponents() {
        // Any additional component initialization can go here
        console.log('Components initialized');
    }

    /**
     * Load tree species data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch('tree-database-with-ids.json');
            const jsonData = await response.json();
            this.data = jsonData.species;
            this.filteredData = [...this.data];
            console.log('Loaded', this.data.length, 'species');
        } catch (error) {
            console.error('Error loading tree data:', error);
        }
    }

    /**
     * Load species image configuration from JSON file
     */
    async loadImageConfiguration() {
        try {
            const response = await fetch('species_images.json');
            const imageConfig = await response.json();
            
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

    /**
     * Modern modal system with data attributes
     */
    openModal(modalId) {
        const modal = document.querySelector(`[data-modal="${modalId}"]`);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.querySelector(`[data-modal="${modalId}"]`);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Update statistics display using specialized dashboard
     */
    updateStats() {
        this.statsDashboard.updateStats(this.data, this.filteredData, this.speciesImages);
    }
}

// Export for use in other files
window.TreeDatabaseApp = TreeDatabaseApp;
