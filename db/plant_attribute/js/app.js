/**
 * Main Application
 * Initializes and coordinates all components for the Plant Attribute Database
 */

class PlantAttributeApp {
    constructor() {
        this.searchManager = null;
        this.modalManager = null;
        this.headerAnimation = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            // Initialize components
            this.initializeComponents();
            
            // Load data
            await this.loadData();
            
            this.isInitialized = true;
            console.log('Plant Attribute Database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize all application components
     */
    initializeComponents() {
        // Initialize search manager
        this.searchManager = new PlantAttributeSearchManager();
        
        // Initialize modal manager
        this.modalManager = new ModalManager();
        
        // Initialize header animation
        this.headerAnimation = new HeaderAnimation();
        this.headerAnimation.init();
    }

    /**
     * Load application data
     */
    async loadData() {
        if (this.searchManager) {
            await this.searchManager.loadDataFromJSON();
        }
    }

    /**
     * Handle initialization errors
     * @param {Error} error - The initialization error
     */
    handleInitializationError(error) {
        // Show user-friendly error message
        const tbody = document.getElementById('resultsTable');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center text-danger">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to initialize the application. Please refresh the page and try again.
                    </td>
                </tr>
            `;
        }

        // Log detailed error for debugging
        console.error('Initialization error details:', error);
    }

    /**
     * Get search manager instance
     * @returns {PlantAttributeSearchManager|null} Search manager instance
     */
    getSearchManager() {
        return this.searchManager;
    }

    /**
     * Get modal manager instance
     * @returns {ModalManager|null} Modal manager instance
     */
    getModalManager() {
        return this.modalManager;
    }

    /**
     * Get header animation instance
     * @returns {HeaderAnimation|null} Header animation instance
     */
    getHeaderAnimation() {
        return this.headerAnimation;
    }

    /**
     * Check if application is initialized
     * @returns {boolean} True if initialized
     */
    isAppInitialized() {
        return this.isInitialized;
    }

    /**
     * Destroy the application and clean up resources
     */
    destroy() {
        if (this.headerAnimation) {
            this.headerAnimation.destroy();
        }
        
        this.searchManager = null;
        this.modalManager = null;
        this.headerAnimation = null;
        this.isInitialized = false;
    }
}

// Global application instance
let app;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    app = new PlantAttributeApp();
    await app.init();
});

// Global function for search button (maintains compatibility with existing HTML)
function performFuzzySearch() {
    if (app && app.getSearchManager()) {
        app.getSearchManager().performFuzzySearch();
    } else {
        console.warn('Search manager not available');
    }
}

// Global function for clearing filters
function clearAllFilters() {
    if (app && app.getSearchManager()) {
        app.getSearchManager().clearAllFilters();
    } else {
        console.warn('Search manager not available');
    }
}

// Export for use in other modules
window.PlantAttributeApp = PlantAttributeApp;
