// Fresh Start: See Clearer - Custom JavaScript

// Initialize animations and wiping header
document.addEventListener('DOMContentLoaded', function() {
    // Trigger fade-in animations
    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Wiping Header Functionality
    const headerContainer = document.getElementById('headerContainer');
    const headerText = document.getElementById('headerText');
    
    const maxHeaderHeight = 400;
    const minHeaderHeight = 100;
    const scrollRange = maxHeaderHeight - minHeaderHeight; // 300px of scroll range
    
    let isScrolling = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        // Calculate header height: 1:1 relationship with scroll
        // Header starts shrinking immediately as user scrolls
        const currentHeight = Math.max(maxHeaderHeight - scrollY, minHeaderHeight);
        
        headerContainer.style.height = currentHeight + 'px';
        
        // Keep text visible but fade out subtitle and buttons
        headerText.style.opacity = '1';
        
        if (currentHeight <= minHeaderHeight) {
            headerContainer.classList.add('header-minimized');
        } else {
            headerContainer.classList.remove('header-minimized');
        }
        
        isScrolling = false;
    }
    
    function onScroll() {
        if (!isScrolling) {
            requestAnimationFrame(updateHeader);
            isScrolling = true;
        }
    }
    
    // Throttled scroll event listener
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Initial call to set correct state
    updateHeader();
    
    // Handle resize events
    window.addEventListener('resize', function() {
        updateHeader();
    }, { passive: true });

    // Tab Navigation Functionality
    const tabButtons = document.querySelectorAll('[data-tab-trigger]');
    const tabContents = document.querySelectorAll('[data-tab-content]');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab-trigger');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show target content
            const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });

    // Accordion Functionality
    const accordionTriggers = document.querySelectorAll('[data-accordion-trigger]');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-accordion-trigger');
            const content = document.querySelector(`[data-accordion-content="${targetId}"]`);
            const icon = trigger.querySelector('.accordion-icon');
            
            if (content) {
                const isActive = content.classList.contains('active');
                
                // Close all accordions
                document.querySelectorAll('[data-accordion-content]').forEach(acc => {
                    acc.classList.remove('active');
                });
                document.querySelectorAll('[data-accordion-trigger]').forEach(trig => {
                    trig.classList.remove('active');
                });
                
                // Open clicked accordion if it wasn't active
                if (!isActive) {
                    content.classList.add('active');
                    trigger.classList.add('active');
                }
            }
        });
    });

    // Collapsible Functionality
    const collapsibleTriggers = document.querySelectorAll('[data-collapsible-trigger]');
    collapsibleTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-collapsible-trigger');
            const content = document.querySelector(`[data-collapsible-content="${targetId}"]`);
            
            if (content) {
                content.classList.toggle('active');
            }
        });
    });

    // Modal Functionality
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modalCloses = document.querySelectorAll('[data-modal-close]');
    const modals = document.querySelectorAll('[data-modal]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-trigger');
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            if (modal) {
                // Get content and title from trigger button
                const content = trigger.getAttribute('data-modal-content');
                const title = trigger.getAttribute('data-modal-title');
                
                // Update modal content
                const modalContent = modal.querySelector('[data-modal-content]');
                const modalTitle = modal.querySelector('[data-modal-title]');
                
                if (modalContent && content) {
                    modalContent.innerHTML = content;
                }
                if (modalTitle && title) {
                    modalTitle.textContent = title;
                }
                
                modal.classList.add('active');
            }
        });
    });

    modalCloses.forEach(close => {
        close.addEventListener('click', () => {
            const modalId = close.getAttribute('data-modal-close');
            const modal = document.querySelector(`[data-modal="${modalId}"]`);
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modals when clicking overlay
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Add smooth scrolling for any internal links
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
});
