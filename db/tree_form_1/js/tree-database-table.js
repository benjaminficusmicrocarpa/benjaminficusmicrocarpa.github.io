/**
 * Tree Database Table - Specialized Component
 * Phase 3: Specialized Features Isolation
 * 
 * This file contains the ultra-compact table rendering and external database
 * integration specifically optimized for botanical species data with specialized
 * features for data density and external resource linking.
 * 
 * SPECIALIZED FEATURES:
 * - Ultra-compact table rendering for maximum data density
 * - External database integration (GBIF, POWO, WFO)
 * - Species-specific data formatting and display
 * - Mobile-responsive table optimization
 * - Performance optimization for large datasets
 * - Specialized cell types for botanical data
 */

// Extend TreeDatabaseApp with table functionality
Object.assign(TreeDatabaseApp.prototype, {

    /**
     * Generate and display the main data table
     * PRESERVED: Ultra-compact table rendering with specialized spacing
     */
    renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        const noResults = document.getElementById('noResults');

        // Show "no results" message if no data to display
        if (data.length === 0) {
            if (tableBody) tableBody.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        // Show table and hide "no results" message
        if (tableBody) tableBody.style.display = '';
        if (noResults) noResults.style.display = 'none';

        // Generate HTML for each species row
        // MODERNIZED: Using data attributes instead of onclick
        const rows = data.map(species => {
            const hasImages = this.speciesImages[species.id];
            const clickableClass = hasImages ? 'scientific-name clickable' : 'scientific-name';
            
            // MODERNIZED: Use data attributes for carousel triggers
            const carouselAttributes = hasImages ? 
                `data-carousel-trigger data-species-id="${species.id}"` : '';
            
            return `
                <tr data-species-row="${species.id}">
                    <td>${species.id}</td>
                    <td class="${clickableClass}" ${carouselAttributes}>
                        ${species.scientific}
                    </td>
                    <td class="chinese-name">${species.chinese}</td>
                    <td class="alternative-name">${species.alternative || ''}</td>
                    <td class="latin29-id">${species.latin29_id || ''}</td>
                    <td class="gbif-column">${this.generateGbifLink(species)}</td>
                    <td class="powo-column">${this.generatePowoLink(species)}</td>
                    <td class="wfo-column">${this.generateWfoLink(species)}</td>
                </tr>
            `;
        }).join('');

        // Insert all rows into table body
        if (tableBody) {
            tableBody.innerHTML = rows;
        }
        
        console.log('Table rendered with', data.length, 'rows');
        console.log('First row scientific name:', data[0]?.scientific);
        console.log('Species with images:', Object.keys(this.speciesImages).length);
    },

    /**
     * Generate GBIF (Global Biodiversity Information Facility) link for a species
     * PRESERVED: Complete external database integration
     */
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

    /**
     * Generate POWO (Plants of the World Online) link for a species
     * PRESERVED: Complete external database integration
     */
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

    /**
     * Generate WFO (World Flora Online) link for a species
     * PRESERVED: Complete external database integration
     */
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

    /**
     * Determine if external database links should be skipped for a species
     * PRESERVED: Complete logic for handling special cases
     */
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
