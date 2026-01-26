/**
 * IECC Sermon Common JavaScript
 * Shared functionality for all sermon pages
 */

// ==========================================
// Tab Navigation with URL Hash
// ==========================================
function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab, .tab-button');
    const sections = document.querySelectorAll('.content-section, .tab-content');

    if (tabs.length === 0 || sections.length === 0) return;

    function switchToTab(targetId) {
        // Remove active class from all tabs and sections
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to target tab and section
        const targetTab = document.querySelector(`.tab[data-tab="${targetId}"], .tab-button[data-tab="${targetId}"]`);
        const targetSection = document.getElementById(targetId);
        
        if (targetTab && targetSection) {
            targetTab.classList.add('active');
            targetTab.setAttribute('aria-selected', 'true');
            targetSection.classList.add('active');
            
            // Scroll to top of content
            window.scrollTo({
                top: document.querySelector('.tabs-container, .tabs')?.offsetTop || 0,
                behavior: 'smooth'
            });
        }
    }

    // Handle tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            
            // Update URL hash
            window.location.hash = targetId;
            
            // Switch to the tab
            switchToTab(targetId);
        });
    });

    // Handle hash changes (back/forward navigation)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        if (hash) {
            switchToTab(hash);
        }
    });

    // On page load, check if there's a hash and switch to that tab
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
        switchToTab(initialHash);
    }

    // Keyboard navigation for tabs
    const tabsContainer = document.querySelector('.tabs, .tabs-container');
    if (tabsContainer) {
        tabsContainer.addEventListener('keydown', (e) => {
            const tabsArray = Array.from(tabs);
            const currentIndex = tabsArray.findIndex(tab => tab.classList.contains('active'));
            
            let nextIndex;
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % tabsArray.length;
            } else if (e.key === 'ArrowLeft') {
                nextIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            } else {
                return;
            }
            
            tabsArray[nextIndex].click();
            tabsArray[nextIndex].focus();
        });
    }
}

// ==========================================
// Accordion Functionality
// ==========================================
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasActive = item.classList.contains('active');
            
            // Close all accordions
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't active
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// Global function for inline onclick handlers
window.toggleAccordion = function(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    
    const wasActive = item.classList.contains('active');
    
    // Close all accordions
    document.querySelectorAll('.accordion-item').forEach(accItem => {
        accItem.classList.remove('active');
    });

    // If it wasn't active, open it
    if (!wasActive) {
        item.classList.add('active');
    }
    
    // Handle content and icon if present
    if (content) {
        content.classList.toggle('active', !wasActive);
    }
    if (icon) {
        icon.classList.toggle('active', !wasActive);
    }
};

// ==========================================
// Slideshow / Image Carousel
// ==========================================
function initSlideshow(options = {}) {
    const slides = document.querySelectorAll('.slideshow-slide, .hero-bg, .bg-slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    const interval = options.interval || 4000;
    const pauseOnHover = options.pauseOnHover !== false;
    
    let currentSlide = 0;
    let slideshowInterval;

    function showSlide(index) {
        // Wrap around
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
    }

    function startSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        slideshowInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, interval);
    }

    // Pause slideshow on hover (desktop)
    if (pauseOnHover) {
        const heroHeader = document.querySelector('.hero-header, .hero');
        if (heroHeader) {
            heroHeader.addEventListener('mouseenter', () => {
                clearInterval(slideshowInterval);
            });

            heroHeader.addEventListener('mouseleave', () => {
                startSlideshow();
            });
        }
    }

    // Initialize slideshow
    startSlideshow();
    
    return {
        next: () => showSlide(currentSlide + 1),
        prev: () => showSlide(currentSlide - 1),
        goTo: (index) => showSlide(index),
        pause: () => clearInterval(slideshowInterval),
        resume: () => startSlideshow()
    };
}

