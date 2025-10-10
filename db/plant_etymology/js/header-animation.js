/**
 * Header Animation
 * Handles background image animation for the Plant Etymology Database header
 */

class HeaderAnimation {
    constructor() {
        this.backgrounds = [];
        this.currentIndex = 0;
        this.animationInterval = null;
        this.animationDuration = 6000; // 6 seconds per image
    }

    /**
     * Initialize header background animation
     */
    init() {
        this.backgrounds = document.querySelectorAll('.header-bg');
        
        if (this.backgrounds.length === 0) {
            console.warn('No header background elements found');
            return;
        }

        // Show first background
        this.showBackground(0);
        
        // Start animation cycle
        this.startAnimation();
    }

    /**
     * Start the background animation cycle
     */
    startAnimation() {
        if (this.backgrounds.length <= 1) {
            return; // No need to animate if there's only one or no backgrounds
        }

        this.animationInterval = setInterval(() => {
            this.nextBackground();
        }, this.animationDuration);
    }

    /**
     * Stop the background animation
     */
    stopAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Move to the next background
     */
    nextBackground() {
        this.hideCurrentBackground();
        this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
        this.showBackground(this.currentIndex);
    }

    /**
     * Show background at specified index
     * @param {number} index - Index of the background to show
     */
    showBackground(index) {
        if (index >= 0 && index < this.backgrounds.length) {
            this.backgrounds[index].classList.add('active');
        }
    }

    /**
     * Hide the current background
     */
    hideCurrentBackground() {
        if (this.currentIndex >= 0 && this.currentIndex < this.backgrounds.length) {
            this.backgrounds[this.currentIndex].classList.remove('active');
        }
    }

    /**
     * Go to a specific background
     * @param {number} index - Index of the background to show
     */
    goToBackground(index) {
        if (index >= 0 && index < this.backgrounds.length) {
            this.hideCurrentBackground();
            this.currentIndex = index;
            this.showBackground(this.currentIndex);
        }
    }

    /**
     * Get current background index
     * @returns {number} Current background index
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * Get total number of backgrounds
     * @returns {number} Total number of backgrounds
     */
    getTotalBackgrounds() {
        return this.backgrounds.length;
    }

    /**
     * Set animation duration
     * @param {number} duration - Duration in milliseconds
     */
    setAnimationDuration(duration) {
        this.animationDuration = duration;
        
        // Restart animation with new duration
        if (this.animationInterval) {
            this.stopAnimation();
            this.startAnimation();
        }
    }

    /**
     * Destroy the animation and clean up
     */
    destroy() {
        this.stopAnimation();
        this.backgrounds = [];
        this.currentIndex = 0;
    }
}

// Export for use in other modules
window.HeaderAnimation = HeaderAnimation;
