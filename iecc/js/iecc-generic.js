/* Generic JavaScript - Reusable functionality across different sermon pages */

// Tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.add('active');
            
            // Scroll to top of content
            targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Accordion functionality
function initializeAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Close all accordions in the same container
            const container = this.closest('.content-card');
            container.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current accordion
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
        
        // Keyboard support
        header.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Collapsible functionality
function initializeCollapsibles() {
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('span');
            
            content.classList.toggle('active');
            if (icon) {
                icon.style.transform = content.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initializeModals() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Keyboard support for modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// Smooth scrolling for internal links
function initializeSmoothScrolling() {
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

// Mobile tooltip handling
function initializeMobileTooltips() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.addEventListener('click', function(e) {
                e.preventDefault();
                const content = this.querySelector('.tooltip-content');
                const isVisible = content.style.opacity === '1';
                
                // Hide all other tooltips
                document.querySelectorAll('.tooltip-content').forEach(tc => {
                    tc.style.opacity = '0';
                    tc.style.visibility = 'hidden';
                });
                
                // Show current tooltip if it wasn't visible
                if (!isVisible) {
                    content.style.opacity = '1';
                    content.style.visibility = 'visible';
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        content.style.opacity = '0';
                        content.style.visibility = 'hidden';
                    }, 3000);
                }
            });
        });
    }
}

// Intersection Observer for animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.bento-item, .content-card, .bible-verse, .author-quote').forEach(el => {
        observer.observe(el);
    });
}

// Mindmap animations
function initializeMindmapAnimations() {
    const mindmapNodes = document.querySelectorAll('.branch-node');
    
    mindmapNodes.forEach((node, index) => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            node.style.transition = 'all 0.6s ease';
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Mobile mindmap popup handling
function initializeMobileMindmapPopups() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.sub-node').forEach(node => {
            node.addEventListener('click', function(e) {
                e.stopPropagation();
                const popup = this.querySelector('.detail-popup');
                
                // Hide other popups
                document.querySelectorAll('.detail-popup').forEach(p => {
                    if (p !== popup) {
                        p.style.opacity = '0';
                        p.style.visibility = 'hidden';
                    }
                });
                
                // Toggle current popup
                const isVisible = popup.style.opacity === '1';
                popup.style.opacity = isVisible ? '0' : '1';
                popup.style.visibility = isVisible ? 'hidden' : 'visible';
                
                // Auto-hide after 4 seconds
                if (!isVisible) {
                    setTimeout(() => {
                        popup.style.opacity = '0';
                        popup.style.visibility = 'hidden';
                    }, 4000);
                }
            });
        });
        
        // Close popups when clicking outside
        document.addEventListener('click', function() {
            document.querySelectorAll('.detail-popup').forEach(popup => {
                popup.style.opacity = '0';
                popup.style.visibility = 'hidden';
            });
        });
    }
}

// Initialize all generic functionality
function initializeGenericFeatures() {
    // Initialize core features
    initializeTabs();
    initializeAccordions();
    initializeCollapsibles();
    initializeModals();
    initializeSmoothScrolling();
    initializeMobileTooltips();
    initializeScrollAnimations();
    
    // Initialize mindmap features when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeMindmapAnimations();
            initializeMobileMindmapPopups();
        });
    } else {
        initializeMindmapAnimations();
        initializeMobileMindmapPopups();
    }
}

// Auto-initialize when script loads
initializeGenericFeatures();

// Export functions for external use
window.SermonUtils = {
    openModal,
    closeModal,
    initializeTabs,
    initializeAccordions,
    initializeCollapsibles,
    initializeModals,
    initializeSmoothScrolling,
    initializeMobileTooltips,
    initializeScrollAnimations,
    initializeMindmapAnimations,
    initializeMobileMindmapPopups
};
