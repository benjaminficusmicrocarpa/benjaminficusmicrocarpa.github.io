/**
 * Animation Controller
 * Handles number animations, card animations, and scroll effects
 */
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Initialize all animations
     */
    init() {
        try {
            this.initNumberAnimations();
            this.initCardAnimations();
            this.initScrollAnimations();
            this.isInitialized = true;
            console.log('AnimationController initialized');
        } catch (error) {
            console.error('Failed to initialize AnimationController:', error);
        }
    }
    
    /**
     * Initialize number counter animations
     */
    initNumberAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const numberObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateNumber(entry.target);
                    this.animatedElements.add(entry.target);
                    numberObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-50px 0px'
        });
        
        statNumbers.forEach(element => {
            numberObserver.observe(element);
        });
        
        this.observers.set('numbers', numberObserver);
    }
    
    /**
     * Animate number counting up
     */
    animateNumber(element) {
        const text = element.textContent.trim();
        let targetValue, suffix;
        
        // Parse the target value and suffix
        if (text.includes('°C')) {
            targetValue = parseFloat(text);
            suffix = '°C';
        } else if (text.includes('%')) {
            targetValue = parseInt(text);
            suffix = '%';
        } else if (text.includes('種類')) {
            targetValue = parseInt(text);
            suffix = '種類';
        } else if (text.includes('日間')) {
            targetValue = parseInt(text);
            suffix = '日間';
        } else if (text.includes('倍')) {
            targetValue = parseInt(text);
            suffix = '倍';
        } else {
            targetValue = parseFloat(text) || 0;
            suffix = '';
        }
        
        this.countUp(element, 0, targetValue, suffix, 1500);
    }
    
    /**
     * Count up animation with easing
     */
    countUp(element, start, end, suffix, duration) {
        const startTime = performance.now();
        const change = end - start;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = start + (change * easeOut);
            
            // Format the number based on suffix
            let displayValue;
            if (suffix === '°C') {
                displayValue = current.toFixed(1) + suffix;
            } else if (suffix === '%' || suffix === '種類' || suffix === '日間' || suffix === '倍') {
                displayValue = Math.round(current) + suffix;
            } else {
                displayValue = Math.round(current) + suffix;
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    /**
     * Initialize card animations
     */
    initCardAnimations() {
        const cards = document.querySelectorAll('.screenshot-card, .stat-card, .mechanism-image-card');
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateCard(entry.target);
                    this.animatedElements.add(entry.target);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-20px 0px'
        });
        
        cards.forEach(card => {
            cardObserver.observe(card);
        });
        
        this.observers.set('cards', cardObserver);
    }
    
    /**
     * Animate card entrance
     */
    animateCard(card) {
        // Add fadeInUp animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Small delay for staggered effect
        const delay = Array.from(card.parentElement.children).indexOf(card) * 100;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    }
    
    /**
     * Initialize scroll-based animations
     */
    initScrollAnimations() {
        const sections = document.querySelectorAll('.section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                    this.animateSection(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
        
        this.observers.set('sections', sectionObserver);
    }
    
    /**
     * Animate section elements
     */
    animateSection(section) {
        const title = section.querySelector('h2');
        const content = section.querySelectorAll('.screenshot-grid, .stats-grid, .comparison, .highlight-box');
        
        // Animate title
        if (title && !this.animatedElements.has(title)) {
            title.style.opacity = '0';
            title.style.transform = 'translateX(-20px)';
            title.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateX(0)';
            }, 100);
            
            this.animatedElements.add(title);
        }
        
        // Animate content with stagger
        content.forEach((element, index) => {
            if (!this.animatedElements.has(element)) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 200 + (index * 150));
                
                this.animatedElements.add(element);
            }
        });
    }
    
    /**
     * Add parallax effect to heat waves
     */
    initParallaxEffects() {
        const heatWaves = document.querySelectorAll('.heat-wave');
        
        if (!heatWaves.length) return;
        
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            heatWaves.forEach((wave, index) => {
                const speed = 0.5 + (index * 0.2);
                wave.style.transform = `translateY(${rate * speed}px)`;
            });
        };
        
        // Throttle scroll events
        let ticking = false;
        const scrollListener = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', scrollListener, { passive: true });
    }
    
    /**
     * Animate harvest bars
     */
    animateHarvestBars() {
        const harvestBars = document.querySelectorAll('.harvest-bar-fill');
        
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateBar(entry.target);
                    this.animatedElements.add(entry.target);
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        harvestBars.forEach(bar => {
            barObserver.observe(bar);
        });
    }
    
    /**
     * Animate progress bar
     */
    animateBar(bar) {
        const originalWidth = bar.style.width || '100%';
        bar.style.width = '0%';
        bar.style.transition = 'width 1s ease-out';
        
        setTimeout(() => {
            bar.style.width = originalWidth;
        }, 100);
    }
    
    /**
     * Cleanup all observers
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animatedElements.clear();
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}
