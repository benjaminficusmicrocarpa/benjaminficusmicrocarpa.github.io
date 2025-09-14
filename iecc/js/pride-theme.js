/* Pride Theme JavaScript - Specific functionality for "The Heart of Hearing: Navigating Pride" sermon */

// Chart bar interactions specific to pride sermon
function initializePrideChart() {
    document.querySelectorAll('.chart-bar').forEach(bar => {
        bar.addEventListener('click', function() {
            const label = this.querySelector('.chart-bar-label').textContent.trim();
            const value = this.querySelector('.chart-value').textContent;
            
            let message = '';
            switch(label.split('\n')[0]) {
                case 'Relationship':
                    message = 'Pride damages relationships by making us unable to see our own faults and preventing vulnerability with others.';
                    break;
                case 'Isolation':
                    message = 'Pride isolates us because we use relationships only to get what we want, and people see through this.';
                    break;
                case 'Help':
                    message = 'Pride prevents us from seeking help because we refuse to acknowledge our need for assistance.';
                    break;
                case 'False':
                    message = 'Pride promises recognition, significance, and fulfillment but consistently fails to deliver on these promises.';
                    break;
            }
            
            alert(`${label}: ${value}\n\n${message}`);
        });
    });
}

// Pride-specific modal content and interactions
function initializePrideModals() {
    // Add any pride-specific modal behaviors here
    // Currently using the generic modal functionality
}

// Pride-specific mindmap interactions
function initializePrideMindmap() {
    // Any specific interactions for the pride mindmap nodes
    // Currently using the generic mindmap functionality
}

// Pride sermon specific initialization
function initializePrideTheme() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializePrideChart();
            initializePrideModals();
            initializePrideMindmap();
        });
    } else {
        initializePrideChart();
        initializePrideModals();
        initializePrideMindmap();
    }
}

// Initialize pride-specific features
initializePrideTheme();

// Export pride-specific functions
window.PrideTheme = {
    initializePrideChart,
    initializePrideModals,
    initializePrideMindmap
};
