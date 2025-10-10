/**
 * Plant Etymology Search Engine
 * Modular search functionality for the Plant Etymology Database
 */

/**
 * Fuzzy Search Engine for Plant Etymology Database
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
            scientificWeight: options.scientificWeight || 1.0,
            chineseWeight: options.chineseWeight || 0.8,
            alternativeWeight: options.alternativeWeight || 0.6,
            latin29Weight: options.latin29Weight || 0.9,
            
            // Search behavior
            maxResults: options.maxResults || 8,
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
     * Calculate Jaro-Winkler similarity (better for names)
     */
    jaroWinklerSimilarity(str1, str2) {
        if (str1 === str2) return 1.0;
        
        const len1 = str1.length;
        const len2 = str2.length;
        
        if (len1 === 0 || len2 === 0) return 0.0;
        
        const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
        if (matchWindow < 0) return 0.0;
        
        const str1Matches = new Array(len1).fill(false);
        const str2Matches = new Array(len2).fill(false);
        
        let matches = 0;
        let transpositions = 0;
        
        // Find matches
        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - matchWindow);
            const end = Math.min(i + matchWindow + 1, len2);
            
            for (let j = start; j < end; j++) {
                if (str2Matches[j] || str1[i] !== str2[j]) continue;
                str1Matches[i] = true;
                str2Matches[j] = true;
                matches++;
                break;
            }
        }
        
        if (matches === 0) return 0.0;
        
        // Count transpositions
        let k = 0;
        for (let i = 0; i < len1; i++) {
            if (!str1Matches[i]) continue;
            while (!str2Matches[k]) k++;
            if (str1[i] !== str2[k]) transpositions++;
            k++;
        }
        
        const jaro = (matches / len1 + matches / len2 + 
                     (matches - transpositions / 2) / matches) / 3.0;
        
        // Winkler prefix bonus
        const prefix = Math.min(4, this.commonPrefixLength(str1, str2));
        return jaro + (0.1 * prefix * (1.0 - jaro));
    }

    /**
     * Find common prefix length
     */
    commonPrefixLength(str1, str2) {
        const minLength = Math.min(str1.length, str2.length);
        for (let i = 0; i < minLength; i++) {
            if (str1[i] !== str2[i]) return i;
        }
        return minLength;
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
        
        // Handle scientific name common patterns
        normalized = normalized.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp."
        normalized = normalized.replace(/\s+var\.?\s+/i, ' '); // Simplify "var."
        normalized = normalized.replace(/\s+cv\.?\s+/i, ' '); // Simplify "cv."
        
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
     * Calculate token-based similarity
     */
    tokenSimilarity(tokens1, tokens2) {
        if (tokens1.length === 0 && tokens2.length === 0) return 1.0;
        if (tokens1.length === 0 || tokens2.length === 0) return 0.0;
        
        let totalScore = 0;
        let comparisons = 0;
        
        for (const token1 of tokens1) {
            let bestScore = 0;
            for (const token2 of tokens2) {
                const score = Math.max(
                    this.calculateSimilarity(token1, token2),
                    this.jaroWinklerSimilarity(token1, token2)
                );
                bestScore = Math.max(bestScore, score);
            }
            totalScore += bestScore;
            comparisons++;
        }
        
        return comparisons > 0 ? totalScore / comparisons : 0;
    }

    /**
     * Calculate comprehensive fuzzy score for a species
     */
    calculateFuzzyScore(species, query) {
        const queryNorm = this.normalizeString(query);
        const queryTokens = this.tokenize(query);
        
        if (queryTokens.length === 0) return 0;
        
        // Extract and normalize species data
        const scientificNorm = this.normalizeString(species.latin_epithet);
        const chineseNorm = this.normalizeString(species.chinese_explanation);
        const englishNorm = this.normalizeString(species.english_explanation || '');
        
        const scientificTokens = this.tokenize(species.latin_epithet);
        const chineseTokens = this.tokenize(species.chinese_explanation);
        const englishTokens = this.tokenize(species.english_explanation || '');
        
        // Calculate different types of matches
        const scores = {
            // Exact substring matches (highest priority)
            scientificExact: scientificNorm.includes(queryNorm) ? 1.0 : 0,
            chineseExact: chineseNorm.includes(queryNorm) ? 1.0 : 0,
            englishExact: englishNorm.includes(queryNorm) ? 1.0 : 0,
            
            // Prefix matches (high priority)
            scientificPrefix: scientificNorm.startsWith(queryNorm) ? 1.0 : 0,
            chinesePrefix: chineseNorm.startsWith(queryNorm) ? 1.0 : 0,
            englishPrefix: englishNorm.startsWith(queryNorm) ? 1.0 : 0,
            
            // Fuzzy string similarity
            scientificFuzzy: Math.max(
                this.calculateSimilarity(scientificNorm, queryNorm),
                this.jaroWinklerSimilarity(scientificNorm, queryNorm)
            ),
            chineseFuzzy: Math.max(
                this.calculateSimilarity(chineseNorm, queryNorm),
                this.jaroWinklerSimilarity(chineseNorm, queryNorm)
            ),
            englishFuzzy: Math.max(
                this.calculateSimilarity(englishNorm, queryNorm),
                this.jaroWinklerSimilarity(englishNorm, queryNorm)
            ),
            
            // Token-based similarity
            scientificTokens: this.tokenSimilarity(queryTokens, scientificTokens),
            chineseTokens: this.tokenSimilarity(queryTokens, chineseTokens),
            englishTokens: this.tokenSimilarity(queryTokens, englishTokens)
        };
        
        // Calculate weighted final score
        const scientificScore = Math.max(
            scores.scientificExact + this.options.exactMatchBonus,
            scores.scientificPrefix + this.options.prefixBonus,
            scores.scientificFuzzy,
            scores.scientificTokens
        );
        
        const chineseScore = Math.max(
            scores.chineseExact + this.options.exactMatchBonus,
            scores.chinesePrefix + this.options.prefixBonus,
            scores.chineseFuzzy,
            scores.chineseTokens
        );
        
        const englishScore = Math.max(
            scores.englishExact + this.options.exactMatchBonus,
            scores.englishPrefix + this.options.prefixBonus,
            scores.englishFuzzy,
            scores.englishTokens
        );
        
        const finalScore = (
            scientificScore * this.options.scientificWeight +
            chineseScore * this.options.chineseWeight +
            englishScore * this.options.alternativeWeight
        ) / (this.options.scientificWeight + this.options.chineseWeight + this.options.alternativeWeight);
        
        return Math.min(finalScore, 1.0); // Cap at 1.0
    }

    /**
     * Perform fuzzy search on species data
     */
    search(species, query) {
        if (!query || query.trim().length === 0) {
            return species.slice(0, this.options.maxResults);
        }
        
        // Calculate scores for all species
        const scoredResults = species.map(sp => ({
            species: sp,
            score: this.calculateFuzzyScore(sp, query)
        }));
        
        // Filter and sort by score
        return scoredResults
            .filter(result => result.score >= this.options.minSimilarity)
            .sort((a, b) => b.score - a.score)
            .slice(0, this.options.maxResults)
            .map(result => result.species);
    }

    /**
     * Get search suggestions with hybrid matching approach
     */
    getSuggestions(species, query) {
        if (!query || query.trim().length === 0) {
            return species.slice(0, this.options.maxResults).map(sp => ({
                species: sp,
                highlightedScientific: sp.latin_epithet,
                relevanceIndicator: 'exact'
            }));
        }
    
        const queryNorm = this.normalizeString(query);
        
        // Categorize matches
        const exactFullMatches = [];
        const partialExactMatches = [];
        const fuzzyMatches = [];
    
        species.forEach(sp => {
            const scientificNorm = this.normalizeString(sp.latin_epithet);
            const chineseNorm = this.normalizeString(sp.chinese_explanation);
            const englishNorm = this.normalizeString(sp.english_explanation || '');
    
            // Check for exact full matches
            if (scientificNorm === queryNorm || 
                chineseNorm === queryNorm || 
                englishNorm === queryNorm) {
                exactFullMatches.push(sp);
                return;
            }
    
            // Check for partial exact matches (substring or prefix)
            const isPartialExact = 
                scientificNorm.includes(queryNorm) || 
                chineseNorm.includes(queryNorm) || 
                englishNorm.includes(queryNorm) ||
                scientificNorm.startsWith(queryNorm) || 
                chineseNorm.startsWith(queryNorm) || 
                englishNorm.startsWith(queryNorm);
    
            if (isPartialExact) {
                partialExactMatches.push(sp);
            } else {
                // Calculate fuzzy score for non-exact matches
                const score = this.calculateFuzzyScore(sp, query);
                if (score >= this.options.minSimilarity) {
                    fuzzyMatches.push({ species: sp, score: score });
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
                ...fuzzyToAdd.map(fm => fm.species)
            ];
        } else {
            // Case 3: No exact matches - show fuzzy matches
            results = fuzzyMatches.map(fm => fm.species);
        }
    
        // Limit results and add relevance indicators
        return results.slice(0, this.options.maxResults).map(sp => {
            const scientificNorm = this.normalizeString(sp.latin_epithet);
            const chineseNorm = this.normalizeString(sp.chinese_explanation);
            const englishNorm = this.normalizeString(sp.english_explanation || '');
            
            let relevanceIndicator = 'medium';
            
            if (scientificNorm === queryNorm || chineseNorm === queryNorm || 
                englishNorm === queryNorm) {
                relevanceIndicator = 'exact';
            } else if (scientificNorm.includes(queryNorm) || chineseNorm.includes(queryNorm) || 
                       englishNorm.includes(queryNorm) ||
                       scientificNorm.startsWith(queryNorm) || chineseNorm.startsWith(queryNorm) || 
                       englishNorm.startsWith(queryNorm)) {
                relevanceIndicator = 'high';
            }
            
            return {
                species: sp,
                highlightedScientific: sp.latin_epithet,
                relevanceIndicator: relevanceIndicator
            };
        });
    }
}

/**
 * Plant Etymology Search Manager
 * Handles all search-related functionality and UI interactions
 */
class PlantEtymologySearchManager {
    constructor() {
        this.fuzzyEngine = new FuzzySearchEngine({
            minSimilarity: 0.5,
            maxResults: 1000 // Increased to allow pagination of search results
        });
        
        this.plantEtymologyData = [];
        this.currentMatches = [];
        this.currentSuggestionIndex = -1;
        
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
            this.plantEtymologyData = data;
            this.currentResults = data;
            this.totalResults = data.length;
            this.calculateTotalPages();
            this.updateResultsTable();
            this.updateResultsInfo();
            this.renderPagination();
            console.log('JSON data loaded successfully');
        } catch (error) {
            console.error('Error loading JSON data:', error);
            // Show error message to user
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error loading data from JSON file. Please check that plant_etymology_data.json exists.</td></tr>';
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
        if (this.plantEtymologyData.length === 0) {
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-warning">Data is still loading. Please wait...</td></tr>';
            return;
        }
        
        const results = this.fuzzyEngine.search(this.plantEtymologyData, query);
        
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
        if (this.plantEtymologyData.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        if (query.length > 0) {
            this.showSuggestions(query);
        } else {
            this.hideSuggestions();
            // Show all results when search is empty
            this.currentResults = this.plantEtymologyData;
            this.totalResults = this.plantEtymologyData.length;
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
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">No results found</td></tr>';
            return;
        }
        
        pageResults.forEach(result => {
            const row = document.createElement('tr');
            row.setAttribute('data-bs-toggle', 'modal');
            row.setAttribute('data-bs-target', '#detailModal');
            row.setAttribute('data-genus', result.latin_epithet);
            row.setAttribute('data-gender', result.gender || 'Unknown');
            row.setAttribute('data-language', result.source_language || 'Unknown');
            row.setAttribute('data-chinese', result.chinese_explanation || 'No Chinese explanation available');
            row.setAttribute('data-english', result.english_explanation || `English explanation for ${result.latin_epithet}`);
            
            row.innerHTML = `
                <td><span class="latin-name">${result.latin_epithet}</span></td>
                <td>${result.gender || 'Unknown'}</td>
                <td>${result.source_language || 'Unknown'}</td>
            `;
            
            tbody.appendChild(row);
        });
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
        if (this.plantEtymologyData.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        const suggestionResults = this.fuzzyEngine.getSuggestions(this.plantEtymologyData, query);
        
        if (suggestionResults.length === 0) {
            this.hideSuggestions();
            return;
        }
        
        this.currentMatches = suggestionResults;
        this.currentSuggestionIndex = -1;
        
        suggestions.innerHTML = suggestionResults.map((result, index) => `
            <div class="suggestion-item" data-suggestion-item="${index}">
                <div>
                    <div class="suggestion-scientific"><span class="latin-name">${result.highlightedScientific}</span></div>
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
            this.selectSuggestionBySpecies(this.currentMatches[index].species);
        }
    }

    /**
     * Select suggestion by species
     */
    selectSuggestionBySpecies(species) {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = species.latin_epithet;
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
                if (this.plantEtymologyData.length === 0) {
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
            await this.loadExternalData('./plant_etymology_data.json');
            console.log('JSON data loaded successfully');
        } catch (error) {
            console.error('Error loading JSON data:', error);
            // Show error message to user
            const tbody = document.getElementById('resultsTable');
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error loading data from JSON file. Please check that plant_etymology_data.json exists.</td></tr>';
        }
    }
}

// Global search manager instance
let searchManager;

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    searchManager = new PlantEtymologySearchManager();
    searchManager.loadDataFromJSON();
});

// Global function for search button (maintains compatibility with existing HTML)
function performFuzzySearch() {
    if (searchManager) {
        searchManager.performFuzzySearch();
    }
}
