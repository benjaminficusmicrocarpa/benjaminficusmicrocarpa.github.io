/**
 * Image Modal Class
 * Handles modal display, navigation, and user interactions
 */
class ImageModal {
    constructor() {
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalClose = document.getElementById('modalClose');
        this.modalPrev = document.getElementById('modalPrev');
        this.modalNext = document.getElementById('modalNext');
        this.modalCounter = document.getElementById('modalCounter');
        this.modalDescription = document.getElementById('modalDescription');
        
        this.images = [];
        this.currentIndex = 0;
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize modal functionality
     */
    init() {
        try {
            this.collectImages();
            this.bindEvents();
            this.isInitialized = true;
            console.log(`ImageModal initialized with ${this.images.length} images`);
        } catch (error) {
            console.error('Failed to initialize ImageModal:', error);
        }
    }
    
    /**
     * Collect all clickable images from the document
     */
    collectImages() {
        const imageContainers = document.querySelectorAll('[data-modal-image]');
        
        imageContainers.forEach((container, index) => {
            const imageData = {
                src: container.dataset.modalImage,
                title: container.dataset.modalTitle || `Image ${index + 1}`,
                description: container.dataset.modalDescription || '',
                element: container
            };
            
            this.images.push(imageData);
            
            // Add click event listener
            container.addEventListener('click', () => {
                this.openModal(index);
            });
            
            // Add keyboard accessibility
            container.setAttribute('tabindex', '0');
            container.setAttribute('role', 'button');
            container.setAttribute('aria-label', `View ${imageData.title}`);
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openModal(index);
                }
            });
        });
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Close button
        this.modalClose?.addEventListener('click', () => this.closeModal());
        
        // Navigation buttons
        this.modalPrev?.addEventListener('click', () => this.prevImage());
        this.modalNext?.addEventListener('click', () => this.nextImage());
        
        // Close on backdrop click
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Touch/swipe support
        this.bindTouchEvents();
        
        // Prevent context menu on modal
        this.modal?.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    /**
     * Handle keyboard events
     */
    handleKeydown(e) {
        if (!this.modal?.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextImage();
                break;
            case 'Home':
                e.preventDefault();
                this.goToImage(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToImage(this.images.length - 1);
                break;
        }
    }
    
    /**
     * Bind touch/swipe events for mobile devices
     */
    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.modal?.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });
        
        this.modal?.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const diffTime = endTime - startTime;
            
            // Only handle quick swipes
            if (diffTime > 500) return;
            
            // Only handle horizontal swipes with sufficient distance
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                e.preventDefault();
                if (diffX > 0) {
                    this.nextImage(); // Swipe left = next image
                } else {
                    this.prevImage(); // Swipe right = previous image
                }
            }
            
            // Reset values
            startX = 0;
            startY = 0;
            startTime = 0;
        }, { passive: false });
    }
    
    /**
     * Open modal with specific image
     */
    openModal(index) {
        if (!this.isInitialized || index < 0 || index >= this.images.length) {
            console.error('Invalid image index or modal not initialized');
            return;
        }
        
        this.currentIndex = index;
        this.updateModal();
        this.modal?.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus management for accessibility
        this.modalClose?.focus();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
        
        // Track opening for analytics (if needed)
        this.trackEvent('modal_open', { image_index: index });
    }
    
    /**
     * Close modal
     */
    closeModal() {
        this.modal?.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Return focus to the clicked element
        const currentImageElement = this.images[this.currentIndex]?.element;
        currentImageElement?.focus();
        
        this.trackEvent('modal_close', { image_index: this.currentIndex });
    }
    
    /**
     * Navigate to previous image
     */
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
        this.preloadAdjacentImages();
        this.trackEvent('modal_navigate', { direction: 'prev', image_index: this.currentIndex });
    }
    
    /**
     * Navigate to next image
     */
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModal();
        this.preloadAdjacentImages();
        this.trackEvent('modal_navigate', { direction: 'next', image_index: this.currentIndex });
    }
    
    /**
     * Go to specific image
     */
    goToImage(index) {
        if (index >= 0 && index < this.images.length) {
            this.currentIndex = index;
            this.updateModal();
            this.preloadAdjacentImages();
        }
    }
    
    /**
     * Update modal content
     */
    updateModal() {
        const currentImage = this.images[this.currentIndex];
        if (!currentImage) return;
        
        // Update image
        if (this.modalImage) {
            this.modalImage.src = currentImage.src;
            this.modalImage.alt = currentImage.description;
            
            // Add loading state
            this.modalImage.classList.add('loading');
            
            this.modalImage.onload = () => {
                this.modalImage.classList.remove('loading');
            };
            
            this.modalImage.onerror = () => {
                console.error('Failed to load modal image:', currentImage.src);
                this.modalImage.classList.remove('loading');
            };
        }
        
        // Update counter
        if (this.modalCounter) {
            this.modalCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
        }
        
        // Update description
        if (this.modalDescription) {
            this.modalDescription.textContent = currentImage.description;
        }
        
        // Update navigation button states
        const hasPrev = this.images.length > 1;
        const hasNext = this.images.length > 1;
        
        if (this.modalPrev) {
            this.modalPrev.style.opacity = hasPrev ? '1' : '0.5';
            this.modalPrev.disabled = !hasPrev;
        }
        
        if (this.modalNext) {
            this.modalNext.style.opacity = hasNext ? '1' : '0.5';
            this.modalNext.disabled = !hasNext;
        }
    }
    
    /**
     * Preload adjacent images for smooth navigation
     */
    preloadAdjacentImages() {
        const prevIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const nextIndex = (this.currentIndex + 1) % this.images.length;
        
        [prevIndex, nextIndex].forEach(index => {
            if (index !== this.currentIndex && this.images[index]) {
                const img = new Image();
                img.src = this.images[index].src;
            }
        });
    }
    
    /**
     * Track events for analytics (placeholder)
     */
    trackEvent(eventName, eventData) {
        // Implement analytics tracking here if needed
        console.log(`Event: ${eventName}`, eventData);
    }
    
    /**
     * Destroy modal instance
     */
    destroy() {
        // Remove all event listeners and clean up
        this.images.forEach(imageData => {
            imageData.element?.removeEventListener('click', this.openModal);
        });
        
        document.removeEventListener('keydown', this.handleKeydown);
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageModal;
}
