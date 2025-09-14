/* Anger Management Sermon - Enhanced Interactivity */

// Theme-specific initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeAngerManagementFeatures();
});

function initializeAngerManagementFeatures() {
    // Initialize chart tooltips
    initializeChartTooltips();
    
    // Initialize verse modals with enhanced features
    initializeVerseModals();
    
    // Initialize reflection question interactions
    initializeReflectionQuestions();
    
    // Initialize personal story timeline
    initializeStoryTimeline();
    
    // Initialize gentle animations
    initializeGentleAnimations();
    
    // Initialize pastoral warm interactions
    initializePastoralFeatures();
}

// Chart tooltip functionality
function initializeChartTooltips() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach(bar => {
        const tooltip = bar.getAttribute('data-tooltip');
        if (tooltip) {
            bar.addEventListener('mouseenter', function(e) {
                showChartTooltip(e, tooltip);
            });
            
            bar.addEventListener('mouseleave', function() {
                hideChartTooltip();
            });
            
            // Mobile tap support
            bar.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    showChartTooltip(e, tooltip);
                    setTimeout(hideChartTooltip, 3000);
                }
            });
        }
    });
}

function showChartTooltip(event, text) {
    // Remove existing tooltip
    hideChartTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: linear-gradient(135deg, #2c5f2d 0%, #658a46 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        max-width: 250px;
        z-index: 2000;
        box-shadow: 0 8px 25px rgba(44, 95, 45, 0.3);
        border: 2px solid #97bc62;
        line-height: 1.4;
        font-family: Georgia, serif;
    `;
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = tooltip.getBoundingClientRect();
    const x = Math.min(event.clientX, window.innerWidth - rect.width - 20);
    const y = Math.max(20, event.clientY - rect.height - 10);
    
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Fade in
    tooltip.style.opacity = '0';
    setTimeout(() => {
        tooltip.style.transition = 'opacity 0.3s ease';
        tooltip.style.opacity = '1';
    }, 10);
}

function hideChartTooltip() {
    const existing = document.querySelector('.chart-tooltip');
    if (existing) {
        existing.style.opacity = '0';
        setTimeout(() => {
            if (existing.parentNode) {
                existing.parentNode.removeChild(existing);
            }
        }, 300);
    }
}

// Enhanced verse modals with contextual information
function initializeVerseModals() {
    // Add close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// Reflection questions interactivity
function initializeReflectionQuestions() {
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach((item, index) => {
        // Add gentle hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'all 0.3s ease';
            this.style.borderLeftWidth = '8px';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.borderLeftWidth = '5px';
        });
        
        // Add staggered animation on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });
        
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// Story timeline enhancements
function initializeStoryTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.3s ease';
            this.style.background = 'rgba(151, 188, 98, 0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'transparent';
        });
        
        // Progressive reveal animation
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 300);
                }
            });
        }, { threshold: 0.5 });
        
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.8s ease';
        observer.observe(item);
    });
}

// Gentle animations for peaceful theme
function initializeGentleAnimations() {
    // Breathing animation for central elements
    const breathingElements = document.querySelectorAll('.bento-item h3, .content-card h2');
    
    breathingElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animation = 'gentleBreath 2s ease-in-out infinite';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
    
    // Add gentle breath animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gentleBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        @keyframes gentleGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(151, 188, 98, 0.3); }
            50% { text-shadow: 0 0 20px rgba(151, 188, 98, 0.6); }
        }
    `;
    document.head.appendChild(style);
}

// Pastoral warm interaction features
function initializePastoralFeatures() {
    // Add encouraging messages on interaction
    const encouragingMessages = [
        "God sees your heart and loves you deeply 💚",
        "You're not alone in this journey of growth 🌱",
        "God's grace is sufficient for every struggle 🕊️",
        "Healing takes time - be patient with yourself 💕",
        "The Spirit is working in you even now ✨"
    ];
    
    let messageIndex = 0;
    
    // Show encouraging message on content interaction
    document.querySelectorAll('.content-card, .bento-item').forEach(element => {
        element.addEventListener('click', function() {
            if (Math.random() < 0.3) { // 30% chance
                showEncouragingMessage(encouragingMessages[messageIndex % encouragingMessages.length]);
                messageIndex++;
            }
        });
    });
    
    // Add peaceful loading transitions
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });
    
    document.querySelectorAll('.content-card, .bento-item, .bible-verse').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease-out';
        observer.observe(element);
    });
}

function showEncouragingMessage(message) {
    // Remove existing message
    const existing = document.querySelector('.encouraging-message');
    if (existing) {
        existing.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'encouraging-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #97bc62 0%, #a7cc6a 100%);
        color: #2c5f2d;
        padding: 15px 20px;
        border-radius: 12px;
        font-family: Georgia, serif;
        font-size: 0.9rem;
        max-width: 280px;
        z-index: 3000;
        box-shadow: 0 8px 25px rgba(44, 95, 45, 0.2);
        border: 2px solid rgba(44, 95, 45, 0.1);
        transform: translateX(100%);
        transition: all 0.5s ease;
        line-height: 1.4;
        font-weight: 500;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Slide in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 500);
    }, 4000);
}

// Enhanced mobile experience
function initializeMobileEnhancements() {
    if (window.innerWidth <= 768) {
        // Larger touch targets on mobile
        document.querySelectorAll('.btn, .tab-btn, .accordion-header').forEach(element => {
            element.style.minHeight = '48px';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
        });
        
        // Simplified animations on mobile
        document.querySelectorAll('.content-card').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// Initialize mobile enhancements
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileEnhancements();
});

// Window resize handler
window.addEventListener('resize', function() {
    // Adjust tooltips and modals on resize
    hideChartTooltip();
    
    // Reinitialize mobile features if needed
    if (window.innerWidth <= 768) {
        initializeMobileEnhancements();
    }
});

// Smooth scroll enhancement for sermon navigation
function enhanceNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add gentle highlight to target
                target.style.transition = 'all 0.5s ease';
                target.style.background = 'rgba(151, 188, 98, 0.1)';
                setTimeout(() => {
                    target.style.background = '';
                }, 2000);
            }
        });
    });
}

// Initialize navigation enhancements
document.addEventListener('DOMContentLoaded', enhanceNavigation);