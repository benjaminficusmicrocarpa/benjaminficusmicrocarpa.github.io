/**
 * Main Application Controller
 * Initializes all components and handles global functionality
 */
class AgricultureApp {
    constructor() {
        this.modal = null;
        this.animations = null;
        this.isInitialized = false;
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('Initializing Agriculture Ethanol Infographic...');
            
            // Initialize core components
            await this.initComponents();
            
            // Setup image loading handlers
            this.setupImageHandlers();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup error handling
            this.setupErrorHandling();
            
            this.isInitialized = true;
            console.log('Agriculture app initialized successfully');
            
            // Dispatch custom event for other scripts
            document.dispatchEvent(new CustomEvent('agricultureAppReady', {
                detail: { app: this }
            }));
            
        } catch (error) {
            console.error('Failed to initialize Agriculture app:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Initialize core components
     */
    async initComponents() {
        // Initialize modal
        if (typeof ImageModal !== 'undefined') {
            this.modal = new ImageModal();
        } else {
            console.warn('ImageModal class not found');
        }
        
        // Initialize animations
        if (typeof AnimationController !== 'undefined') {
            this.animations = new AnimationController();
        } else {
            console.warn('AnimationController class not found');
        }
        
        // Initialize other features
        this.initAccessibilityFeatures();
        this.initThemeSupport();
    }
    
    /**
     * Setup image loading handlers
     */
    setupImageHandlers() {
        const images = document.querySelectorAll('.screenshot-image, .mechanism-image');
        
        images.forEach(img => {
            // Loading completion handler
            img.addEventListener('load', (e) => {
                this.handleImageLoad(e.target);
            });
            
            // Error handler
            img.addEventListener('error', (e) => {
                this.handleImageError(e.target);
            });
            
            // Lazy loading optimization
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            } else {
                this.implementIntersectionObserverLazyLoading(img);
            }
        });
    }
    
    /**
     * Handle successful image load
     */
    handleImageLoad(img) {
        img.classList.add('screenshot-image-loaded');
        
        // Hide loading placeholder
        const container = img.closest('.screenshot-image-container, .mechanism-image-container');
        const loadingElement = container?.querySelector('.screenshot-image-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Trigger any post-load animations
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            img.style.opacity = '1';
        }, 50);
    }
    
    /**
     * Handle image loading error
     */
    handleImageError(img) {
        console.warn('Image failed to load:', img.src);
        
        const container = img.closest('.screenshot-image-container, .mechanism-image-container');
        const loadingElement = container?.querySelector('.screenshot-image-loading');
        
        if (loadingElement) {
            loadingElement.innerHTML = '⚠️';
            loadingElement.style.color = '#ff6b6b';
            loadingElement.title = 'Image failed to load';
        }
        
        // Add error class for styling
        container?.classList.add('image-error');
    }
    
    /**
     * Implement lazy loading for older browsers
     */
    implementIntersectionObserverLazyLoading(img) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src;
                    imageObserver.unobserve(lazyImage);
                }
            });
        });
        
        imageObserver.observe(img);
    }
    
    /**
     * Initialize accessibility features
     */
    initAccessibilityFeatures() {
        // Skip link for keyboard navigation
        this.addSkipLink();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA labels and descriptions
        this.enhanceAriaLabels();
        
        // High contrast mode detection
        this.detectHighContrastMode();
    }
    
    /**
     * Add skip link for keyboard users
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const mainContent = document.querySelector('.content');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }
    
    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Focus visible polyfill for older browsers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
    
    /**
     * Enhance ARIA labels
     */
    enhanceAriaLabels() {
        // Add ARIA labels to stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const number = card.querySelector('.stat-number')?.textContent;
            const description = card.querySelector('p')?.textContent;
            if (number && description) {
                card.setAttribute('aria-label', `統計: ${number} - ${description}`);
            }
        });
        
        // Add ARIA labels to comparison items
        const comparisonItems = document.querySelectorAll('.comparison-item');
        comparisonItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent;
            if (title) {
                item.setAttribute('aria-label', `比較項目: ${title}`);
            }
        });
    }
    
    /**
     * Detect high contrast mode
     */
    detectHighContrastMode() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-contrast: high)');
            
            const handleContrastChange = (e) => {
                if (e.matches) {
                    document.body.classList.add('high-contrast');
                } else {
                    document.body.classList.remove('high-contrast');
                }
            };
            
            mediaQuery.addListener(handleContrastChange);
            handleContrastChange(mediaQuery);
        }
    }
    
    /**
     * Initialize theme support
     */
    initThemeSupport() {
        // Detect system theme preference
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleThemeChange = (e) => {
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
            };
            
            darkModeQuery.addListener(handleThemeChange);
            handleThemeChange(darkModeQuery);
        }
        
        // Detect reduced motion preference
        if (window.matchMedia) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            const handleMotionChange = (e) => {
                if (e.matches) {
                    document.body.classList.add('reduced-motion');
                    // Disable animations if user prefers reduced motion
                    this.disableAnimations();
                } else {
                    document.body.classList.remove('reduced-motion');
                }
            };
            
            reducedMotionQuery.addListener(handleMotionChange);
            handleMotionChange(reducedMotionQuery);
        }
    }
    
    /**
     * Disable animations for accessibility
     */
    disableAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor loading performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Page load time: ${loadTime}ms`);
                    
                    // Log performance metrics
                    this.logPerformanceMetrics();
                }, 0);
            });
        }
        
        // Monitor memory usage if available
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }
    
    /**
     * Log performance metrics
     */
    logPerformanceMetrics() {
        if ('getEntriesByType' in performance) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const paintEntries = performance.getEntriesByType('paint');
            
            console.group('Performance Metrics');
            console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd);
            console.log('Load Complete:', navigation.loadEventEnd);
            
            paintEntries.forEach(entry => {
                console.log(`${entry.name}:`, entry.startTime);
            });
            console.groupEnd();
        }
    }
    
    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.handleGlobalError(e.error);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.handleGlobalError(e.reason);
        });
    }
    
    /**
     * Handle global errors
     */
    handleGlobalError(error) {
        // Log error details
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        // Show user-friendly error message if needed
        if (this.isInitialized) {
            this.showErrorMessage('申し訳ございませんが、技術的な問題が発生しました。ページを再読み込みしてください。');
        }
    }
    
    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
        `;
        errorMessage.textContent = 'アプリケーションの初期化に失敗しました。ページを再読み込みしてください。';
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 10000);
    }
    
    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            font-size: 14px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
    
    /**
     * Public API for external access
     */
    getModal() {
        return this.modal;
    }
    
    getAnimationController() {
        return this.animations;
    }
    
    /**
     * Cleanup and destroy the app
     */
    destroy() {
        if (this.modal) {
            this.modal.destroy();
        }
        
        if (this.animations) {
            this.animations.destroy();
        }
        
        this.isInitialized = false;
    }
}

// Initialize the application
const agricultureApp = new AgricultureApp();

// Make it globally available
window.AgricultureApp = agricultureApp;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgricultureApp;
}
