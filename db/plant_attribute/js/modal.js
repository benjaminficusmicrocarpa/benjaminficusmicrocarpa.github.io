/**
 * Modal Manager
 * Handles modal functionality for plant attribute details
 */

class ModalManager {
    constructor() {
        this.modal = null;
        this.bootstrapModal = null;
        this.initializeModal();
    }

    /**
     * Initialize modal functionality
     */
    initializeModal() {
        // Get modal element
        this.modal = document.getElementById('detailModal');
        
        if (!this.modal) {
            console.warn('Modal element not found');
            return;
        }

        // Initialize Bootstrap modal instance
        this.bootstrapModal = new bootstrap.Modal(this.modal, {
            backdrop: true,
            keyboard: true,
            focus: true
        });

        // Add event listener for modal show
        this.modal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const plantData = button ? button.getAttribute('data-plant') : null;
            
            if (plantData) {
                try {
                    const plant = JSON.parse(plantData);
                    this.populateModal(plant);
                } catch (error) {
                    console.error('Error parsing plant data:', error);
                    this.showError('Error loading plant details');
                }
            }
        });

        // Add event listener for modal shown
        this.modal.addEventListener('shown.bs.modal', (event) => {
            // Ensure body scroll is locked
            document.body.classList.add('modal-open');
        });

        // Add event listener for modal hide
        this.modal.addEventListener('hide.bs.modal', (event) => {
            // Clean up any temporary data
            this.resetModal();
        });

        // Add event listener for modal hidden - CRITICAL for fixing the bug
        this.modal.addEventListener('hidden.bs.modal', (event) => {
            // Force cleanup of modal backdrop and body classes
            this.cleanupModal();
        });

        // Add event listener for table row clicks
        document.addEventListener('click', (event) => {
            const row = event.target.closest('tr[data-plant]');
            if (row) {
                const plantData = row.getAttribute('data-plant');
                if (plantData) {
                    try {
                        const plant = JSON.parse(plantData);
                        this.populateModal(plant);
                        // Show modal using Bootstrap
                        this.bootstrapModal.show();
                    } catch (error) {
                        console.error('Error parsing plant data:', error);
                        this.showError('Error loading plant details');
                    }
                }
            }
        });

        // Add event listener for escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.bootstrapModal && this.modal.classList.contains('show')) {
                this.bootstrapModal.hide();
            }
        });
    }

    /**
     * Clean up modal state after closing
     */
    cleanupModal() {
        // Remove modal-open class from body
        document.body.classList.remove('modal-open');
        
        // Remove any remaining backdrop elements
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => {
            backdrop.remove();
        });
        
        // Remove any remaining modal-open classes
        document.body.classList.remove('modal-open');
        
        // Reset body padding if it was modified
        document.body.style.paddingRight = '';
        
        // Ensure body can scroll again
        document.body.style.overflow = '';
        
        // Force a reflow to ensure changes take effect
        document.body.offsetHeight;
        
        console.log('Modal cleanup completed');
    }

    /**
     * Populate modal with plant data
     * @param {Object} plant - Plant data object
     */
    populateModal(plant) {
        // Update modal title
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = plant.plant_name;
        }

        // Update basic information
        this.updateDetail('modalPlantName', plant.plant_name);
        this.updateDetail('modalFamily', plant.family);
        this.updateDetail('modalBook', `Book ${plant.book}, Page ${plant.page_start}${plant.page_end ? '-' + plant.page_end : ''}`);
        this.updateDetail('modalFlowering', plant.flowering_months || 'Not specified');
        this.updateDetail('modalFruiting', plant.fruiting_months || 'Not specified');

        // Update attributes grid
        this.updateAttributesGrid(plant);
    }

    /**
     * Update a detail field in the modal
     * @param {string} elementId - ID of the element to update
     * @param {string} value - Value to set
     */
    updateDetail(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    /**
     * Update the attributes grid in the modal
     * @param {Object} plant - Plant data object
     */
    updateAttributesGrid(plant) {
        const attributesGrid = document.getElementById('modalAttributes');
        if (!attributesGrid) return;

        // Clear existing content
        attributesGrid.innerHTML = '';

        // Define attribute categories
        const categories = {
            'Growth Form': {
                'is_tree': '🌳 Tree',
                'is_shrub': '🌴 Shrub',
                'is_herb': '🌿 Herb',
                'is_climber': '🌱 Climber',
                'is_creeping': '🌾 Creeping',
                'is_water_plant': '🌊 Water Plant',
                'is_succulent': '🌵 Succulent',
                'is_parasitic': '🪱 Parasitic',
                'is_insectivorous': '🦟 Insectivorous'
            },
            'Light Requirements': {
                'requires_full_sun': '☀️ Full Sun',
                'requires_semi_shade': '🌤️ Semi Shade',
                'requires_shade': '🌥️ Shade'
            },
            'Water Requirements': {
                'requires_moist_soil': '💧 Moist Soil',
                'requires_lots_of_water': '🌧️ Lots of Water',
                'is_drought_tolerant': '🏜️ Drought Tolerant',
                'is_drought_sensitive': '💦 Drought Sensitive',
                'has_moist_phobia': '🚫 Moisture Phobic'
            },
            'Temperature Tolerance': {
                'heat_cold': '❄️ Cold Tolerant',
                'heat_warm': '🌡️ Warm Climate',
                'heat_hot': '🔥 Hot Climate',
                'is_thermo_sensitive': '🌡️ Temperature Sensitive',
                'has_cold_phobia': '❄️ Cold Sensitive'
            },
            'Soil Conditions': {
                'is_salt_tolerant': '🧂 Salt Tolerant',
                'is_barren_tolerant': '🏜️ Barren Soil Tolerant',
                'is_antipollution': '🌬️ Pollution Resistant'
            },
            'Environmental Tolerance': {
                'is_wind_tolerant': '💨 Wind Tolerant',
                'is_wind_sensitive': '🌪️ Wind Sensitive'
            },
            'Toxicity': {
                'is_toxic': '🟠 Toxic',
                'is_lightly_toxic': '🟡 Lightly Toxic',
                'is_heavily_toxic': '🔴 Heavily Toxic'
            },
            'Root Characteristics': {
                'has_bulbous_root': '🧅 Bulbous Root',
                'is_rhizomatous': '🌱 Rhizomatous'
            },
            'Lifecycle': {
                'is_perennial': '🌱 Perennial',
                'is_deciduous': '🍂 Deciduous',
                'dormancy_period': '😴 Dormant Period'
            },
            'Habitat': {
                'tropical_rainforest_habitat': '🌴 Tropical Rainforest'
            }
        };

        // Create attribute cards for each category
        Object.keys(categories).forEach(categoryName => {
            const categoryAttributes = categories[categoryName];
            const activeAttributes = [];

            // Find active attributes in this category
            Object.keys(categoryAttributes).forEach(attributeKey => {
                if (plant[attributeKey] && plant[attributeKey] !== '' && plant[attributeKey] !== null) {
                    activeAttributes.push({
                        key: attributeKey,
                        display: categoryAttributes[attributeKey]
                    });
                }
            });

            // Only create card if there are active attributes
            if (activeAttributes.length > 0) {
                const card = this.createAttributeCard(categoryName, activeAttributes);
                attributesGrid.appendChild(card);
            }
        });

        // If no attributes found, show message
        if (attributesGrid.children.length === 0) {
            attributesGrid.innerHTML = `
                <div class="col-12">
                    <div class="attribute-card">
                        <div class="attribute-card-title">No Attributes Found</div>
                        <div class="attribute-card-items">
                            <span class="attribute-card-item">No specific attributes recorded for this plant</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Create an attribute card for a category
     * @param {string} categoryName - Name of the category
     * @param {Array} attributes - Array of active attributes
     * @returns {HTMLElement} The created card element
     */
    createAttributeCard(categoryName, attributes) {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        
        card.innerHTML = `
            <div class="attribute-card">
                <div class="attribute-card-title">${categoryName}</div>
                <div class="attribute-card-items">
                    ${attributes.map(attr => `
                        <span class="attribute-card-item">${attr.display}</span>
                    `).join('')}
                </div>
            </div>
        `;
        
        return card;
    }

    /**
     * Show error message in modal
     * @param {string} message - Error message to display
     */
    showError(message) {
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = 'Error';
        }

        const modalBody = this.modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${message}
                </div>
            `;
        }
    }

    /**
     * Reset modal to default state
     */
    resetModal() {
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = 'Plant Attribute Details';
        }

        // Reset all detail fields
        this.updateDetail('modalPlantName', '');
        this.updateDetail('modalFamily', '');
        this.updateDetail('modalBook', '');
        this.updateDetail('modalFlowering', '');
        this.updateDetail('modalFruiting', '');

        // Clear attributes grid
        const attributesGrid = document.getElementById('modalAttributes');
        if (attributesGrid) {
            attributesGrid.innerHTML = '';
        }
    }

    /**
     * Show modal with plant data
     * @param {Object} plant - Plant data object
     */
    showModal(plant) {
        if (this.bootstrapModal) {
            this.populateModal(plant);
            this.bootstrapModal.show();
        }
    }

    /**
     * Hide modal
     */
    hideModal() {
        if (this.bootstrapModal) {
            this.bootstrapModal.hide();
        }
    }

    /**
     * Dispose of modal instance
     */
    dispose() {
        if (this.bootstrapModal) {
            this.bootstrapModal.dispose();
            this.bootstrapModal = null;
        }
        
        // Clean up any remaining modal state
        this.cleanupModal();
    }

    /**
     * Force cleanup of modal state (emergency cleanup)
     */
    forceCleanup() {
        // Remove all modal-related classes and elements
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        
        // Remove all backdrop elements
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Remove modal show class
        if (this.modal) {
            this.modal.classList.remove('show');
            this.modal.style.display = 'none';
            this.modal.setAttribute('aria-hidden', 'true');
            this.modal.removeAttribute('aria-modal');
        }
        
        // Force reflow
        document.body.offsetHeight;
        
        console.log('Force cleanup completed');
    }
}

// Global modal manager instance
let modalManager;

// Initialize modal manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    modalManager = new ModalManager();
    
    // Make modal manager globally accessible for debugging
    window.modalManager = modalManager;
});

// Global emergency cleanup function
window.fixModalBug = function() {
    if (modalManager) {
        modalManager.forceCleanup();
        console.log('Modal bug fixed - website should be responsive again');
    } else {
        // Fallback cleanup if modal manager is not available
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
        
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        });
        
        console.log('Emergency modal cleanup completed');
    }
};

// Export for use in other modules
window.ModalManager = ModalManager;
