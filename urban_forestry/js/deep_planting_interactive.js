/**
 * Deep Planting & Girdling Roots - Interactive JavaScript
 * Provides enhanced functionality and interactivity for the educational content
 */

class DeepPlantingInteractive {
    constructor() {
        this.currentStep = 0;
        this.steps = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupInteractiveElements();
        this.setupScrollEffects();
        console.log('Deep Planting Interactive initialized');
    }

    setupEventListeners() {
        // Add click handlers for interactive steps
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.add('interactive-step');
            step.addEventListener('click', () => this.handleStepClick(index));
        });

        // Add hover effects for tree diagrams
        const treeDiagrams = document.querySelectorAll('.tree-diagram');
        treeDiagrams.forEach(diagram => {
            diagram.classList.add('highlight');
        });

        // Add click handlers for physiological factors
        const factors = document.querySelectorAll('.factor');
        factors.forEach(factor => {
            factor.classList.add('highlight');
            factor.addEventListener('click', () => this.handleFactorClick(factor));
        });

        // Setup oxygen level animations
        this.setupOxygenAnimations();
    }

    initializeAnimations() {
        // Add fade-in animations to sections
        const sections = document.querySelectorAll('.comparison-section, .process-flow, .physiological-factors, .root-path, .oxygen-gradient, .warning-box');
        sections.forEach((section, index) => {
            section.classList.add('fade-in');
            section.style.animationDelay = `${index * 0.2}s`;
        });
    }

    setupInteractiveElements() {
        // Add tooltip functionality
        this.setupTooltips();
        
        // Add progress indicator
        this.createProgressIndicator();
    }

    setupScrollEffects() {
        // Intersection Observer for scroll-triggered animations
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

        // Observe all major sections
        document.querySelectorAll('.tree-diagram, .step, .factor').forEach(el => {
            observer.observe(el);
        });
    }

    handleStepClick(stepIndex) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const step = document.querySelectorAll('.step')[stepIndex];
        
        // Highlight the clicked step
        document.querySelectorAll('.step').forEach(s => s.style.opacity = '0.6');
        step.style.opacity = '1';
        step.style.transform = 'scale(1.05)';
        
        // Show detailed explanation (could be expanded)
        this.showStepDetails(stepIndex);
        
        setTimeout(() => {
            step.style.transform = 'scale(1)';
            document.querySelectorAll('.step').forEach(s => s.style.opacity = '1');
            this.isAnimating = false;
        }, 1000);
    }

    handleFactorClick(factor) {
        // Add pulsing effect to show interaction
        factor.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            factor.style.animation = '';
        }, 600);
        
        // Could add detailed modal or expanded information here
        console.log('Factor clicked:', factor.querySelector('.factor-title').textContent);
    }

    setupOxygenAnimations() {
        const oxygenLevels = document.querySelectorAll('.oxygen-level');
        oxygenLevels.forEach((level, index) => {
            // Add breathing animation to oxygen emojis
            const oxygenEmojis = level.querySelector('div:last-child');
            if (oxygenEmojis) {
                oxygenEmojis.style.animation = `breathe 3s ease-in-out infinite`;
                oxygenEmojis.style.animationDelay = `${index * 0.5}s`;
            }
        });
    }

    setupTooltips() {
        // Add tooltips to key terms
        const tooltipElements = document.querySelectorAll('.root-flare, .buried-flare, .soil-surface');
        tooltipElements.forEach(element => {
            element.title = this.getTooltipText(element.className);
            element.style.cursor = 'help';
        });
    }

    getTooltipText(className) {
        const tooltips = {
            'root-flare': 'The visible widening of the trunk at soil level where roots begin to branch out',
            'buried-flare': 'Root flare that has been planted too deep, causing stress and girdling',
            'soil-surface': 'The ground level where the root flare should be visible'
        };
        return tooltips[className] || '';
    }

    createProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-indicator';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">Reading Progress</div>
        `;
        
        // Add styles for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .progress-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.9);
                padding: 10px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .progress-bar {
                width: 200px;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #2E7D32);
                width: 0%;
                transition: width 0.3s ease;
            }
            .progress-text {
                font-size: 0.8em;
                color: #666;
                text-align: center;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(progressBar);
        
        // Update progress on scroll
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
        }
    }



    showStepDetails(stepIndex) {
        const stepDetails = [
            'Oxygen deprivation causes root cells to die from lack of energy',
            'The original root system cannot survive in low-oxygen conditions',
            'Tree activates emergency survival mechanisms',
            'New roots emerge from trunk tissue near the surface',
            'Physical constraints force roots to grow in circular patterns',
            'Expanding roots eventually strangle the tree\'s vascular system'
        ];
        
        // Could implement a modal or expandable section here
        console.log('Step details:', stepDetails[stepIndex]);
    }

    // Utility method to add breathing animation
    addBreathingAnimation() {
        const breathingStyle = document.createElement('style');
        breathingStyle.textContent = `
            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(breathingStyle);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const interactive = new DeepPlantingInteractive();
    interactive.addBreathingAnimation();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeepPlantingInteractive;
}
