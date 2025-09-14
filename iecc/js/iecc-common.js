/**
 * IECC Sermon Common JavaScript Functions
 * Shared JavaScript functionality for all sermon pages
 */

const IECCComponents = {
    /**
     * Initialize all components
     */
    init: function() {
        this.initTabs();
        this.initAccordions();
        this.initCollapsibles();
        this.initModals();
        this.initTooltips();
        this.initProgressBars();
        this.initKeyboardNavigation();
        this.initSmoothScrolling();
    },

    /**
     * Tab functionality
     */
    initTabs: function() {
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Remove active class from all tabs and content
                document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    },

    /**
     * Accordion functionality
     */
    initAccordions: function() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('span');
                
                // Toggle active state
                this.classList.toggle('active');
                content.classList.toggle('active');
                
                // Update icon
                if (icon) {
                    icon.textContent = content.classList.contains('active') ? '-' : '+';
                }
            });
        });
    },

    /**
     * Collapsible functionality
     */
    initCollapsibles: function() {
        document.querySelectorAll('.collapsible-header').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('span');
                
                // Toggle active state
                content.classList.toggle('active');
                
                // Update icon
                if (icon) {
                    icon.textContent = content.classList.contains('active') ? '▲' : '▼';
                }
            });
        });
    },

    /**
     * Modal functionality
     */
    initModals: function() {
        // Global modal functions
        window.openModal = function(title, content) {
            const modal = document.getElementById('contextModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');
            
            if (modal && modalTitle && modalContent) {
                modalTitle.textContent = title;
                modalContent.innerHTML = content;
                modal.style.display = 'block';
            }
        };

        window.closeModal = function() {
            const modal = document.getElementById('contextModal');
            if (modal) {
                modal.style.display = 'none';
            }
        };

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('contextModal');
            if (event.target === modal) {
                window.closeModal();
            }
        };
    },

    /**
     * Enhanced tooltip functionality
     */
    initTooltips: function() {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            const content = tooltip.querySelector('.tooltip-content');
            
            if (content) {
                tooltip.addEventListener('mouseenter', function() {
                    const rect = tooltip.getBoundingClientRect();
                    const contentRect = content.getBoundingClientRect();
                    
                    // Adjust positioning if tooltip would go off screen
                    if (rect.left + contentRect.width > window.innerWidth) {
                        content.style.left = 'auto';
                        content.style.right = '0';
                        content.style.transform = 'translateX(0)';
                    }
                    
                    if (rect.top - contentRect.height < 0) {
                        content.style.bottom = 'auto';
                        content.style.top = '125%';
                    }
                });
            }
        });
    },

    /**
     * Progress bar animation
     */
    initProgressBars: function() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        bar.style.transition = 'width 2s ease';
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.chart-container').forEach(chart => {
            observer.observe(chart);
        });
    },

    /**
     * Keyboard navigation support
     */
    initKeyboardNavigation: function() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                window.closeModal();
            }
        });
    },

    /**
     * Smooth scrolling
     */
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Initialize all components after page load
document.addEventListener('DOMContentLoaded', function() {
    IECCComponents.init();
});
