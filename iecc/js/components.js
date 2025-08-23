// Component definitions

// Simple icon components that don't rely on LucideReact
const IconX = ({ size = 20 }) => React.createElement('span', { 
    style: { fontSize: size, cursor: 'pointer' } 
}, '✕');

const IconQuote = ({ className = "" }) => React.createElement('span', { 
    className: `inline w-4 h-4 mr-1 ${className}` 
}, '"');

const IconTarget = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '🎯');

const IconBookOpen = ({ size = 16, className = "" }) => React.createElement('span', { 
    className: `mr-1 ${className}`,
    style: { fontSize: size }
}, '📖');

const IconEye = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '👁️');

const IconChevronDown = ({ size = 20 }) => React.createElement('span', { 
    style: { fontSize: size }
}, '▼');

const IconChevronRight = ({ size = 20 }) => React.createElement('span', { 
    style: { fontSize: size }
}, '▶');

const IconHeart = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '❤️');

const IconShield = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '🛡️');

const IconSword = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '⚔️');

const IconLightbulb = ({ className = "", size = 20 }) => React.createElement('span', { 
    className: `mr-2 ${className}`,
    style: { fontSize: size }
}, '💡');

const IconExternalLink = ({ size = 16 }) => React.createElement('span', { 
    style: { fontSize: size }
}, '🔗');

// Utility Components
const Tooltip = ({ children, content, id, tooltipVisible, setTooltipVisible }) => {
  return React.createElement('div', { className: "tooltip-container" },
    React.createElement('span', {
      className: "tooltip-trigger",
      onMouseEnter: () => setTooltipVisible(id),
      onMouseLeave: () => setTooltipVisible(null)
    }, children),
    tooltipVisible === id && React.createElement('div', { className: "tooltip-content" },
      content,
      React.createElement('div', { className: "tooltip-arrow" })
    )
  );
};

const Modal = ({ content, onClose }) => {
  if (!content) return null;

  return React.createElement('div', { className: "modal-overlay" },
    React.createElement('div', { className: "modal-content" },
      React.createElement('div', { className: "modal-header" },
        React.createElement('h3', { className: "modal-title" }, content.title),
        React.createElement('button', { 
          onClick: onClose, 
          className: "modal-close" 
        }, React.createElement(IconX, { size: 20 }))
      ),
      React.createElement('div', { className: "modal-body" }, content.body)
    )
  );
};

const TabButton = ({ id, label, isActive, onClick }) => {
  return React.createElement('button', {
    onClick: () => onClick(id),
    className: `tab-button ${isActive ? 'active' : 'inactive'}`
  }, label);
};

const QuoteCard = ({ quote, author, context, bgColor = "gray" }) => {
  return React.createElement('div', { className: `quote-card ${bgColor}` },
    React.createElement('blockquote', { className: `quote-text ${bgColor}` },
      React.createElement(IconQuote, { className: "inline w-4 h-4 mr-1" }),
      '"', quote, '"'
    ),
    React.createElement('div', { className: `quote-author ${bgColor}` },
      React.createElement('strong', null, "— ", author),
      context && React.createElement('div', { className: "text-xs mt-1" }, context)
    )
  );
};

