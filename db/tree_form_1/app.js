class TreeSpeciesDatabase {
    constructor() {
        this.data = []; // Array to store all tree species data
        this.filteredData = []; // Array to store filtered search results
        this.currentSuggestionIndex = -1; // Track which suggestion is highlighted
        this.init(); // Start the application
    }

    // Initialize the application by loading data and setting up functionality
    async init() {
        await this.loadData(); // Load tree species data from JSON file
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
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
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
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery === '') {
            // If search is empty, show all species
            this.filteredData = [...this.data];
            this.hideSuggestions();
        } else {
            // Filter species based on search query
            this.filteredData = this.data.filter(species => 
                this.matchesQuery(species, trimmedQuery)
            );
            this.showSuggestions(trimmedQuery);
        }

        // Update the table and statistics
        this.renderTable(this.filteredData);
        this.updateStats();
    }

    // Check if a species matches the search query
    matchesQuery(species, query) {
        // Function to remove HTML tags from text for searching
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        // Combine all searchable text into one string
        const searchableText = [
            stripHtml(species.scientific), // Scientific name without HTML
            species.chinese, // Chinese name
            species.alternative // Alternative Chinese name
        ].join(' ').toLowerCase();

        // Check if the query appears anywhere in the searchable text
        return searchableText.includes(query);
    }

    // Show dropdown suggestions while user is typing
    showSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        const matchingSpecies = this.data
            .filter(species => this.matchesQuery(species, query))
            .slice(0, 8); // Show only first 8 matches to keep dropdown manageable

        if (matchingSpecies.length === 0) {
            this.hideSuggestions();
            return;
        }

        // Create HTML for each suggestion item
        const suggestionsHTML = matchingSpecies.map((species, index) => {
            // Keep the HTML formatting for display but create safe onclick
            const highlightedScientific = this.highlightMatch(species.scientific, query);
            
            // Create a safe identifier for onclick - store index instead of name
            return `
                <div class="suggestion-item" data-index="${index}" data-species-id="${species.id}" onclick="app.selectSuggestionByIndex(${index}, ${matchingSpecies.findIndex(s => s.id === species.id)})">
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
        this.currentMatches = matchingSpecies;
    }

    // Hide the suggestions dropdown
    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
        this.currentSuggestionIndex = -1;
        this.currentMatches = [];
    }

    // Highlight matching text in suggestions (simplified version)
    highlightMatch(scientificHtml, query) {
        if (!query) return scientificHtml;

        // First, let's work with the HTML as is and try to highlight within it
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = scientificHtml;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Check if query matches
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        if (!regex.test(textContent)) {
            return scientificHtml;
        }

        // Simple approach: if it's italicized, highlight within the italic tags
        if (scientificHtml.includes('<i>') && scientificHtml.includes('</i>')) {
            return scientificHtml.replace(
                /(<i>)(.*?)(<\/i>)/gi,
                (match, openTag, content, closeTag) => {
                    const highlightedContent = content.replace(regex, '<strong>$1</strong>');
                    return openTag + highlightedContent + closeTag;
                }
            );
        } else {
            // No italic tags, just highlight normally
            return scientificHtml.replace(regex, '<strong>$1</strong>');
        }
    }

    // Escape special regex characters
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    selectSuggestionByIndex(displayIndex, dataIndex) {
        if (this.currentMatches && this.currentMatches[displayIndex]) {
            this.selectSuggestionBySpecies(this.currentMatches[displayIndex]);
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

    // When user selects a suggestion, fill search box and search (legacy method)
    selectSuggestion(scientificNameHtml) {
        // Strip HTML tags for the search input
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };
        
        const plainScientificName = stripHtml(scientificNameHtml);
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
        const rows = data.map(species => `
            <tr>
                <td>${species.id}</td>
                <td class="scientific-name">${species.scientific}</td>
                <td class="chinese-name">${species.chinese}</td>
                <td class="alternative-name">${species.alternative || ''}</td>
                <td class="powo-column">${this.generatePowoLink(species)}</td>
                <td class="wfo-column">${this.generateWfoLink(species)}</td>
            </tr>
        `).join('');

        // Insert all rows into table body
        tableBody.innerHTML = rows;
    }

    // Update the statistics display (total count and visible count)
    updateStats() {
        document.getElementById('totalCount').textContent = this.data.length;
        document.getElementById('visibleCount').textContent = this.filteredData.length;
    }
}

// Global functions that can be called from HTML onclick attributes
function openModal() {
    app.openModal();
}

function closeModal() {
    app.closeModal();
}

// Start the application when page loads
const app = new TreeSpeciesDatabase();
