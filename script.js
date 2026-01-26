// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all interactive elements
    initializeCards();
    initializeParticles();
    initializeScrollEffects();
    initializeTypingEffect();
    
    // Add smooth scrolling to all internal links
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

// Initialize card interactions
function initializeCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Add click handler
        card.addEventListener('click', function() {
            const link = this.getAttribute('data-link');
            if (link) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.location.href = link;
                }, 150);
            }
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            playHoverSound();
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}


// Create ripple effect on click
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Initialize particle system
function initializeParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    
    if (particlesContainer) {
        // Create additional particles dynamically
        for (let i = 0; i < 5; i++) {
            createParticle(particlesContainer);
        }
        
        // Continuously create new particles
        setInterval(() => {
            createParticle(particlesContainer);
        }, 3000);
    }
}

// Create a single particle
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const left = Math.random() * 100;
    const animationDuration = Math.random() * 10 + 5;
    const animationDelay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        animation: particle-float ${animationDuration}s ${animationDelay}s infinite linear;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, (animationDuration + animationDelay) * 1000);
}

// Initialize scroll effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe cards for scroll animations
    document.querySelectorAll('.card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize typing effect for title
function initializeTypingEffect() {
    const title = document.querySelector('.title');
    if (title) {
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                title.style.borderRight = 'none';
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Play hover sound (optional - creates a subtle audio feedback)
function playHoverSound() {
    // Create a subtle hover sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio is not supported
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const cards = document.querySelectorAll('.card');
    const currentIndex = Array.from(cards).findIndex(card => 
        card === document.activeElement || card.contains(document.activeElement)
    );
    
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % cards.length;
            cards[nextIndex].focus();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? cards.length - 1 : currentIndex - 1;
            cards[prevIndex].focus();
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            if (currentIndex >= 0) {
                cards[currentIndex].click();
            }
            break;
    }
});

// Add focus styles for accessibility
document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('focus', function() {
        this.style.outline = '3px solid #667eea';
        this.style.outlineOffset = '2px';
    });
    
    card.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate cards in sequence
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    body.loaded .card {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
