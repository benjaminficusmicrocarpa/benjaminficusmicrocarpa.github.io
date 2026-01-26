// Extend TreeSpeciesDatabase with search functionality
Object.assign(TreeSpeciesDatabase.prototype, {
    
    // Handle search functionality when user types
    handleSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery === '') {
            // If search is empty, show all species (respecting photos only toggle)
            const photosOnlyToggle = document.getElementById('photosOnlyToggle');
            if (photosOnlyToggle && photosOnlyToggle.checked) {
                this.filteredData = this.data.filter(species => this.speciesImages[species.id]);
            } else {
                this.filteredData = [...this.data];
            }
            this.hideSuggestions();
        } else {
            // Use fuzzy search for filtering
            this.filteredData = this.fuzzyEngine.search(this.data, trimmedQuery);
            this.showSuggestions(trimmedQuery);
        }

        // Update the table and statistics
        this.renderTable(this.filteredData);
        this.updateStats();
    },

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
                <div class="suggestion-item ${relevanceClass}" data-index="${index}" onclick="if(window.app) app.selectSuggestionByIndex(${index})">
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

    // Hide the suggestions dropdown
    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
        this.currentSuggestionIndex = -1;
        this.currentMatches = [];
    },

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
    },

    // Update which suggestion is highlighted during keyboard navigation
    updateSuggestionHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });
    },

    // Select suggestion by index (for onclick)
    selectSuggestionByIndex(index) {
        if (this.currentMatches && this.currentMatches[index]) {
            this.selectSuggestionBySpecies(this.currentMatches[index]);
        }
    },

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
});
