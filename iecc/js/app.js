const SermonInfographic = () => {
    const [activeTab, setActiveTab] = React.useState('main');
    const [expandedSections, setExpandedSections] = React.useState({});
    const [modalContent, setModalContent] = React.useState(null);
    const [tooltipVisible, setTooltipVisible] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [sermonData, setSermonData] = React.useState(null);
  
    // Load sermon data
    React.useEffect(() => {
      fetch('json/main.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load sermon data');
          }
          return response.json();
        })
        .then(data => {
          setSermonData(data);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setIsLoading(false);
        });
    }, []);
  
    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
  
    const openModal = (content) => {
      setModalContent(content);
    };
  
    const closeModal = () => {
      setModalContent(null);
    };
  
    if (isLoading) {
      return React.createElement('div', { 
        className: "sermon-container flex items-center justify-center min-h-screen" 
      },
        React.createElement('div', { className: "text-center" },
          React.createElement('div', { className: "text-2xl mb-4" }, "📖"),
          React.createElement('p', null, "Loading sermon content...")
        )
      );
    }
  
    if (error) {
      return React.createElement('div', { 
        className: "sermon-container flex items-center justify-center min-h-screen" 
      },
        React.createElement('div', { className: "text-center text-red-600" },
          React.createElement('div', { className: "text-2xl mb-4" }, "⚠️"),
          React.createElement('p', null, "Error loading sermon: ", error)
        )
      );
    }

    if (!sermonData) {
      return React.createElement('div', { 
        className: "sermon-container flex items-center justify-center min-h-screen" 
      },
        React.createElement('div', { className: "text-center text-red-600" },
          React.createElement('div', { className: "text-2xl mb-4" }, "⚠️"),
          React.createElement('p', null, "No sermon data available")
        )
      );
    }
  
    return React.createElement('div', { className: "sermon-container" },
      // Header
      React.createElement('header', { className: "sermon-header" },
        React.createElement('h1', { className: "sermon-title" }, sermonData.metadata.title),
        React.createElement('p', { className: "sermon-subtitle" }, 
          `${sermonData.metadata.church} • ${sermonData.metadata.date} • ${sermonData.metadata.subtitle}`
        ),
        React.createElement('div', { className: "sermon-theme" },
          React.createElement('p', { className: "font-medium" }, sermonData.metadata.theme)
        )
      ),
  
      // Tabs Navigation
      React.createElement('div', { className: "tab-container" },
        React.createElement('div', { className: "tab-navigation" },
          React.createElement(TabButton, {
            id: "main",
            label: "🏠 Main Sermon",
            isActive: activeTab === 'main',
            onClick: setActiveTab
          }),
          React.createElement(TabButton, {
            id: "bible",
            label: "📖 Bible Verses",
            isActive: activeTab === 'bible',
            onClick: setActiveTab
          }),
          React.createElement(TabButton, {
            id: "practical",
            label: "⚡ Practical Steps",
            isActive: activeTab === 'practical',
            onClick: setActiveTab
          }),
          React.createElement(TabButton, {
            id: "reflection",
            label: "🤔 Reflection",
            isActive: activeTab === 'reflection',
            onClick: setActiveTab
          })
        )
      ),
  
      // Tab Content
      React.createElement('div', { className: "mb-8" },
        activeTab === 'main' && React.createElement(MainContent, {
          data: sermonData,
          openModal,
          tooltipVisible,
          setTooltipVisible,
          expandedSections,
          toggleSection
        }),
        activeTab === 'bible' && React.createElement(BibleTab, { data: sermonData }),
        activeTab === 'practical' && React.createElement(PracticalTab, { data: sermonData }),
        activeTab === 'reflection' && React.createElement(ReflectionTab, { data: sermonData })
      ),
  
      // Footer
      React.createElement('footer', { className: "sermon-footer" },
        React.createElement('div', { className: "attribution" },
          "Generated using LLM with supervision and polishing by ",
          React.createElement('a', {
            href: "https://benjaminficusmicrocarpa.github.io/",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "footer-link"
          }, "benjaminficusmicrocarpa"),
          " | Original: ",
          React.createElement('a', {
            href: sermonData.metadata.youtube_link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "footer-link flex items-center justify-center gap-1 mt-2"
          },
            React.createElement('span', { style: { fontSize: 16 } }, '🔗'),
            `${sermonData.metadata.date} | ${sermonData.metadata.title.replace('⚔️ ', '')}`
          )
        ),
        React.createElement('p', { className: "footer-verse" }, sermonData.metadata.footer_verse)
      ),
  
      // Modal
      React.createElement(Modal, { content: modalContent, onClose: closeModal })
    );
  };
  
  // Render the app
  const root = ReactDOM.createRoot(document.getElementById('sermon-app'));
  root.render(React.createElement(SermonInfographic));