// Main Content Components
const MainContent = ({ data, openModal, tooltipVisible, setTooltipVisible, expandedSections, toggleSection }) => {
  return React.createElement('div', { className: "space-y-6" },
    // Clickbait Challenge
    React.createElement('div', { className: "quote-card red" },
      React.createElement('h3', { className: "font-bold text-red-800 mb-2" }, data.clickbait_challenge.title),
      React.createElement('p', { className: "text-red-700 mb-3" }, data.clickbait_challenge.description),
      React.createElement(QuoteCard, {
        quote: data.clickbait_challenge.quote.text,
        author: data.clickbait_challenge.quote.author,
        bgColor: "red"
      })
    ),

    // Survivor Strategy
    React.createElement('div', { className: "bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg" },
      React.createElement('h3', { className: "text-xl font-bold mb-3 text-center" }, data.survivor_strategy.title),
      React.createElement('div', { className: "grid-3" },
        ...data.survivor_strategy.elements.map((element, index) =>
          React.createElement('div', { key: index, className: "bg-white p-4 rounded shadow" },
            React.createElement('div', { className: "text-2xl mb-2" }, element.icon),
            React.createElement('h4', { className: "font-semibold" }, element.title),
            React.createElement('p', { className: "text-sm" }, element.description)
          )
        )
      )
    ),

    // Enemy's Attack
    React.createElement('div', { className: "grid-2" },
      React.createElement('div', { className: "bg-orange-50 p-4 rounded-lg border border-orange-200" },
        React.createElement('h3', { className: "font-bold text-orange-800 mb-3 flex items-center" },
          React.createElement(IconTarget, { className: "mr-2", size: 20 }),
          data.enemy_attack.temptation.title
        ),
        React.createElement('p', { className: "text-orange-700 mb-2" },
          React.createElement(Tooltip, {
            content: "Satan's role as one who entices toward sin",
            id: "tempter",
            tooltipVisible,
            setTooltipVisible
          }, "The Tempter"),
          " distorts God's word and makes sin appear attractive."
        ),
                  React.createElement('button', {
            onClick: () => openModal({
              title: data.enemy_attack.temptation.scripture.reference,
              body: React.createElement('div', { className: "text-gray-700" }, 
                `"${data.enemy_attack.temptation.scripture.text}"`)
            }),
            className: "text-blue-600 hover:text-blue-800 text-sm flex items-center"
          },
            React.createElement(IconBookOpen, { size: 16, className: "mr-1" }),
            "See Scripture"
          )
      ),
      React.createElement('div', { className: "bg-red-50 p-4 rounded-lg border border-red-200" },
        React.createElement('h3', { className: "font-bold text-red-800 mb-3 flex items-center" },
          React.createElement(IconEye, { className: "mr-2", size: 20 }),
          data.enemy_attack.accusation.title
        ),
        React.createElement('p', { className: "text-red-700 mb-2" },
          React.createElement(Tooltip, {
            content: "Lying is Satan's native language - what he naturally speaks",
            id: "lies",
            tooltipVisible,
            setTooltipVisible
          }, "The Father of Lies"),
          " accuses and condemns to create shame and despair."
        ),
                  React.createElement('button', {
            onClick: () => openModal({
              title: data.enemy_attack.accusation.scripture.reference,
              body: React.createElement('div', { className: "text-gray-700" }, 
                `"${data.enemy_attack.accusation.scripture.text}"`)
            }),
            className: "text-blue-600 hover:text-blue-800 text-sm flex items-center"
          },
            React.createElement(IconBookOpen, { size: 16, className: "mr-1" }),
            "See Scripture"
          )
      )
    ),

    // Pastor Brett on Alertness (First quote scattered)
    React.createElement(QuoteCard, {
      quote: data.pastor_quotes[0].text,
      author: data.pastor_quotes[0].author,
      context: data.pastor_quotes[0].context,
      bgColor: data.pastor_quotes[0].color
    }),

    // Baxter's Categories
    React.createElement('div', { className: "bg-gray-50 p-6 rounded-lg" },
      React.createElement('h3', { className: "text-lg font-bold mb-4 text-center" }, data.baxter_categories.title),
      React.createElement('p', { className: "text-gray-600 text-center mb-4 text-sm italic" }, data.baxter_categories.subtitle),
      React.createElement('div', { className: "grid-4" },
        ...data.baxter_categories.categories.map((category, index) =>
          React.createElement('div', { key: index, className: "bg-white p-4 rounded text-center shadow-sm" },
            React.createElement('div', { className: "text-2xl mb-2" }, category.icon),
            React.createElement('h4', { className: "font-semibold mb-1" }, category.title),
            React.createElement('p', { className: "text-xs text-gray-600" }, category.description)
          )
        )
      )
    ),

    // Brooks' Devices
    React.createElement('div', { className: "space-y-6" },
      React.createElement('div', null,
        React.createElement('h3', { className: "text-xl font-bold mb-4 text-center" }, data.brooks_devices.title),
        React.createElement('p', { className: "text-center text-gray-600 mb-6 italic" }, data.brooks_devices.subtitle),

        // Temptation Devices
        React.createElement('div', { className: "expandable-section" },
          React.createElement('button', {
            onClick: () => toggleSection('temptation'),
            className: "expandable-trigger temptation"
          },
            React.createElement('span', { className: "flex items-center" },
              React.createElement(IconTarget, { className: "mr-2", size: 20 }),
              "5 Devices of Temptation"
            ),
            expandedSections.temptation ? 
              React.createElement(IconChevronDown, { size: 20 }) : 
              React.createElement(IconChevronRight, { size: 20 })
          ),
          expandedSections.temptation && React.createElement('div', { className: "expandable-content" },
            ...data.brooks_devices.temptation.map((device, index) =>
              React.createElement('div', { key: index, className: "device-card temptation" },
                React.createElement('h4', { className: "device-title temptation" },
                  React.createElement('span', { className: "device-icon" }, device.icon),
                  device.title
                ),
                React.createElement('p', { className: "device-description" }, device.description),
                React.createElement('div', { className: "device-example temptation" },
                  "Example: ", device.example
                )
              )
            )
          )
        ),

        // Accusation Devices
        React.createElement('div', { className: "expandable-section" },
          React.createElement('button', {
            onClick: () => toggleSection('accusation'),
            className: "expandable-trigger accusation"
          },
            React.createElement('span', { className: "flex items-center" },
              React.createElement(IconEye, { className: "mr-2", size: 20 }),
              "4 Devices of Accusation"
            ),
            expandedSections.accusation ? 
              React.createElement(IconChevronDown, { size: 20 }) : 
              React.createElement(IconChevronRight, { size: 20 })
          ),
          expandedSections.accusation && React.createElement('div', { className: "expandable-content" },
            ...data.brooks_devices.accusation.map((device, index) =>
              React.createElement('div', { key: index, className: "device-card accusation" },
                React.createElement('h4', { className: "device-title accusation" },
                  React.createElement('span', { className: "device-icon" }, device.icon),
                  device.title
                ),
                React.createElement('p', { className: "device-description" }, device.description),
                React.createElement('div', { className: "device-example accusation" },
                  "Example: ", device.example
                )
              )
            )
          )
        )
      )
    ),

    // Grace Quote from Pastor Brett (Second quote scattered)
    React.createElement(QuoteCard, {
      quote: data.pastor_quotes[1].text,
      author: data.pastor_quotes[1].author,
      context: data.pastor_quotes[1].context,
      bgColor: data.pastor_quotes[1].color
    }),

    // Church as Hospital Quote (Third quote scattered)
    React.createElement(QuoteCard, {
      quote: data.pastor_quotes[2].text,
      author: data.pastor_quotes[2].author,
      context: data.pastor_quotes[2].context,
      bgColor: data.pastor_quotes[2].color
    }),

    // Worship as Warfare
    React.createElement('div', { className: "bg-purple-50 p-6 rounded-lg border border-purple-200" },
      React.createElement('h3', { className: "text-lg font-bold text-purple-800 mb-4 flex items-center" },
        React.createElement(IconHeart, { className: "mr-2", size: 20 }),
        "Worship as Warfare"
      ),
      React.createElement('div', { className: "mb-4" },
        ...data.worship_warfare.kwen_quotes.map((quote, index) =>
          React.createElement('div', { key: index, className: "mb-4" },
            React.createElement(QuoteCard, {
              quote: quote.text,
              author: quote.author,
              context: quote.context,
              bgColor: quote.color
            })
          )
        )
      ),
      React.createElement('div', { className: "space-y-4" },
        ...data.worship_warfare.practices.map((practice, index) =>
          React.createElement('div', { key: index, className: "bg-white p-4 rounded" },
            React.createElement('h4', { className: "font-semibold mb-2" }, practice.title),
            React.createElement('p', { className: "text-gray-700 text-sm" }, practice.description)
          )
        )
      )
    ),

    // Worship Quote (Fourth quote scattered)
    React.createElement(QuoteCard, {
      quote: data.pastor_quotes[3].text,
      author: data.pastor_quotes[3].author,
      context: data.pastor_quotes[3].context,
      bgColor: data.pastor_quotes[3].color
    }),

    // Victory Declaration
    React.createElement('div', { className: "bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center" },
      React.createElement('h3', { className: "text-xl font-bold mb-3" }, data.victory_declaration.title),
      React.createElement('p', { className: "mb-4" },
        `"${data.victory_declaration.verse}"`,
        React.createElement('span', { className: "text-sm opacity-90 block mt-1" }, 
          `- ${data.victory_declaration.reference}`)
      ),
      React.createElement('div', { className: "text-sm opacity-90" }, data.victory_declaration.message)
    )
  );
};