// ==========================================
// Smooth Scroll for Internal Links
// ==========================================
function initSmoothScroll() {
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

// ==========================================
// Load Sermon Tags from sermons_data.json
// ==========================================
async function loadSermonTags(sermonDate) {
    try {
        const response = await fetch('sermons_data.json');
        const data = await response.json();
        
        // Find this sermon by date
        const sermon = data.sermons.find(s => s.date === sermonDate);
        if (!sermon) return;
        
        const tagsContainer = document.getElementById('sermon-tags');
        if (!tagsContainer) return;
        
        const tagCategories = data.tagCategories;
        
        // Create a map of all tags for quick lookup
        const allTags = {};
        Object.values(tagCategories).flat().forEach(tag => {
            allTags[tag.id] = tag;
        });
        
        // Generate tag links
        const tagLinks = sermon.tags.map(tagId => {
            const tagInfo = allTags[tagId];
            if (!tagInfo) return '';
            
            // Determine tag type
            let tagType = 'topic';
            if (tagCategories.series?.find(t => t.id === tagId)) tagType = 'series';
            else if (tagCategories.themes?.find(t => t.id === tagId)) tagType = 'theme';
            else if (tagCategories.topics?.find(t => t.id === tagId)) tagType = 'topic';
            else if (tagCategories.scriptures?.find(t => t.id === tagId)) tagType = 'scripture';
            
            // Create link to index.html with tag filter
            const tagUrl = `index.html?tags=${encodeURIComponent(tagId)}`;
            
            return `<a href="${tagUrl}" class="sermon-tag ${tagType}" title="Filter sermons by ${tagInfo.label}">
                ${tagInfo.emoji} ${tagInfo.label}
            </a>`;
        }).filter(html => html).join('');
        
        tagsContainer.innerHTML = tagLinks;
        
    } catch (error) {
        console.error('Failed to load sermon tags:', error);
    }
}

// ==========================================
// Starfield Generator (for space-themed sermons)
// ==========================================
function createStarfield(containerId = 'starfield', starCount = 150) {
    const starfield = document.getElementById(containerId);
    if (!starfield) return;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starfield.appendChild(star);
    }
}

// ==========================================
// Attribution Badge Toggle
// ==========================================
function initAttributionToggle() {
    const attribution = document.getElementById('attribution');
    if (!attribution) return;
    
    const short = attribution.querySelector('.attribution-short');
    if (short) {
        short.addEventListener('click', function() {
            const full = attribution.querySelector('.attribution-full');
            if (full) {
                full.style.display = full.style.display === 'block' ? 'none' : 'block';
                short.style.display = full.style.display === 'block' ? 'none' : 'flex';
            }
        });
    }
}

window.toggleAttribution = function() {
    const attribution = document.getElementById('attribution');
    if (!attribution) return;
    
    const currentContent = attribution.innerHTML;
    
    if (currentContent.includes('attribution-short')) {
        attribution.innerHTML = `
            <div class="attribution-full" onclick="toggleAttribution()" style="cursor: pointer;">
                Generated by LLM with supervision by <a href="../index.html">benjaminficusmicrocarpa</a>. 
                <a href="../license.html">MIT License</a>
                <div style="margin-top: 1rem; font-size: 0.75rem; opacity: 0.7;">Click to minimize</div>
            </div>
        `;
    } else {
        attribution.innerHTML = `<div class="attribution-short" onclick="toggleAttribution()">ℹ️</div>`;
    }
};

// ==========================================
// Intersection Observer for Animations
// ==========================================
function initScrollAnimations() {
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

    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .verse-card, .key-point, .reflection-card, .app-card, .card'
    );
    
    animatedElements.forEach(el => {
        if (window.getComputedStyle(el).opacity !== '0') {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });
}

// ==========================================
// Reduced Motion Check
// ==========================================
function respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
}

// ==========================================
// Initialize All Components
// ==========================================
function initSermonPage(options = {}) {
    // Initialize core functionality
    initTabNavigation();
    initAccordions();
    initSmoothScroll();
    initAttributionToggle();
    respectReducedMotion();
    
    // Initialize optional features based on options
    if (options.slideshow !== false) {
        initSlideshow(options.slideshowOptions || {});
    }
    
    if (options.sermonDate) {
        loadSermonTags(options.sermonDate);
    }
    
    if (options.starfield) {
        createStarfield(options.starfieldId, options.starCount);
    }
    
    if (options.scrollAnimations !== false) {
        initScrollAnimations();
    }
}

// Auto-initialize on DOMContentLoaded if data attribute is present
document.addEventListener('DOMContentLoaded', function() {
    const sermonPage = document.querySelector('[data-sermon-date]');
    if (sermonPage) {
        initSermonPage({
            sermonDate: sermonPage.dataset.sermonDate,
            slideshow: sermonPage.dataset.slideshow !== 'false',
            starfield: sermonPage.dataset.starfield === 'true',
            scrollAnimations: sermonPage.dataset.scrollAnimations !== 'false'
        });
    }
});

// Export functions for manual initialization
window.IECC = {
    initSermonPage,
    initTabNavigation,
    initAccordions,
    initSlideshow,
    initSmoothScroll,
    loadSermonTags,
    createStarfield,
    initScrollAnimations
};
