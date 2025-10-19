/**
 * Header Animation Manager
 * Handles animated background images in the header section
 */

class HeaderAnimation {
    constructor() {
        this.backgrounds = [];
        this.currentIndex = 0;
        this.animationInterval = null;
        this.animationDuration = 5000; // 5 seconds per image
        this.fadeDuration = 2000; // 2 seconds fade transition
        this.isInitialized = false;
    }

    /**
     * Initialize the header animation
     */
    init() {
        if (this.isInitialized) {
            console.warn('Header animation already initialized');
            return;
        }

        try {
            this.setupBackgrounds();
            this.startAnimation();
            this.isInitialized = true;
            console.log('Header animation initialized successfully');
        } catch (error) {
            console.error('Failed to initialize header animation:', error);
        }
    }

    /**
     * Setup background elements
     */
    setupBackgrounds() {
        const header = document.querySelector('.header');
        if (!header) {
            console.warn('Header element not found');
            return;
        }

        // Get all background elements
        this.backgrounds = Array.from(header.querySelectorAll('.header-bg'));
        
        if (this.backgrounds.length === 0) {
            console.warn('No background elements found');
            return;
        }

        // Set initial state
        this.backgrounds.forEach((bg, index) => {
            bg.style.opacity = index === 0 ? '1' : '0';
            bg.style.transform = index === 0 ? 'scale(1.05)' : 'scale(1)';
        });

        // Set first background as active
        if (this.backgrounds[0]) {
            this.backgrounds[0].classList.add('active');
        }
    }

    /**
     * Start the animation cycle
     */
    startAnimation() {
        if (this.backgrounds.length <= 1) {
            console.log('Not enough backgrounds for animation');
            return;
        }

        // Clear any existing interval
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        // Start the animation cycle
        this.animationInterval = setInterval(() => {
            this.nextBackground();
        }, this.animationDuration);
    }

    /**
     * Move to the next background
     */
    nextBackground() {
        if (this.backgrounds.length <= 1) return;

        // Remove active class from current background
        this.backgrounds[this.currentIndex].classList.remove('active');
        this.backgrounds[this.currentIndex].style.opacity = '0';
        this.backgrounds[this.currentIndex].style.transform = 'scale(1)';

        // Move to next background
        this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;

        // Add active class to new background
        this.backgrounds[this.currentIndex].classList.add('active');
        this.backgrounds[this.currentIndex].style.opacity = '1';
        this.backgrounds[this.currentIndex].style.transform = 'scale(1.05)';
    }

    /**
     * Pause the animation
     */
    pause() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    /**
     * Resume the animation
     */
    resume() {
        if (!this.animationInterval && this.backgrounds.length > 1) {
            this.startAnimation();
        }
    }

    /**
     * Set animation duration
     * @param {number} duration - Duration in milliseconds
     */
    setAnimationDuration(duration) {
        this.animationDuration = duration;
        if (this.animationInterval) {
            this.pause();
            this.resume();
        }
    }

    /**
     * Set fade duration
     * @param {number} duration - Fade duration in milliseconds
     */
    setFadeDuration(duration) {
        this.fadeDuration = duration;
    }

    /**
     * Go to specific background
     * @param {number} index - Background index
     */
    goToBackground(index) {
        if (index < 0 || index >= this.backgrounds.length) {
            console.warn('Invalid background index:', index);
            return;
        }

        // Remove active class from current background
        this.backgrounds[this.currentIndex].classList.remove('active');
        this.backgrounds[this.currentIndex].style.opacity = '0';
        this.backgrounds[this.currentIndex].style.transform = 'scale(1)';

        // Set new current index
        this.currentIndex = index;

        // Add active class to new background
        this.backgrounds[this.currentIndex].classList.add('active');
        this.backgrounds[this.currentIndex].style.opacity = '1';
        this.backgrounds[this.currentIndex].style.transform = 'scale(1.05)';
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
    getBackgroundCount() {
        return this.backgrounds.length;
    }

    /**
     * Check if animation is running
     * @returns {boolean} True if animation is running
     */
    isRunning() {
        return this.animationInterval !== null;
    }

    /**
     * Handle visibility change (pause when tab is not visible)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate positions if needed
        // This is a placeholder for any resize-specific logic
    }

    /**
     * Destroy the animation and clean up
     */
    destroy() {
        this.pause();
        this.backgrounds = [];
        this.currentIndex = 0;
        this.isInitialized = false;
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Restart the animation
     */
    restart() {
        this.destroy();
        this.init();
    }
}

// Initialize header animation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global instance
    window.headerAnimation = new HeaderAnimation();
    window.headerAnimation.init();

    // Add visibility change listener to pause/resume animation
    document.addEventListener('visibilitychange', () => {
        if (window.headerAnimation) {
            window.headerAnimation.handleVisibilityChange();
        }
    });

    // Add resize listener
    window.addEventListener('resize', () => {
        if (window.headerAnimation) {
            window.headerAnimation.handleResize();
        }
    });
});

// Export for use in other modules
window.HeaderAnimation = HeaderAnimation;
