/**
 * Fuzzy Search Library for Tree Species Database
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
        const scientificNorm = this.normalizeString(species.scientific);
        const chineseNorm = this.normalizeString(species.chinese);
        const alternativeNorm = this.normalizeString(species.alternative || '');
        
        const scientificTokens = this.tokenize(species.scientific);
        const chineseTokens = this.tokenize(species.chinese);
        const alternativeTokens = this.tokenize(species.alternative || '');
        
        // Calculate different types of matches
        const scores = {
            // Exact substring matches (highest priority)
            scientificExact: scientificNorm.includes(queryNorm) ? 1.0 : 0,
            chineseExact: chineseNorm.includes(queryNorm) ? 1.0 : 0,
            alternativeExact: alternativeNorm.includes(queryNorm) ? 1.0 : 0,
            
            // Prefix matches (high priority)
            scientificPrefix: scientificNorm.startsWith(queryNorm) ? 1.0 : 0,
            chinesePrefix: chineseNorm.startsWith(queryNorm) ? 1.0 : 0,
            alternativePrefix: alternativeNorm.startsWith(queryNorm) ? 1.0 : 0,
            
            // Fuzzy string similarity
            scientificFuzzy: Math.max(
                this.calculateSimilarity(scientificNorm, queryNorm),
                this.jaroWinklerSimilarity(scientificNorm, queryNorm)
            ),
            chineseFuzzy: Math.max(
                this.calculateSimilarity(chineseNorm, queryNorm),
                this.jaroWinklerSimilarity(chineseNorm, queryNorm)
            ),
            alternativeFuzzy: Math.max(
                this.calculateSimilarity(alternativeNorm, queryNorm),
                this.jaroWinklerSimilarity(alternativeNorm, queryNorm)
            ),
            
            // Token-based similarity
            scientificTokens: this.tokenSimilarity(queryTokens, scientificTokens),
            chineseTokens: this.tokenSimilarity(queryTokens, chineseTokens),
            alternativeTokens: this.tokenSimilarity(queryTokens, alternativeTokens)
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
        
        const alternativeScore = Math.max(
            scores.alternativeExact + this.options.exactMatchBonus,
            scores.alternativePrefix + this.options.prefixBonus,
            scores.alternativeFuzzy,
            scores.alternativeTokens
        );
        
        const finalScore = (
            scientificScore * this.options.scientificWeight +
            chineseScore * this.options.chineseWeight +
            alternativeScore * this.options.alternativeWeight
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
     * Get search suggestions with fuzzy matching
     */
