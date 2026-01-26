/**
 * Tree Database Search - Specialized Component
 * Phase 3: Specialized Features Isolation
 * 
 * This file contains the advanced fuzzy search functionality specifically
 * optimized for botanical species data with specialized algorithms for
 * scientific names, Chinese names, and alternative names.
 * 
 * SPECIALIZED FEATURES:
 * - Advanced fuzzy search algorithm optimized for botanical nomenclature
 * - Multi-language support (scientific, Chinese, alternative names)
 * - Relevance scoring with visual indicators
 * - Real-time suggestions with keyboard navigation
 * - Species-specific search patterns and normalization
 */

// Extend TreeDatabaseApp with search functionality
Object.assign(TreeDatabaseApp.prototype, {
    
    /**
     * Handle search functionality when user types
     * PRESERVED: Advanced fuzzy search algorithm
     */
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            // If search is empty, show all species (respecting photos only toggle)
            const photosOnlyToggle = document.querySelector('[data-photos-toggle]');
            if (photosOnlyToggle && photosOnlyToggle.checked) {
                this.filteredData = this.data.filter(species => this.speciesImages[species.id]);
            } else {
                this.filteredData = [...this.data];
            }
            this.hideSuggestions();
        } else {
            // Use fuzzy search for filtering - PRESERVED EXACT ALGORITHM
            this.filteredData = this.fuzzyEngine.search(this.data, trimmedQuery);
            this.showSuggestions(trimmedQuery);
        }

        // Update the table and statistics
        this.renderTable(this.filteredData);
        this.updateStats();
    },

    /**
     * Show dropdown suggestions while user is typing
     * PRESERVED: Advanced fuzzy matching with relevance indicators
     */
    showSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        
        // Get fuzzy search suggestions - PRESERVED EXACT ALGORITHM
        const suggestionResults = this.fuzzyEngine.getSuggestions(this.data, query);

        if (suggestionResults.length === 0) {
            this.hideSuggestions();
            return;
        }

        // Create HTML for each suggestion item with relevance indicators
        // MODERNIZED: Using data attributes instead of onclick
        const suggestionsHTML = suggestionResults.map((result, index) => {
            const { species, highlightedScientific, relevanceIndicator } = result;
            
            // Add relevance indicator styling
            const relevanceClass = `relevance-${relevanceIndicator}`;
            
            return `
                <div class="suggestion-item ${relevanceClass}" 
                     data-suggestion-item="${index}">
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
    },

    /**
     * Hide the suggestions dropdown
     */
    hideSuggestions() {
        const suggestions = document.getElementById('suggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
        this.currentSuggestionIndex = -1;
        this.currentMatches = [];
    },

    /**
     * Handle keyboard navigation in suggestion dropdown
     * PRESERVED: Complete keyboard navigation functionality
     */
    handleKeyNavigation(e) {
        const suggestions = document.getElementById('suggestions');
        const suggestionItems = suggestions ? suggestions.querySelectorAll('.suggestion-item') : [];

        // Only handle keys if suggestions are visible
        if (!suggestions || suggestions.style.display === 'none' || suggestionItems.length === 0) {
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
                const searchInput = document.querySelector('[data-search-input]');
                if (searchInput) {
                    searchInput.blur(); // Remove focus from search box
                }
                break;
        }
    },

    /**
     * Update which suggestion is highlighted during keyboard navigation
     */
    updateSuggestionHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });
    },

    /**
     * Select suggestion by index (for data-attribute clicks)
     * MODERNIZED: Now called from event delegation
     */
    selectSuggestionByIndex(index) {
        if (this.currentMatches && this.currentMatches[index]) {
            this.selectSuggestionBySpecies(this.currentMatches[index]);
        }
    },

    /**
     * Select suggestion by species object
     * PRESERVED: Complete selection functionality
     */
    selectSuggestionBySpecies(species) {
        // Strip HTML tags for the search input
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };
        
        const plainScientificName = stripHtml(species.scientific);
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput) {
            searchInput.value = plainScientificName;
        }
        this.hideSuggestions();
        this.handleSearch(plainScientificName);
    },

    /**
     * Handle photos only toggle
     * MODERNIZED: Now uses data attributes and specialized statistics
     */
    handlePhotosOnlyToggle(showPhotosOnly) {
        if (showPhotosOnly) {
            // Filter to show only species with photos
            this.filteredData = this.data.filter(species => this.speciesImages[species.id]);
        } else {
            // Show all species
            this.filteredData = [...this.data];
        }
        
        // Update statistics dashboard with photos filter state
        this.statsDashboard.updatePhotosFilter(showPhotosOnly, this.filteredData, this.speciesImages);
        
        // Re-apply current search if any
        const searchInput = document.querySelector('[data-search-input]');
        if (searchInput && searchInput.value.trim()) {
            this.handleSearch(searchInput.value);
        } else {
            this.renderTable(this.filteredData);
            this.updateStats();
        }
    }
});
