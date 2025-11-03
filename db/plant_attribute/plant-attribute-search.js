/**
 * Plant Attribute Search Engine
 * Modular search functionality for the Plant Attribute Database
 */

/**
 * Fuzzy Search Engine for Plant Attribute Database
 * Provides intelligent matching with typo tolerance and flexible search
 */
class FuzzySearchEngine {
    constructor(options = {}) {
        this.options = {
            // Fuzzy matching thresholds (0-1, where 1 is exact match)
            minSimilarity: options.minSimilarity || 0.6,
            exactMatchBonus: options.exactMatchBonus || 0.3,
            prefixBonus: options.prefixBonus || 0.2,
            
            // Field weights for scoring
            plantNameWeight: options.plantNameWeight || 1.0,
            familyWeight: options.familyWeight || 0.8,
            attributeWeight: options.attributeWeight || 0.6,
            
            // Search behavior
            maxResults: options.maxResults || 10000, // Increased to handle full database
            enablePhonetic: options.enablePhonetic || true,
            caseSensitive: options.caseSensitive || false
        };
    }

    /**
     * Calculate Levenshtein distance between two strings
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        // Initialize matrix
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        // Fill matrix
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,     // deletion
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }

        return matrix[len1][len2];
    }

    /**
     * Calculate similarity score between two strings (0-1)
     */
    calculateSimilarity(str1, str2) {
        if (!str1 || !str2) return 0;
        
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Normalize string for comparison
     */
    normalizeString(str) {
        if (!str) return '';
        
        let normalized = str.toLowerCase().trim();
        
        // Remove HTML tags
        normalized = normalized.replace(/<[^>]*>/g, '');
        
        // Remove extra whitespace
        normalized = normalized.replace(/\s+/g, ' ');
        
        // Remove common punctuation that might interfere
        normalized = normalized.replace(/[.,;:()\[\]]/g, ' ');
        
        return normalized.trim();
    }

    /**
     * Tokenize string into meaningful parts
     */
    tokenize(str) {
        const normalized = this.normalizeString(str);
        return normalized.split(/\s+/).filter(token => token.length > 0);
    }

    /**
     * Calculate word-level fuzzy similarity
     * Compares query against individual words in the target string
     */
    calculateWordLevelSimilarity(targetString, query) {
        const targetTokens = this.tokenize(targetString);
        const queryTokens = this.tokenize(query);
        
        if (targetTokens.length === 0 || queryTokens.length === 0) return 0;
        
        let maxWordSimilarity = 0;
        
        // For each query token, find the best matching word in the target
        queryTokens.forEach(queryToken => {
            targetTokens.forEach(targetToken => {
                const similarity = this.calculateSimilarity(targetToken, queryToken);
                maxWordSimilarity = Math.max(maxWordSimilarity, similarity);
            });
        });
        
        return maxWordSimilarity;
    }

    /**
     * Calculate comprehensive fuzzy score for a plant
     */
    calculateFuzzyScore(plant, query) {
        const queryNorm = this.normalizeString(query);
        const queryTokens = this.tokenize(query);
        
        if (queryTokens.length === 0) return 0;
        
        // Extract and normalize plant data
        const plantNameNorm = this.normalizeString(plant.plant_name);
        const familyNorm = this.normalizeString(plant.family);
        
        // Get all attribute values as a searchable string
        const attributesString = this.getAttributesAsString(plant);
        const attributesNorm = this.normalizeString(attributesString);
        
        // Calculate different types of matches
        const scores = {
            // Exact substring matches (highest priority)
            plantNameExact: plantNameNorm.includes(queryNorm) ? 1.0 : 0,
            familyExact: familyNorm.includes(queryNorm) ? 1.0 : 0,
            attributesExact: attributesNorm.includes(queryNorm) ? 1.0 : 0,
            
            // Prefix matches (high priority)
            plantNamePrefix: plantNameNorm.startsWith(queryNorm) ? 1.0 : 0,
            familyPrefix: familyNorm.startsWith(queryNorm) ? 1.0 : 0,
            attributesPrefix: attributesNorm.startsWith(queryNorm) ? 1.0 : 0,
            
            // Fuzzy string similarity (full string)
            plantNameFuzzy: this.calculateSimilarity(plantNameNorm, queryNorm),
            familyFuzzy: this.calculateSimilarity(familyNorm, queryNorm),
            attributesFuzzy: this.calculateSimilarity(attributesNorm, queryNorm),
            
            // Word-level fuzzy similarity (matches individual words)
            plantNameWordFuzzy: this.calculateWordLevelSimilarity(plantNameNorm, queryNorm),
            familyWordFuzzy: this.calculateWordLevelSimilarity(familyNorm, queryNorm),
            attributesWordFuzzy: this.calculateWordLevelSimilarity(attributesNorm, queryNorm)
        };
        
        // Calculate weighted final score
        // Use the maximum of full string similarity and word-level similarity
        const plantNameScore = Math.max(
            scores.plantNameExact + this.options.exactMatchBonus,
            scores.plantNamePrefix + this.options.prefixBonus,
            scores.plantNameFuzzy,
            scores.plantNameWordFuzzy // Add word-level matching
        );
        
        const familyScore = Math.max(
            scores.familyExact + this.options.exactMatchBonus,
            scores.familyPrefix + this.options.prefixBonus,
            scores.familyFuzzy,
            scores.familyWordFuzzy // Add word-level matching
        );
        
        const attributesScore = Math.max(
            scores.attributesExact + this.options.exactMatchBonus,
            scores.attributesPrefix + this.options.prefixBonus,
            scores.attributesFuzzy,
            scores.attributesWordFuzzy // Add word-level matching
        );
        
        const finalScore = (
            plantNameScore * this.options.plantNameWeight +
            familyScore * this.options.familyWeight +
            attributesScore * this.options.attributeWeight
        ) / (this.options.plantNameWeight + this.options.familyWeight + this.options.attributeWeight);
        
        return Math.min(finalScore, 1.0); // Cap at 1.0
    }

    /**
     * Get all attributes as a searchable string
     */
    getAttributesAsString(plant) {
        const attributes = [];
        
        // Add all attribute keys that have values (emojis)
        Object.keys(plant).forEach(key => {
            if (plant[key] && typeof plant[key] === 'string' && plant[key].length > 0 && key !== 'plant_name' && key !== 'family' && key !== 'book' && key !== 'page_start' && key !== 'page_end' && key !== 'flowering_months' && key !== 'fruiting_months') {
                attributes.push(key);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Perform fuzzy search on plant data
     */
    search(plants, query) {
        if (!query || query.trim().length === 0) {
            return plants; // Return all plants when no search query
        }
        
        // Calculate scores for all plants
        const scoredResults = plants.map(plant => ({
            plant: plant,
            score: this.calculateFuzzyScore(plant, query)
        }));
        
        // Filter and sort by score
        return scoredResults
            .filter(result => result.score >= this.options.minSimilarity)
            .sort((a, b) => b.score - a.score)
            .slice(0, this.options.maxResults)
            .map(result => result.plant);
    }

    /**
     * Get search suggestions with hybrid matching approach
     */
    getSuggestions(plants, query) {
        if (!query || query.trim().length === 0) {
            return plants.map(plant => ({
                plant: plant,
                highlightedPlantName: plant.plant_name,
                relevanceIndicator: 'exact'
            }));
        }
    
        const queryNorm = this.normalizeString(query);
        
        // Categorize matches
        const exactFullMatches = [];
        const partialExactMatches = [];
        const fuzzyMatches = [];
    
        plants.forEach(plant => {
            const plantNameNorm = this.normalizeString(plant.plant_name);
            const familyNorm = this.normalizeString(plant.family);
            const attributesString = this.getAttributesAsString(plant);
            const attributesNorm = this.normalizeString(attributesString);
            
            // Tokenize for word-level checking
            const plantNameTokens = this.tokenize(plantNameNorm);
            const familyTokens = this.tokenize(familyNorm);
            const queryTokens = this.tokenize(queryNorm);
    
            // Check for exact full matches
            if (plantNameNorm === queryNorm || 
                familyNorm === queryNorm || 
                attributesNorm === queryNorm) {
                exactFullMatches.push(plant);
                return;
            }
    
            // Check for partial exact matches (substring or prefix)
            const isPartialExact = 
                plantNameNorm.includes(queryNorm) || 
                familyNorm.includes(queryNorm) || 
                attributesNorm.includes(queryNorm) ||
                plantNameNorm.startsWith(queryNorm) || 
                familyNorm.startsWith(queryNorm) || 
                attributesNorm.startsWith(queryNorm) ||
                // Word-level substring matching (e.g., query word matches any plant name word)
                queryTokens.some(qToken => 
                    plantNameTokens.some(pToken => pToken.includes(qToken) || qToken.includes(pToken)) ||
                    familyTokens.some(fToken => fToken.includes(qToken) || qToken.includes(fToken))
                );
    
            if (isPartialExact) {
                partialExactMatches.push(plant);
            } else {
                // Calculate fuzzy score for non-exact matches
                const score = this.calculateFuzzyScore(plant, query);
                if (score >= this.options.minSimilarity) {
                    fuzzyMatches.push({ plant: plant, score: score });
                }
            }
        });
    
        // Sort fuzzy matches by score (highest first)
        fuzzyMatches.sort((a, b) => b.score - a.score);
    
        // Determine result set based on hybrid approach
        let results = [];
        
        if (exactFullMatches.length > 0) {
            // Case 1: Full exact matches - show only one
            results = exactFullMatches.slice(0, 1);
        } else if (partialExactMatches.length > 0) {
            // Case 2: Show ALL partial exact matches + fuzzy matches based on quality
            results = [...partialExactMatches]; // Show ALL exact matches, no limit
            
            // Add fuzzy matches based on their quality and the number of exact matches
            const exactCount = partialExactMatches.length;
            let fuzzyToAdd = [];
            
            if (exactCount <= 3) {
                // Few exact matches - add high and medium quality fuzzy matches
                fuzzyToAdd = fuzzyMatches.filter(fm => fm.score >= 0.65);
            } else if (exactCount <= 6) {
                // Moderate exact matches - add only high quality fuzzy matches
                fuzzyToAdd = fuzzyMatches.filter(fm => fm.score >= 0.75);
            } else {
                // Many exact matches - add only very high quality fuzzy matches
                fuzzyToAdd = fuzzyMatches.filter(fm => fm.score >= 0.85);
            }
            
            results = [
                ...results,
                ...fuzzyToAdd.map(fm => fm.plant)
            ];
        } else {
            // Case 3: No exact matches - show fuzzy matches
            results = fuzzyMatches.map(fm => fm.plant);
        }
    
        // Limit results and add relevance indicators
        return results.slice(0, this.options.maxResults).map(plant => {
            const plantNameNorm = this.normalizeString(plant.plant_name);
            const familyNorm = this.normalizeString(plant.family);
            const attributesString = this.getAttributesAsString(plant);
            const attributesNorm = this.normalizeString(attributesString);
            
            let relevanceIndicator = 'medium';
            
            if (plantNameNorm === queryNorm || familyNorm === queryNorm || 
                attributesNorm === queryNorm) {
                relevanceIndicator = 'exact';
            } else if (plantNameNorm.includes(queryNorm) || familyNorm.includes(queryNorm) || 
                       attributesNorm.includes(queryNorm) ||
                       plantNameNorm.startsWith(queryNorm) || familyNorm.startsWith(queryNorm) || 
                       attributesNorm.startsWith(queryNorm)) {
                relevanceIndicator = 'high';
            }
            
            return {
                plant: plant,
                highlightedPlantName: plant.plant_name,
                relevanceIndicator: relevanceIndicator
            };
        });
    }
}

/**
 * Plant Attribute Search Manager
 * Handles all search-related functionality and UI interactions
 */
class PlantAttributeSearchManager {
    constructor() {
        this.fuzzyEngine = new FuzzySearchEngine({
            minSimilarity: 0.5,
            maxResults: 10000 // Increased to handle full database (3,543 species)
        });
        
        this.plantAttributeData = [];
        this.currentMatches = [];
        this.currentSuggestionIndex = -1;
        this.activeFilters = new Set();
        
        // Pagination configuration
        this.itemsPerPage = 20;
        this.currentPage = 1;
        this.totalPages = 1;
        this.totalResults = 0;
        this.currentResults = [];
        
        // Debouncing configuration
        this.searchDebounceDelay = 300; // 300ms delay
        this.minSearchLength = 2; // Minimum characters before searching
        this.searchTimeout = null;
        this.isSearching = false;
        
        this.initializeEventListeners();
    }

    /**
     * Load data from external JSON file
     */
    async loadExternalData(jsonFile) {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.plantAttributeData = data.plant_data || data;
            this.currentResults = this.plantAttributeData;
            this.totalResults = this.plantAttributeData.length;
            this.calculateTotalPages();
            this.updateResultsTable();
            this.updateResultsInfo();
            this.renderPagination();
            this.updateActiveFiltersDisplay();
            console.log('JSON data loaded successfully');
        } catch (error) {
            console.error('Error loading JSON data:', error);
            // Show error message to user
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading data from JSON file. Please check that book_data_complete.json exists.</td></tr>';
        }
    }

    /**
     * Calculate total pages based on current results
     */
    calculateTotalPages() {
        this.totalPages = Math.ceil(this.totalResults / this.itemsPerPage);
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = this.totalPages;
        }
    }

    /**
     * Get current page results
     */
    getCurrentPageResults() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.currentResults.slice(startIndex, endIndex);
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.updateResultsTable();
            this.updateResultsInfo();
            this.renderPagination();
            this.scrollToResults();
        }
    }

    /**
     * Go to next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    /**
     * Go to previous page
     */
    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    /**
     * Scroll to results section
     */
    scrollToResults() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Perform fuzzy search (immediate execution)
     */
    performFuzzySearch() {
        const query = document.getElementById('searchInput').value.trim();
        
        // Check if data is loaded
        if (this.plantAttributeData.length === 0) {
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-warning">Data is still loading. Please wait...</td></tr>';
            return;
        }
        
        let results = this.fuzzyEngine.search(this.plantAttributeData, query);
        
        // Apply active filters
        if (this.activeFilters.size > 0) {
            results = this.applyFilters(results);
        }
        
        // Update current results and reset pagination
        this.currentResults = results;
        this.totalResults = results.length;
        this.currentPage = 1;
        this.calculateTotalPages();
        
        // Update UI
        this.updateResultsTable();
        this.updateResultsInfo();
        this.renderPagination();
        
        // Hide suggestions
        this.hideSuggestions();
    }

    /**
     * Apply active filters to results
     */
    applyFilters(results) {
        if (this.activeFilters.size === 0) return results;
        
        return results.filter(plant => {
            for (const filter of this.activeFilters) {
                if (!plant[filter] || plant[filter] === '' || plant[filter] === null) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Get filter display name from attribute
     */
    getFilterDisplayName(attribute) {
        const filterMap = {
            'is_tree': 'Tree',
            'is_shrub': 'Shrub',
            'is_herb': 'Herb',
            'is_climber': 'Climber',
            'is_creeping': 'Creeping',
            'is_water_plant': 'Water Plant',
            'is_succulent': 'Succulent',
            'requires_full_sun': 'Full Sun',
            'requires_semi_shade': 'Semi Shade',
            'requires_shade': 'Shade',
            'requires_moist_soil': 'Moist Soil',
            'requires_lots_of_water': 'Lots of Water',
            'is_drought_tolerant': 'Drought Tolerant',
            'is_drought_sensitive': 'Drought Sensitive',
            'heat_cold': 'Cold Tolerant',
            'heat_warm': 'Warm Climate',
            'heat_hot': 'Hot Climate',
            'is_toxic': 'Toxic',
            'is_lightly_toxic': 'Lightly Toxic',
            'is_heavily_toxic': 'Heavily Toxic',
            'has_cold_phobia': 'Cold Phobia',
            'has_moist_phobia': 'Moist Phobia',
            'is_wind_tolerant': 'Wind Tolerant',
            'is_wind_sensitive': 'Wind Sensitive',
            'has_bulbous_root': 'Bulbous Root',
            'is_rhizomatous': 'Rhizomatous'
        };
        return filterMap[attribute] || attribute;
    }

    /**
     * Get filter emoji from attribute
     */
    getFilterEmoji(attribute) {
        const emojiMap = {
            'is_tree': '🌳',
            'is_shrub': '🌴',
            'is_herb': '🌿',
            'is_climber': '🌱',
            'is_creeping': '🌾',
            'is_water_plant': '🌊',
            'is_succulent': '🌵',
            'requires_full_sun': '☀️',
            'requires_semi_shade': '🌤️',
            'requires_shade': '🌥️',
            'requires_moist_soil': '💧',
            'requires_lots_of_water': '🌧️',
            'is_drought_tolerant': '🏜️',
            'is_drought_sensitive': '💦',
            'heat_cold': '❄️',
            'heat_warm': '🌡️',
            'heat_hot': '🔥',
            'is_toxic': '🟠',
            'is_lightly_toxic': '🟡',
            'is_heavily_toxic': '🔴',
            'has_cold_phobia': '😨',
            'has_moist_phobia': '💧',
            'is_wind_tolerant': '💨',
            'is_wind_sensitive': '🌪️',
            'has_bulbous_root': '🧅',
            'is_rhizomatous': '🌱'
        };
        return emojiMap[attribute] || '';
    }

    /**
     * Update active filters display
     */
    updateActiveFiltersDisplay() {
        const container = document.getElementById('activeFiltersContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.activeFilters.size === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '8px';
        container.style.marginTop = '12px';

        this.activeFilters.forEach(attribute => {
            const badge = document.createElement('button');
            badge.className = 'active-filter-badge';
            badge.setAttribute('data-attribute', attribute);
            badge.innerHTML = `
                <span class="filter-emoji">${this.getFilterEmoji(attribute)}</span>
                <span class="filter-label">${this.getFilterDisplayName(attribute)}</span>
                <span class="filter-remove">×</span>
            `;
            
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                this.removeFilter(attribute);
            });
            
            container.appendChild(badge);
        });
    }

    /**
     * Add filter
     */
    addFilter(attribute) {
        this.activeFilters.add(attribute);
        this.updateFilterButtons();
        this.updateActiveFiltersDisplay();
        this.performFuzzySearch();
    }

    /**
     * Remove filter
     */
    removeFilter(attribute) {
        this.activeFilters.delete(attribute);
        this.updateFilterButtons();
        this.updateActiveFiltersDisplay();
        this.performFuzzySearch();
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        this.activeFilters.clear();
        this.updateFilterButtons();
        this.updateActiveFiltersDisplay();
        this.performFuzzySearch();
    }

    /**
     * Update filter button states
     */
    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            const attribute = btn.dataset.attribute;
            if (this.activeFilters.has(attribute)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Debounced search for suggestions (with delay)
     */
    debouncedSearch(query) {
        // Clear existing timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Hide suggestions immediately if query is too short
        if (query.length < this.minSearchLength) {
            this.hideSuggestions();
            return;
        }
        
        // Set loading state
        this.isSearching = true;
        this.showSearchLoading();
        
        // Set new timeout for debounced search
        this.searchTimeout = setTimeout(() => {
            // Double-check that we're still searching for the same query
            const currentQuery = document.getElementById('searchInput').value.trim();
            if (currentQuery === query) {
                this.executeSuggestionSearch(query);
            }
            this.isSearching = false;
            this.hideSearchLoading();
        }, this.searchDebounceDelay);
    }

    /**
     * Execute the actual suggestion search
     */
    executeSuggestionSearch(query) {
        // Check if data is loaded
        if (this.plantAttributeData.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        if (query.length > 0) {
            this.showSuggestions(query);
        } else {
            this.hideSuggestions();
            // Show all results when search is empty
            this.currentResults = this.plantAttributeData;
            this.totalResults = this.plantAttributeData.length;
            this.currentPage = 1;
            this.calculateTotalPages();
            this.updateResultsTable();
            this.updateResultsInfo();
            this.renderPagination();
        }
    }

    /**
     * Show loading indicator for search
     */
    showSearchLoading() {
        const suggestions = document.getElementById('suggestions');
        const searchInput = document.getElementById('searchInput');
        
        suggestions.innerHTML = '<div class="suggestion-item" style="text-align: center; color: #666;"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
        suggestions.style.display = 'block';
        
        // Add visual feedback to search input
        if (searchInput) {
            searchInput.classList.add('searching');
        }
    }

    /**
     * Hide loading indicator for search
     */
    hideSearchLoading() {
        const searchInput = document.getElementById('searchInput');
        
        // Remove visual feedback from search input
        if (searchInput) {
            searchInput.classList.remove('searching');
        }
    }

    /**
     * Update results table with current page results
     */
    updateResultsTable() {
        const tbody = document.getElementById('resultsTable');
        tbody.innerHTML = '';
        
        const pageResults = this.getCurrentPageResults();
        
        if (pageResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center">No results found</td></tr>';
            return;
        }
        
        pageResults.forEach(plant => {
            const row = document.createElement('tr');
            row.setAttribute('data-bs-toggle', 'modal');
            row.setAttribute('data-bs-target', '#detailModal');
            row.setAttribute('data-plant', JSON.stringify(plant));
            
            // Get growth form attributes
            const growthForm = this.getGrowthFormAttributes(plant);
            
            // Get light requirements
            const lightReqs = this.getLightRequirements(plant);
            
            // Get water requirements
            const waterReqs = this.getWaterRequirements(plant);
            
            // Get temperature tolerance
            const temperature = this.getTemperatureTolerance(plant);
            
            // Get toxicity
            const toxicity = this.getToxicityAttributes(plant);
            
            // Get environmental attributes
            const environmental = this.getEnvironmentalAttributes(plant);
            
            // Get root system attributes
            const rootSystem = this.getRootSystemAttributes(plant);
            
            // Get other attributes
            const otherAttributes = this.getOtherAttributes(plant);
            
            row.innerHTML = `
                <td><span class="latin-name">${plant.plant_name}</span></td>
                <td>${plant.family}</td>
                <td><div class="attribute-display">${growthForm}</div></td>
                <td><div class="attribute-display">${lightReqs}</div></td>
                <td><div class="attribute-display">${waterReqs}</div></td>
                <td><div class="attribute-display">${temperature}</div></td>
                <td><div class="attribute-display">${toxicity}</div></td>
                <td><div class="attribute-display">${environmental}</div></td>
                <td><div class="attribute-display">${rootSystem}</div></td>
                <td><div class="attribute-display">${otherAttributes}</div></td>
            `;
            
            tbody.appendChild(row);
        });
    }

    /**
     * Get growth form attributes for display
     */
    getGrowthFormAttributes(plant) {
        const attributes = [];
        const growthFormMap = {
            'is_tree': '🌳',
            'is_shrub': '🌴',
            'is_herb': '🌿',
            'is_climber': '🌱',
            'is_creeping': '🌾',
            'is_water_plant': '🌊',
            'is_succulent': '🌵'
        };
        
        Object.keys(growthFormMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item primary">${growthFormMap[key]} ${key.replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get light requirements for display
     */
    getLightRequirements(plant) {
        const attributes = [];
        const lightMap = {
            'requires_full_sun': '☀️',
            'requires_semi_shade': '🌤️',
            'requires_shade': '🌥️'
        };
        
        Object.keys(lightMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item secondary">${lightMap[key]} ${key.replace('requires_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get water requirements for display
     */
    getWaterRequirements(plant) {
        const attributes = [];
        const waterMap = {
            'requires_moist_soil': '💧',
            'requires_lots_of_water': '🌧️',
            'is_drought_tolerant': '🏜️',
            'is_drought_sensitive': '💦'
        };
        
        Object.keys(waterMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item secondary">${waterMap[key]} ${key.replace('requires_', '').replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get temperature tolerance for display
     */
    getTemperatureTolerance(plant) {
        const attributes = [];
        const tempMap = {
            'heat_cold': '❄️',
            'heat_warm': '🌡️',
            'heat_hot': '🔥'
        };
        
        Object.keys(tempMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item secondary">${tempMap[key]} ${key.replace('heat_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get toxicity attributes for display
     */
    getToxicityAttributes(plant) {
        const attributes = [];
        const toxicityMap = {
            'is_toxic': '🟠',
            'is_lightly_toxic': '🟡',
            'is_heavily_toxic': '🔴'
        };
        
        Object.keys(toxicityMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item danger">${toxicityMap[key]} ${key.replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get environmental attributes for display
     */
    getEnvironmentalAttributes(plant) {
        const attributes = [];
        const environmentalMap = {
            'has_cold_phobia': '😨',
            'has_moist_phobia': '💧',
            'is_wind_tolerant': '💨',
            'is_wind_sensitive': '🌪️'
        };
        
        Object.keys(environmentalMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item warning">${environmentalMap[key]} ${key.replace('has_', '').replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get root system attributes for display
     */
    getRootSystemAttributes(plant) {
        const attributes = [];
        const rootSystemMap = {
            'has_bulbous_root': '🧅',
            'is_rhizomatous': '🌱'
        };
        
        Object.keys(rootSystemMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item info">${rootSystemMap[key]} ${key.replace('has_', '').replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Get other attributes for display
     */
    getOtherAttributes(plant) {
        const attributes = [];
        const otherMap = {
            'is_perennial': '🌱',
            'is_parasitic': '🪱',
            'is_insectivorous': '🦟',
            'is_salt_tolerant': '🧂',
            'is_antipollution': '🌬️'
        };
        
        Object.keys(otherMap).forEach(key => {
            if (plant[key]) {
                attributes.push(`<span class="attribute-item">${otherMap[key]} ${key.replace('is_', '').replace('_', ' ')}</span>`);
            }
        });
        
        return attributes.join(' ');
    }

    /**
     * Update results information display
     */
    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const resultsSummary = document.getElementById('resultsSummary');
        
        if (resultsCount) {
            resultsCount.textContent = `${this.totalResults.toLocaleString()} results found`;
        }
        
        if (resultsSummary && this.totalResults > 0) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalResults);
            resultsSummary.textContent = `Showing ${startItem}-${endItem} of ${this.totalResults.toLocaleString()} entries`;
        } else if (resultsSummary) {
            resultsSummary.textContent = '';
        }
    }

    /**
     * Render pagination controls
     */
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const paginationContainer = document.getElementById('paginationContainer');
        
        if (!pagination) return;
        
        // Hide pagination if only one page or no results
        if (this.totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        pagination.innerHTML = '';
        
        // Previous button
        const prevItem = document.createElement('li');
        prevItem.className = `page-item ${this.currentPage === 1 ? 'disabled' : ''}`;
        prevItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Previous" data-page="prev">
                <span aria-hidden="true">&laquo;</span>
            </a>
        `;
        pagination.appendChild(prevItem);
        
        // Calculate page range to show
        const maxVisiblePages = 7;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust start page if we're near the end
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page and ellipsis
        if (startPage > 1) {
            const firstItem = document.createElement('li');
            firstItem.className = 'page-item';
            firstItem.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
            pagination.appendChild(firstItem);
            
            if (startPage > 2) {
                const ellipsisItem = document.createElement('li');
                ellipsisItem.className = 'page-item disabled';
                ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
                pagination.appendChild(ellipsisItem);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === this.currentPage ? 'active' : ''}`;
            pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(pageItem);
        }
        
        // Last page and ellipsis
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                const ellipsisItem = document.createElement('li');
                ellipsisItem.className = 'page-item disabled';
                ellipsisItem.innerHTML = `<span class="page-link">...</span>`;
                pagination.appendChild(ellipsisItem);
            }
            
            const lastItem = document.createElement('li');
            lastItem.className = 'page-item';
            lastItem.innerHTML = `<a class="page-link" href="#" data-page="${this.totalPages}">${this.totalPages}</a>`;
            pagination.appendChild(lastItem);
        }
        
        // Next button
        const nextItem = document.createElement('li');
        nextItem.className = `page-item ${this.currentPage === this.totalPages ? 'disabled' : ''}`;
        nextItem.innerHTML = `
            <a class="page-link" href="#" aria-label="Next" data-page="next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        `;
        pagination.appendChild(nextItem);
    }

    /**
     * Show search suggestions
     */
    showSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        
        // Check if data is loaded
        if (this.plantAttributeData.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        const suggestionResults = this.fuzzyEngine.getSuggestions(this.plantAttributeData, query);
        
        if (suggestionResults.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.currentMatches = suggestionResults;
        this.currentSuggestionIndex = -1;
        
        suggestions.innerHTML = suggestionResults.map((result, index) => `
            <div class="suggestion-item" data-suggestion-item="${index}">
                <div>
                    <div class="suggestion-scientific"><span class="latin-name">${result.highlightedPlantName}</span></div>
                </div>
                <span class="relevance-indicator relevance-${result.relevanceIndicator}">
                    ${result.relevanceIndicator}
                </span>
            </div>
        `).join('');
        
        suggestions.style.display = 'block';
        
        // Clear loading state
        this.hideSearchLoading();
    }

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
        this.currentSuggestionIndex = -1;
        
        // Clear loading state
        this.hideSearchLoading();
    }

    /**
     * Select suggestion by index
     */
    selectSuggestionByIndex(index) {
        if (this.currentMatches && this.currentMatches[index]) {
            this.selectSuggestionByPlant(this.currentMatches[index].plant);
        }
    }

    /**
     * Select suggestion by plant
     */
    selectSuggestionByPlant(plant) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = plant.plant_name;
        this.hideSuggestions();
        this.performFuzzySearch();
    }

    /**
     * Update suggestion highlight
     */
    updateSuggestionHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Search input event listeners
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                // Check if data is loaded
                if (this.plantAttributeData.length === 0) {
                    this.hideSuggestions();
                    return;
                }
                
                // Use debounced search for better performance
                this.debouncedSearch(query);
            });

            searchInput.addEventListener('keydown', (e) => {
                const suggestions = document.getElementById('suggestions');
                const suggestionItems = suggestions.querySelectorAll('.suggestion-item');
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.currentSuggestionIndex = Math.min(this.currentSuggestionIndex + 1, suggestionItems.length - 1);
                        this.updateSuggestionHighlight(suggestionItems);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.currentSuggestionIndex = Math.max(this.currentSuggestionIndex - 1, -1);
                        this.updateSuggestionHighlight(suggestionItems);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        if (this.currentSuggestionIndex >= 0) {
                            this.selectSuggestionByIndex(this.currentSuggestionIndex);
                        } else {
                            this.performFuzzySearch();
                        }
                        break;
                    case 'Escape':
                        this.hideSuggestions();
                        this.blur();
                        break;
                }
            });
        }

        // Suggestions click event listener
        const suggestionsContainer = document.getElementById('suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.addEventListener('click', (e) => {
                if (e.target.closest('.suggestion-item')) {
                    const index = parseInt(e.target.closest('.suggestion-item').dataset.suggestionItem);
                    this.selectSuggestionByIndex(index);
                }
            });
        }

        // Filter button event listeners
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const attribute = btn.dataset.attribute;
                
                if (this.activeFilters.has(attribute)) {
                    this.removeFilter(attribute);
                } else {
                    this.addFilter(attribute);
                }
            });
        });

        // Pagination click event listener
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.addEventListener('click', (e) => {
                e.preventDefault();
                const pageLink = e.target.closest('.page-link');
                if (pageLink) {
                    const pageData = pageLink.dataset.page;
                    if (pageData === 'prev') {
                        this.previousPage();
                    } else if (pageData === 'next') {
                        this.nextPage();
                    } else if (pageData && !isNaN(pageData)) {
                        this.goToPage(parseInt(pageData));
                    }
                }
            });
        }
    }

    /**
     * Load data from JSON file
     */
    async loadDataFromJSON() {
        try {
            // Load data from JSON file with correct path
            await this.loadExternalData('./book_data_complete.json');
            console.log('JSON data loaded successfully');
        } catch (error) {
            console.error('Error loading JSON data:', error);
            // Show error message to user
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading data from JSON file. Please check that book_data_complete.json exists.</td></tr>';
        }
    }
}

// Global search manager instance
let searchManager;

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    searchManager = new PlantAttributeSearchManager();
    searchManager.loadDataFromJSON();
});

// Global function for search button (maintains compatibility with existing HTML)
function performFuzzySearch() {
    if (searchManager) {
        searchManager.performFuzzySearch();
    }
}

// Global function for clearing filters
function clearAllFilters() {
    if (searchManager) {
        searchManager.clearAllFilters();
    }
}