/**
 * Get search suggestions with hybrid matching approach
 */
    getSuggestions(species, query) {
        if (!query || query.trim().length === 0) {
            return species.slice(0, this.options.maxResults).map(sp => ({
                species: sp,
                highlightedScientific: sp.scientific,
                relevanceIndicator: 'exact'
            }));
        }
    
        const queryNorm = this.normalizeString(query);
        
        // Categorize matches
        const exactFullMatches = [];
        const partialExactMatches = [];
        const fuzzyMatches = [];
    
        species.forEach(sp => {
            const scientificNorm = this.normalizeString(sp.scientific);
            const chineseNorm = this.normalizeString(sp.chinese);
            const alternativeNorm = this.normalizeString(sp.alternative || '');
    
            // Check for exact full matches
            if (scientificNorm === queryNorm || 
                chineseNorm === queryNorm || 
                alternativeNorm === queryNorm) {
                exactFullMatches.push(sp);
                return;
            }
    
            // Check for partial exact matches (substring or prefix)
            const isPartialExact = 
                scientificNorm.includes(queryNorm) || 
                chineseNorm.includes(queryNorm) || 
                alternativeNorm.includes(queryNorm) ||
                scientificNorm.startsWith(queryNorm) || 
                chineseNorm.startsWith(queryNorm) || 
                alternativeNorm.startsWith(queryNorm);
    
            if (isPartialExact) {
                partialExactMatches.push(sp);
                return;
            }
    
            // Otherwise, calculate fuzzy score
            const score = this.calculateFuzzyScore(sp, query);
            if (score >= this.options.minSimilarity) {
                fuzzyMatches.push({ species: sp, score: score });
            }
        });
    
        // Sort fuzzy matches by score
        fuzzyMatches.sort((a, b) => b.score - a.score);
    
        // Determine result set based on hybrid approach
        let results = [];
        
        if (exactFullMatches.length > 0) {
            // Case 1: Full exact matches - show only these
            results = exactFullMatches.slice(0, 1); // Only show first exact match
        } else if (partialExactMatches.length > 0) {
            // Case 2: Partial exact matches + limited fuzzy matches
            const maxPartialExact = Math.min(partialExactMatches.length, 6);
            const remainingSlots = Math.max(0, 8 - maxPartialExact);
            
            results = [
                ...partialExactMatches.slice(0, maxPartialExact),
                ...fuzzyMatches.slice(0, remainingSlots).map(fm => fm.species)
            ];
        } else {
            // Case 3: Only fuzzy matches - show full 8
            results = fuzzyMatches.slice(0, 8).map(fm => fm.species);
        }
    
        // Convert to suggestion format with highlighting and relevance
        return results.map(sp => ({
            species: sp,
            highlightedScientific: this.highlightMatch(sp.scientific, query),
            relevanceIndicator: this.getRelevanceIndicator(sp, query)
        }));
    }

    /**
     * Get search suggestions with hybrid matching approach
     */
    getSuggestions(species, query) {
        if (!query || query.trim().length === 0) {
            return species.slice(0, this.options.maxResults).map(sp => ({
                species: sp,
                highlightedScientific: sp.scientific,
                relevanceIndicator: 'exact'
            }));
        }
    
        const queryNorm = this.normalizeString(query);
        
        // Categorize matches
        const exactFullMatches = [];
        const partialExactMatches = [];
        const fuzzyMatches = [];
    
        species.forEach(sp => {
            const scientificNorm = this.normalizeString(sp.scientific);
            const chineseNorm = this.normalizeString(sp.chinese);
            const alternativeNorm = this.normalizeString(sp.alternative || '');
    
            // Check for exact full matches
            if (scientificNorm === queryNorm || 
                chineseNorm === queryNorm || 
                alternativeNorm === queryNorm) {
                exactFullMatches.push(sp);
                return;
            }
    
            // Check for partial exact matches (substring or prefix)
            const isPartialExact = 
                scientificNorm.includes(queryNorm) || 
                chineseNorm.includes(queryNorm) || 
                alternativeNorm.includes(queryNorm) ||
                scientificNorm.startsWith(queryNorm) || 
                chineseNorm.startsWith(queryNorm) || 
                alternativeNorm.startsWith(queryNorm);
    
            if (isPartialExact) {
                partialExactMatches.push(sp);
                return;
            }
    
            // Otherwise, calculate fuzzy score
            const score = this.calculateFuzzyScore(sp, query);
            if (score >= this.options.minSimilarity) {
                fuzzyMatches.push({ species: sp, score: score });
            }
        });
    
        // Sort fuzzy matches by score
        fuzzyMatches.sort((a, b) => b.score - a.score);
    
        // Determine result set based on hybrid approach
        let results = [];
        
        if (exactFullMatches.length > 0) {
            // Case 1: Full exact matches - show only these
            results = exactFullMatches.slice(0, 1); // Only show first exact match
        } else if (partialExactMatches.length > 0) {
            // Case 2: Partial exact matches + limited fuzzy matches
            const maxPartialExact = Math.min(partialExactMatches.length, 6);
            const remainingSlots = Math.max(0, 8 - maxPartialExact);
            
            results = [
                ...partialExactMatches.slice(0, maxPartialExact),
                ...fuzzyMatches.slice(0, remainingSlots).map(fm => fm.species)
            ];
        } else {
            // Case 3: Only fuzzy matches - show full 8
            results = fuzzyMatches.slice(0, 8).map(fm => fm.species);
        }
    
        // Convert to suggestion format with highlighting and relevance
        return results.map(sp => ({
            species: sp,
            highlightedScientific: this.highlightMatch(sp.scientific, query),
            relevanceIndicator: this.getRelevanceIndicator(sp, query)
        }));
    }
    
    /**
     * Simple highlight function that preserves HTML
     */
    highlightMatch(scientificHtml, query) {
        if (!query || query.trim().length === 0) return scientificHtml;
        
        const queryNorm = this.normalizeString(query);
        const tokens = queryNorm.split(/\s+/).filter(t => t.length > 0);
        
        let result = scientificHtml;
        
        // Highlight each token
        for (const token of tokens) {
            if (token.length < 2) continue; // Skip very short tokens
            
            const regex = new RegExp(`(${this.escapeRegex(token)})`, 'gi');
            
            // Handle italic tags specially
            if (result.includes('<i>') && result.includes('</i>')) {
                result = result.replace(
                    /(<i>)(.*?)(<\/i>)/gi,
                    (match, openTag, content, closeTag) => {
                        const highlightedContent = content.replace(regex, '<strong>$1</strong>');
                        return openTag + highlightedContent + closeTag;
                    }
                );
            } else {
                result = result.replace(regex, '<strong>$1</strong>');
            }
        }
        
        return result;
    }

    /**
     * Escape special regex characters
     */
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Get relevance indicator for UI feedback
     */
    getRelevanceIndicator(species, query) {
        const score = this.calculateFuzzyScore(species, query);
        
        if (score >= 0.9) return 'exact';
        if (score >= 0.7) return 'high';
        if (score >= 0.6) return 'medium';
        return 'low';
    }
}

// Export for use in main application
window.FuzzySearchEngine = FuzzySearchEngine;
