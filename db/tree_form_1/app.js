class TreeSpeciesDatabase {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.currentSuggestionIndex = -1;
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderTable(this.data);
        this.updateStats();
    }

    async loadData() {
        try {
            const response = await fetch('tree-database.json');
            const jsonData = await response.json();
            this.data = jsonData.species;
            this.filteredData = [...this.data];
        } catch (error) {
            console.error('Error loading tree data:', error);
            // Fallback to embedded data if needed
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const suggestions = document.getElementById('suggestions');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });

        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestions.style.display = 'none';
            }, 200);
        });

        searchInput.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.showSuggestions(e.target.value);
            }
        });
    }

    handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery === '') {
            this.filteredData = [...this.data];
            this.hideSuggestions();
        } else {
            this.filteredData = this.data.filter(species => 
                this.matchesQuery(species, trimmedQuery)
            );
            this.showSuggestions(trimmedQuery);
        }

        this.renderTable(this.filteredData);
        this.updateStats();
    }

    matchesQuery(species, query) {
        // Strip HTML tags for searching but preserve original formatting
        const stripHtml = (html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        };

        const searchableText = [
            stripHtml(species.scientific),
            species.chinese,
            species.alternative
        ].join(' ').toLowerCase();

        return searchableText.includes(query);
    }

    showSuggestions(query) {
        const suggestions = document.getElementById('suggestions');
        const matchingSpecies = this.data
            .filter(species => this.matchesQuery(species, query))
            .slice(0, 8); // Limit to 8 suggestions

        if (matchingSpecies.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsHTML = matchingSpecies.map((species, index) => {
            // Strip HTML for search highlighting, but preserve original for display
            const stripHtml = (html) => {
                const div = document.createElement('div');
                div.innerHTML = html;
                return div.textContent || div.innerText || '';
            };
            
            const plainScientific = stripHtml(species.scientific);
            const highlightedScientific = this.highlightMatch(plainScientific, query);
            
            return `
                <div class="suggestion-item" data-index="${index}" onclick="app.selectSuggestion('${plainScientific.replace(/'/g, "\\'")}')">
                    <div class="suggestion-scientific">${highlightedScientific}</div>
                    <div class="suggestion-chinese">
                        ${species.chinese}${species.alternative ? ' • ' + species.alternative : ''}
                    </div>
                </div>
            `;
        }).join('');

        suggestions.innerHTML = suggestionsHTML;
        suggestions.style.display = 'block';
        this.currentSuggestionIndex = -1;
    }

    hideSuggestions() {
        document.getElementById('suggestions').style.display = 'none';
        this.currentSuggestionIndex = -1;
    }

    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    handleKeyNavigation(e) {
        const suggestions = document.getElementById('suggestions');
        const suggestionItems = suggestions.querySelectorAll('.suggestion-item');

        if (suggestions.style.display === 'none' || suggestionItems.length === 0) {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.currentSuggestionIndex = Math.min(
                    this.currentSuggestionIndex + 1,
                    suggestionItems.length - 1
                );
                this.updateSuggestionHighlight(suggestionItems);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.currentSuggestionIndex = Math.max(
                    this.currentSuggestionIndex - 1,
                    -1
                );
                this.updateSuggestionHighlight(suggestionItems);
                break;

            case 'Enter':
                e.preventDefault();
                if (this.currentSuggestionIndex >= 0) {
                    const selectedItem = suggestionItems[this.currentSuggestionIndex];
                    const scientificName = selectedItem.querySelector('.suggestion-scientific').textContent;
                    this.selectSuggestion(scientificName);
                }
                break;

            case 'Escape':
                this.hideSuggestions();
                document.getElementById('searchInput').blur();
                break;
        }
    }

    updateSuggestionHighlight(suggestionItems) {
        suggestionItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSuggestionIndex);
        });
    }

    selectSuggestion(scientificName) {
        document.getElementById('searchInput').value = scientificName;
        this.hideSuggestions();
        this.handleSearch(scientificName);
    }

    renderTable(data) {
        const tableBody = document.getElementById('tableBody');
        const noResults = document.getElementById('noResults');

        if (data.length === 0) {
            tableBody.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        tableBody.style.display = '';
        noResults.style.display = 'none';

        const rows = data.map(species => `
            <tr>
                <td>${species.id}</td>
                <td class="scientific-name">${species.scientific}</td>
                <td class="chinese-name">${species.chinese}</td>
                <td class="alternative-name">${species.alternative || ''}</td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
    }

    updateStats() {
        document.getElementById('totalCount').textContent = this.data.length;
        document.getElementById('visibleCount').textContent = this.filteredData.length;
    }
}

// Initialize the application
const app = new TreeSpeciesDatabase();
