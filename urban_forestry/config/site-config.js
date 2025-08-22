/**
 * Site Configuration for Deep Planting Educational Content
 * This file allows easy customization of colors, animations, and behavior
 */

const SiteConfig = {
    // Color Scheme
    colors: {
        primary: '#4CAF50',
        primaryDark: '#2E7D32',
        secondary: '#ff9800',
        danger: '#f44336',
        warning: '#ff9800',
        success: '#4CAF50',
        info: '#2196F3',
        light: '#f8f9fa',
        dark: '#343a40',
        white: '#ffffff',
        black: '#000000',
        
        // Gradients
        headerGradient: 'linear-gradient(135deg, #2E7D32, #4CAF50)',
        bodyGradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)',
        oxygenGradient: 'linear-gradient(to bottom, #e3f2fd 0%, #1976d2 50%, #0d47a1 100%)',
        warningGradient: 'linear-gradient(135deg, #d32f2f, #f44336)',
        soilGradient: 'linear-gradient(to bottom, #8B4513 0%, #654321 50%, #3E2723 100%)'
    },

    // Animation Settings
    animations: {
        fadeInDuration: '0.8s',
        hoverScale: '1.02',
        breathingDuration: '3s',
        pulseDuration: '0.6s',
        transitionSpeed: '0.3s'
    },

    // Interactive Features
    features: {
        enableProgressIndicator: true,
        enableTooltips: true,
        enableScrollAnimations: true,
        enableHoverEffects: true,
        enableClickInteractions: true,
        enableBreathingAnimations: true
    },

    // Content Settings
    content: {
        title: 'Deep Planting & Girdling Roots: A Physiological Journey',
        subtitle: 'A Physiological Journey from Oxygen Deprivation to Root Strangulation',
        author: 'Tree Care Education',
        description: 'Learn about the physiological effects of deep planting on trees and how it leads to girdling roots. Educational guide for arborists and tree care professionals.',
        keywords: 'deep planting, girdling roots, tree care, arboriculture, oxygen deprivation, root flare'
    },

    // Oxygen Levels Data
    oxygenLevels: [
        {
            depth: 'Surface',
            measurement: '0 in (0 cm)',
            percentage: '21% O₂',
            emojis: '🫁🫁🫁🫁🫁',
            description: 'Oxygen Rich'
        },
        {
            depth: 'Shallow',
            measurement: '6 in (15 cm)',
            percentage: '15-18% O₂',
            emojis: '🫁🫁🫁🫁',
            description: 'Healthy Zone'
        },
        {
            depth: 'Medium',
            measurement: '12 in (30 cm)',
            percentage: '8-12% O₂',
            emojis: '🫁🫁🫁',
            description: 'Suffocating'
        },
        {
            depth: 'Deep',
            measurement: '18+ in (45+ cm)',
            percentage: '3-5% O₂',
            emojis: '🫁🫁',
            description: 'Root Death Zone',
            warning: '💀'
        }
    ],

    // Process Steps Data
    processSteps: [
        {
            number: 1,
            emoji: '🫁',
            title: 'Oxygen Deprivation (Hypoxia)',
            description: 'Original roots buried too deep can\'t access oxygen for cellular respiration (ATP production). Root metabolism fails.'
        },
        {
            number: 2,
            emoji: '💀',
            title: 'Original Root System Dies',
            description: 'Hypoxic stress kills the primary root system. Tree faces survival crisis.'
        },
        {
            number: 3,
            emoji: '🚨',
            title: 'Emergency Response Activated',
            description: 'Dormant buds in buried trunk tissue differentiate into adventitious roots as survival mechanism.'
        },
        {
            number: 4,
            emoji: '🌱',
            title: 'Adventitious Roots Emerge',
            description: 'New roots grow from trunk circumference at shallow depth where oxygen is available.'
        },
        {
            number: 5,
            emoji: '🔄',
            title: 'Circling Pattern Develops',
            description: 'Roots grow tangentially around trunk due to competing physiological forces and physical constraints.'
        },
        {
            number: 6,
            emoji: '💀',
            title: 'Girdling and Death',
            description: 'Expanding roots constrict phloem and xylem, cutting off nutrient/water transport. Tree slowly strangles itself.'
        }
    ],

    // Physiological Factors Data
    physiologicalFactors: [
        {
            emoji: '🔽',
            title: 'Gravitropism (Downward Pull)',
            description: 'Natural tendency for roots to grow down with gravity - the default programming'
        },
        {
            emoji: '🫁',
            title: 'Aerotropism (Oxygen Seeking)',
            description: 'Desperate search for oxygen overrides gravitropism, forces horizontal growth'
        },
        {
            emoji: '👋',
            title: 'Thigmotropism (Touch Response)',
            description: 'Roots follow surfaces when they hit obstacles (trunk bark, hole walls)'
        },
        {
            emoji: '💧',
            title: 'Hydrotropism (Water Seeking)',
            description: 'Roots seek moisture, but in deep planting, surface moisture conflicts with deep water'
        }
    ],

    // Responsive Breakpoints
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },

    // Performance Settings
    performance: {
        enableLazyLoading: true,
        enableIntersectionObserver: true,
        debounceScrollEvents: true,
        throttleAnimations: true
    },

    // Accessibility Settings
    accessibility: {
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true,
        enableHighContrastMode: false,
        enableReducedMotion: false
    },

    // Social Media Settings
    social: {
        enableSharing: true,
        defaultImage: '',
        twitterHandle: '@TreeCareEdu',
        facebookPage: 'TreeCareEducation'
    },

    // Analytics and Tracking
    analytics: {
        enableTracking: false,
        googleAnalyticsId: '',
        enableHeatmaps: false
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteConfig;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.SiteConfig = SiteConfig;
}
