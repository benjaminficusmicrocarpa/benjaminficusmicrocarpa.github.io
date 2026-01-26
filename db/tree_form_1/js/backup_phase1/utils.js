// Extend TreeSpeciesDatabase with utility functions
Object.assign(TreeSpeciesDatabase.prototype, {

    // Generate GBIF (Global Biodiversity Information Facility) link for a species
    generateGbifLink(species) {
        // Remove HTML tags from scientific name
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const plainScientific = stripHtml(species.scientific);

        // Skip link for special cases
        if (this.shouldSkipExternalLink(plainScientific)) {
            return '';
        }

        // Process scientific name for URL
        let searchTerm = plainScientific;
        searchTerm = searchTerm.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp." suffix
        const encodedTerm = encodeURIComponent(searchTerm.trim());

        // Return HTML for GBIF link with icon
        return `
            <a href="https://www.gbif.org/search?q=${encodedTerm}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="gbif-link"
               title="View in Global Biodiversity Information Facility">
                <img src="gbif-mark-green-logo.svg" alt="GBIF" class="gbif-icon">
            </a>
        `;
    },

    // Generate POWO (Plants of the World Online) link for a species
    generatePowoLink(species) {
        // Remove HTML tags from scientific name
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const plainScientific = stripHtml(species.scientific);

        // Skip link for special cases
        if (this.shouldSkipExternalLink(plainScientific)) {
            return '';
        }

        // Process scientific name for URL
        let searchTerm = plainScientific;
        searchTerm = searchTerm.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp." suffix
        const encodedTerm = encodeURIComponent(searchTerm.trim());

        // Return HTML for POWO link
        return `
            <a href="https://powo.science.kew.org/results?q=${encodedTerm}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="powo-link"
               title="View in Plants of the World Online">
                🌿
            </a>
        `;
    },



    // Generate WFO (World Flora Online) link for a species
    generateWfoLink(species) {
        // Remove HTML tags from scientific name
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const plainScientific = stripHtml(species.scientific);

        // Skip link for special cases
        if (this.shouldSkipExternalLink(plainScientific)) {
            return '';
        }

        // Process scientific name for URL
        let searchTerm = plainScientific;
        searchTerm = searchTerm.replace(/\s+spp\.?\s*$/i, ''); // Remove "spp." suffix
        const encodedTerm = encodeURIComponent(searchTerm.trim());

        // Return HTML for WFO link with icon
        return `
            <a href="https://worldfloraonline.org/search?query=${encodedTerm}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="wfo-link"
               title="View in World Flora Online">
                <img src="WFOIcon.png" alt="WFO" class="wfo-icon">
            </a>
        `;
    },

    // Determine if external database links should be skipped for a species
    shouldSkipExternalLink(scientificName) {
        const name = scientificName.toLowerCase().trim();

        // Skip for special non-species entries
        if (name === 'others' || name === 'unidentified') {
            return true;
        }

        // Skip for cultivars (marked with single quotes or 'cv')
        if (name.includes("'") || name.includes("cv")) {
            return true;
        }

        // Note: "var." (variety) is NOT a cultivar and should have links
        // Only skip if it also has cultivar markers

        // Skip if empty or just a dash
        if (name === '-' || name === '') {
            return true;
        }

        return false;
    }
});



// Global functions that can be called from HTML onclick attributes
function openModal() {
    if (app) {
        app.openModal();
    }
}

function closeModal() {
    if (app) {
        app.closeModal();
    }
}