const BibleTab = ({ data }) => {
  return React.createElement('div', { className: "space-y-6" },
    React.createElement('h2', { className: "text-2xl font-bold text-center mb-6" }, "📖 Scripture Foundation"),
    React.createElement('div', { className: "grid gap-4" },
      ...data.bible_verses.map((verse, index) =>
        React.createElement('div', { key: index, className: "bg-blue-50 p-4 rounded-lg border border-blue-200" },
          React.createElement('h3', { className: "font-bold text-blue-800 mb-2" }, verse.reference),
          React.createElement('blockquote', { className: "text-gray-700 italic mb-2 border-l-4 border-blue-400 pl-4" },
            `"${verse.text}"`
          ),
          React.createElement('p', { className: "text-sm text-gray-600" }, verse.context)
        )
      )
    ),
    React.createElement('div', { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-300" },
      React.createElement('h3', { className: "font-bold text-yellow-800 mb-2" }, "🔑 Key Themes"),
      React.createElement('ul', { className: "space-y-2 text-gray-700" },
        React.createElement('li', null, "• ", React.createElement('strong', null, "Awareness:"), " \"We are not unaware of his schemes\""),
        React.createElement('li', null, "• ", React.createElement('strong', null, "Vigilance:"), " \"Be alert and of sober mind\""),
        React.createElement('li', null, "• ", React.createElement('strong', null, "Shrewdness:"), " \"Be as shrewd as snakes\""),
        React.createElement('li', null, "• ", React.createElement('strong', null, "Truth:"), " Satan is \"the father of lies\""),
        React.createElement('li', null, "• ", React.createElement('strong', null, "Worship:"), " \"In spirit and in truth\"")
      )
    )
  );
};

const PracticalTab = ({ data }) => {
  return React.createElement('div', { className: "space-y-6" },
    React.createElement('h2', { className: "text-2xl font-bold text-center mb-6" }, "⚡ Battle Plan"),
    React.createElement('div', { className: "grid-2" },
      React.createElement('div', { className: "bg-green-50 p-4 rounded-lg" },
        React.createElement('h3', { className: "font-bold text-green-800 mb-3 flex items-center" },
          React.createElement(IconShield, { className: "mr-2", size: 20 }),
          "Defensive Strategies"
        ),
        React.createElement('ul', { className: "space-y-2 text-green-700" },
          React.createElement('li', null, "✓ Regular Scripture reading and memorization"),
          React.createElement('li', null, "✓ Corporate worship and community involvement"),
          React.createElement('li', null, "✓ Accountability relationships in care groups"),
          React.createElement('li', null, "✓ Prayer and dependence on the Holy Spirit"),
          React.createElement('li', null, "✓ Understanding your particular vulnerabilities")
        )
      ),
      React.createElement('div', { className: "bg-red-50 p-4 rounded-lg" },
        React.createElement('h3', { className: "font-bold text-red-800 mb-3 flex items-center" },
          React.createElement(IconSword, { className: "mr-2", size: 20 }),
          "Offensive Strategies"
        ),
        React.createElement('ul', { className: "space-y-2 text-red-700" },
          React.createElement('li', null, "⚔️ Worship as lifestyle warfare"),
          React.createElement('li', null, "⚔️ Speaking truth against lies"),
          React.createElement('li', null, "⚔️ Serving others and advancing God's kingdom"),
          React.createElement('li', null, "⚔️ Forgiveness and grace-filled living"),
          React.createElement('li', null, "⚔️ Bearing witness to Christ's victory")
        )
      )
    ),
    // Personal Assessment and Daily Checklist sections would continue here...
    React.createElement('div', { className: "bg-purple-50 p-6 rounded-lg" },
      React.createElement('h3', { className: "font-bold text-purple-800 mb-4" }, "🎯 Personal Assessment"),
      React.createElement('div', { className: "space-y-4" },
        React.createElement('div', null,
          React.createElement('h4', { className: "font-semibold mb-2" }, "Which temptation devices affect you most?"),
          React.createElement('div', { className: "grid-2 gap-2 text-sm" },
            ...data.brooks_devices.temptation.map((device, index) =>
              React.createElement('label', { key: index, className: "checklist-item" },
                React.createElement('input', { type: "checkbox", className: "checklist-checkbox" }),
                React.createElement('span', null, `${device.icon} ${device.title}`)
              )
            )
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { className: "font-semibold mb-2" }, "Which accusation devices do you recognize?"),
          React.createElement('div', { className: "grid-2 gap-2 text-sm" },
            ...data.brooks_devices.accusation.map((device, index) =>
              React.createElement('label', { key: index, className: "checklist-item" },
                React.createElement('input', { type: "checkbox", className: "checklist-checkbox" }),
                React.createElement('span', null, `${device.icon} ${device.title}`)
              )
            )
          )
        )
      )
    ),

    // Daily Worship Checklist
    React.createElement('div', { className: "bg-gray-50 p-4 rounded-lg" },
      React.createElement('h3', { className: "font-bold text-gray-800 mb-3" }, "📅 Daily Worship Checklist"),
      React.createElement('div', { className: "grid md:grid-cols-2 gap-4 text-sm" },
        React.createElement('div', null,
          React.createElement('h4', { className: "font-semibold text-green-700 mb-2" }, "Say YES to:"),
          React.createElement('ul', { className: "space-y-1 text-gray-700" },
            React.createElement('li', null, "☐ Morning prayer/devotion"),
            React.createElement('li', null, "☐ Scripture reading"),
            React.createElement('li', null, "☐ Serving others"),
            React.createElement('li', null, "☐ Gratitude practice"),
            React.createElement('li', null, "☐ Fellowship/community")
          )
        ),
        React.createElement('div', null,
          React.createElement('h4', { className: "font-semibold text-red-700 mb-2" }, "Say NO to:"),
          React.createElement('ul', { className: "space-y-1 text-gray-700" },
            React.createElement('li', null, "☐ Destructive media consumption"),
            React.createElement('li', null, "☐ Gossip and criticism"),
            React.createElement('li', null, "☐ Self-condemnation"),
            React.createElement('li', null, "☐ Isolation from believers"),
            React.createElement('li', null, "☐ Spiritual laziness")
          )
        )
      )
    )
  );
};

const ReflectionTab = ({ data }) => {
  return React.createElement('div', { className: "space-y-6" },
    React.createElement('h2', { className: "text-2xl font-bold text-center mb-6" }, "🤔 Personal Reflection"),
    React.createElement('div', { className: "space-y-6" },
      React.createElement('div', { className: "bg-blue-50 p-6 rounded-lg" },
        React.createElement('h3', { className: "font-bold text-blue-800 mb-4 flex items-center" },
          React.createElement(IconLightbulb, { className: "mr-2", size: 20 }),
          "Sermon Reflection Questions"
        ),
        React.createElement('div', { className: "space-y-4" },
          ...data.reflection_questions.slice(0, 2).map((question, index) =>
            React.createElement('div', { key: index, className: "bg-white p-4 rounded" },
              React.createElement('h4', { className: "font-semibold mb-2" }, `${index + 1}. ${question}`),
              React.createElement('textarea', {
                className: "reflection-textarea",
                placeholder: index === 0 ? 
                  "Consider your specific vulnerabilities, past patterns, and current life circumstances..." :
                  "Think about negative thoughts, discouraging messages, or false beliefs you struggle with..."
              })
            )
          )
        )
      ),
      React.createElement('div', { className: "bg-yellow-50 p-6 rounded-lg" },
        React.createElement('h3', { className: "font-bold text-yellow-800 mb-4" }, "💭 Additional Reflection"),
        React.createElement('div', { className: "space-y-4" },
          ...data.reflection_questions.slice(2).map((question, index) =>
            React.createElement('div', { key: index, className: "bg-white p-4 rounded" },
              React.createElement('h4', { className: "font-semibold mb-2" }, question),
              React.createElement('textarea', {
                className: "reflection-textarea",
                style: { minHeight: '5rem' },
                placeholder: index === 0 ? 
                  "Reflect on times when worship, prayer, or Scripture changed your perspective..." :
                  index === 1 ? 
                  "Consider areas where you've been spiritually naive or passive..." :
                  "Choose one specific action to strengthen your spiritual defenses..."
              })
            )
          )
        )
      ),
      React.createElement('div', { className: "bg-green-50 p-4 rounded-lg" },
        React.createElement('h3', { className: "font-bold text-green-800 mb-3" }, "🙏 Prayer Points"),
        React.createElement('ul', { className: "space-y-2 text-green-700" },
          ...data.prayer_points.map((point, index) =>
            React.createElement('li', { key: index }, `• ${point}`)
          )
        )
      )
    )
  );
};