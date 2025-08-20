import React, { useState, useEffect, useRef } from 'react';

const TreeSpeciesComponent = ({ 
    jsonUrl = 'tree-database.json',
    title = 'Tree Species Database from Form 1 of TRAM 10th Version',
    subtitle = 'Guidelines for Tree Risk Assessment and Management Arrangement (10th version) by Tree Management Office, Hong Kong Government'
}) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const searchInputRef = useRef(null);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        loadData();
    }, [jsonUrl]);

    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch(jsonUrl);
            const jsonData = await response.json();
            setData(jsonData.species);
            setFilteredData(jsonData.species);
        } catch (err) {
            setError('Error loading tree data');
            console.error('Error loading tree data:', err);
        } finally {
            setLoading(false);
        }
    };

    const stripHtml = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    };

    const matchesQuery = (species, query) => {
        const searchableText = [
            stripHtml(species.scientific),
            species.chinese,
            species.alternative
        ].join(' ').toLowerCase();
        return searchableText.includes(query);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const trimmedQuery = query.trim().toLowerCase();
        
        if (trimmedQuery === '') {
            setFilteredData([...data]);
            setSuggestions([]);
            setShowSuggestions(false);
        } else {
            const filtered = data.filter(species => matchesQuery(species, trimmedQuery));
            setFilteredData(filtered);
            
            const suggestionList = filtered.slice(0, 8);
            setSuggestions(suggestionList);
            setShowSuggestions(suggestionList.length > 0);
        }
        setCurrentSuggestionIndex(-1);
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setCurrentSuggestionIndex(prev => 
                    Math.min(prev + 1, suggestions.length - 1)
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setCurrentSuggestionIndex(prev => Math.max(prev - 1, -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (currentSuggestionIndex >= 0) {
                    const selected = suggestions[currentSuggestionIndex];
                    selectSuggestion(stripHtml(selected.scientific));
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                searchInputRef.current?.blur();
                break;
        }
    };

    const selectSuggestion = (scientificName) => {
        setSearchQuery(scientificName);
        setShowSuggestions(false);
        handleSearch(scientificName);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading tree species database...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gradient-to-br from-blue-600 to-blue-500 text-white py-8 px-4 text-center">
                <h1 className="text-4xl font-bold mb-2">{title}</h1>
                <h2 className="text-lg font-normal opacity-90 max-w-4xl mx-auto">{subtitle}</h2>
            </header>

            <div className="max-w-6xl mx-auto py-8 px-4">
                {/* Search */}
                <div className="relative mb-8">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        🔍
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (searchQuery && suggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        onBlur={() => {
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        placeholder="Search by scientific name, Chinese name, or alternative name..."
                        className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        autoComplete="off"
                    />
                    
                    {/* Suggestions */}
                    {showSuggestions && (
                        <div
                            ref={suggestionsRef}
                            className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-xl max-h-80 overflow-y-auto z-50 shadow-lg"
                        >
                            {suggestions.map((species, index) => {
                                const plainScientific = stripHtml(species.scientific);
                                return (
                                    <div
                                        key={species.id}
                                        className={`p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
                                            index === currentSuggestionIndex ? 'bg-gray-50' : ''
                                        }`}
                                        onClick={() => selectSuggestion(plainScientific)}
                                    >
                                        <div 
                                            className="font-semibold text-gray-900"
                                            dangerouslySetInnerHTML={{
                                                __html: highlightMatch(plainScientific, searchQuery.trim())
                                            }}
                                        />
                                        <div className="text-sm text-gray-600 mt-1">
                                            {species.chinese}
                                            {species.alternative && ` • ${species.alternative}`}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-8 mb-8 flex-wrap">
                    <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                        <div className="text-3xl font-bold text-blue-600">{data.length}</div>
                        <div className="text-sm text-gray-600 mt-2">Total Species</div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl text-center border border-gray-200">
                        <div className="text-3xl font-bold text-blue-600">{filteredData.length}</div>
                        <div className="text-sm text-gray-600 mt-2">Showing</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    {filteredData.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No species found matching your search criteria.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                                        <th className="px-4 py-4 text-left font-semibold text-gray-900 w-20">No.</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-900">Scientific Name</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-900">Chinese Name</th>
                                        <th className="px-4 py-4 text-left font-semibold text-gray-900">Alternative Chinese Names</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((species) => (
                                        <tr key={species.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-4">{species.id}</td>
                                            <td 
                                                className="px-4 py-4 font-medium"
                                                dangerouslySetInnerHTML={{ __html: species.scientific }}
                                            />
                                            <td className="px-4 py-4 font-semibold">{species.chinese}</td>
                                            <td className="px-4 py-4 text-gray-600 text-sm">
                                                {species.alternative || ''}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Attribution */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
                    Generated using LLM with supervision and polishing by{' '}
                    <a 
                        href="https://benjaminficusmicrocarpa.github.io/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        benjaminficusmicrocarpa
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TreeSpeciesComponent;
