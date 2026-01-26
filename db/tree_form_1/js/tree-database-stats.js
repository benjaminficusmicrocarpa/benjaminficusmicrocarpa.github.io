/**
 * Tree Database Statistics Dashboard - Specialized Component
 * Phase 3: Specialized Features Isolation
 * 
 * This file contains the real-time statistics dashboard functionality
 * that tracks and displays database metrics with specialized logic
 * for botanical data management.
 */

/**
 * Statistics Dashboard Class - Specialized for Tree Database
 * 
 * Features:
 * - Real-time statistics calculation
 * - Filter integration with photos toggle
 * - Performance monitoring
 * - User experience feedback
 */
class StatisticsDashboard {
    constructor() {
        this.stats = {
            total: 0,
            visible: 0,
            withPhotos: 0
        };
        
        // Performance tracking
        this.performanceMetrics = {
            lastUpdateTime: 0,
            updateCount: 0,
            averageUpdateTime: 0
        };
        
        console.log('Statistics Dashboard initialized');
    }
    
    /**
     * Update statistics with current data
     * @param {Array} species - All species data
     * @param {Array} filteredSpecies - Currently filtered/visible species
     * @param {Object} speciesImages - Species with photos configuration
     */
    updateStats(species, filteredSpecies, speciesImages = {}) {
        const startTime = performance.now();
        
        // Calculate core statistics
        this.stats.total = species.length;
        this.stats.visible = filteredSpecies.length;
        this.stats.withPhotos = filteredSpecies.filter(s => speciesImages[s.id]).length;
        
        // Render the statistics
        this.renderStats();
        
        // Track performance
        this.trackPerformance(startTime);
        
        console.log('Statistics updated:', this.stats);
    }
    
    /**
     * Update statistics when photos filter is toggled
     * @param {boolean} isEnabled - Whether photos filter is active
     * @param {Array} filteredSpecies - Current filtered species
     * @param {Object} speciesImages - Species with photos configuration
     */
    updatePhotosFilter(isEnabled, filteredSpecies, speciesImages = {}) {
        if (isEnabled) {
            // When photos filter is enabled, visible count equals species with photos
            this.stats.visible = filteredSpecies.filter(s => speciesImages[s.id]).length;
        } else {
            // When disabled, visible count is the full filtered set
            this.stats.visible = filteredSpecies.length;
        }
        
        this.renderStats();
        console.log('Photos filter statistics updated:', this.stats);
    }
    
    /**
     * Render statistics to the DOM
     * Uses specialized DOM elements for tree database
     */
    renderStats() {
        // Update total species count
        const totalCountElement = document.getElementById('totalCount');
        if (totalCountElement) {
            totalCountElement.textContent = this.stats.total;
        }
        
        // Update visible species count
        const visibleCountElement = document.getElementById('visibleCount');
        if (visibleCountElement) {
            visibleCountElement.textContent = this.stats.visible;
        }
        
        // Update species with photos count
        const speciesWithPhotosCountElement = document.getElementById('speciesWithPhotosCount');
        if (speciesWithPhotosCountElement) {
            speciesWithPhotosCountElement.textContent = this.stats.withPhotos;
        }
        
        // Add visual feedback for statistics changes
        this.addVisualFeedback();
    }
    
    /**
     * Add visual feedback when statistics change
     * Specialized animation for database statistics
     */
    addVisualFeedback() {
        const statNumbers = document.querySelectorAll('.stat-number, .database-stat-number');
        
        statNumbers.forEach(element => {
            // Add a subtle animation class
            element.classList.add('stat-updated');
            
            // Remove the class after animation completes
            setTimeout(() => {
                element.classList.remove('stat-updated');
            }, 300);
        });
    }
    
    /**
     * Track performance metrics for statistics updates
     * @param {number} startTime - Performance timestamp when update started
     */
    trackPerformance(startTime) {
        const endTime = performance.now();
        const updateTime = endTime - startTime;
        
        this.performanceMetrics.updateCount++;
        this.performanceMetrics.lastUpdateTime = updateTime;
        
        // Calculate rolling average
        this.performanceMetrics.averageUpdateTime = 
            (this.performanceMetrics.averageUpdateTime * (this.performanceMetrics.updateCount - 1) + updateTime) 
            / this.performanceMetrics.updateCount;
        
        // Log performance warnings if updates are slow
        if (updateTime > 10) {
            console.warn(`Slow statistics update: ${updateTime.toFixed(2)}ms`);
        }
    }
    
    /**
     * Get current statistics
     * @returns {Object} Current statistics object
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Get performance metrics
     * @returns {Object} Performance metrics object
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    
    /**
     * Reset statistics to zero
     * Useful for initialization or error states
     */
    resetStats() {
        this.stats = {
            total: 0,
            visible: 0,
            withPhotos: 0
        };
        
        this.renderStats();
        console.log('Statistics reset');
    }
    
    /**
     * Calculate additional derived statistics
     * @returns {Object} Additional calculated metrics
     */
    getDerivedStats() {
        const derived = {
            coveragePercentage: this.stats.total > 0 ? 
                ((this.stats.withPhotos / this.stats.total) * 100).toFixed(1) : 0,
            filterEfficiency: this.stats.total > 0 ? 
                ((this.stats.visible / this.stats.total) * 100).toFixed(1) : 0,
            photosRatio: this.stats.visible > 0 ? 
                ((this.stats.withPhotos / this.stats.visible) * 100).toFixed(1) : 0
        };
        
        return derived;
    }
    
    /**
     * Export statistics for external use
     * @returns {Object} Complete statistics export
     */
    exportStats() {
        return {
            stats: this.getStats(),
            derived: this.getDerivedStats(),
            performance: this.getPerformanceMetrics(),
            timestamp: new Date().toISOString()
        };
    }
}

// Export for use in main application
window.StatisticsDashboard = StatisticsDashboard;
