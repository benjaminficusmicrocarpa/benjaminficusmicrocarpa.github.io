/**
 * Purpose Theme Interactions - Enhanced features for life-stage sermon
 * Extends IECC Generic2 with purpose-driven animations and interactions
 */

// Life Stage Progression System
const LifeStageManager = {
    stages: ['singleness', 'marriage', 'parenting'],
    currentStage: 0,
    
    init() {
      this.createProgressIndicator();
      this.bindStageNavigation();
      this.animateStageTransitions();
    },
    
    createProgressIndicator() {
      const progressContainer = document.querySelector('.life-journey-progress');
      if (!progressContainer) return;
      
      this.stages.forEach((stage, index) => {
        const stepElement = progressContainer.children[index];
        if (stepElement) {
          stepElement.addEventListener('click', () => this.navigateToStage(index));
        }
      });
    },
    
    navigateToStage(stageIndex) {
      // Update progress indicators
      document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < stageIndex) {
          step.classList.add('completed');
        } else if (index === stageIndex) {
          step.classList.add('active');
        }
      });
      
      // Show relevant content section
      this.showStageContent(this.stages[stageIndex]);
      this.currentStage = stageIndex;
      
      // Trigger content animations
      this.animateStageContent(this.stages[stageIndex]);
    },
    
    showStageContent(stageName) {
      // Hide all stage content
      document.querySelectorAll('[data-stage-content]').forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('slide-up');
      });
      
      // Show selected stage content
      const targetContent = document.querySelector(`[data-stage-content="${stageName}"]`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        
        // Delayed animation for smooth transition
        setTimeout(() => {
          targetContent.classList.add('slide-up');
        }, 100);
      }
    },
    
    animateStageContent(stageName) {
      const stageCards = document.querySelectorAll(`[data-stage="${stageName}"] .life-stage-card`);
      
      stageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          card.style.transition = 'all 0.6s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 200);
      });
    },
    
    animateStageTransitions() {
      // Set up intersection observer for automatic stage progression
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const stageIndex = this.stages.indexOf(entry.target.dataset.stage);
            if (stageIndex !== -1) {
              this.navigateToStage(stageIndex);
            }
          }
        });
      }, { threshold: 0.5 });
      
      // Observe stage sections
      document.querySelectorAll('[data-stage]').forEach(section => {
        observer.observe(section);
      });
    }
  };
  
  // Scripture Interaction Enhancements
  const ScriptureEnhancer = {
    init() {
      this.enhanceScriptureReferences();
      this.addScriptureHoverEffects();
    },
    
    enhanceScriptureReferences() {
      document.querySelectorAll('.scripture-reference').forEach(ref => {
        ref.addEventListener('click', (e) => {
          e.preventDefault();
          this.showScriptureContext(ref);
        });
      });
    },
    
    showScriptureContext(refElement) {
      const reference = refElement.textContent;
      const scriptureText = refElement.previousElementSibling?.textContent || '';
      
      // Use Generic2's modal system
      window.IECCGeneric2.ModalSystem.open('scripture-modal', {
        title: reference,
        content: `
          <div class="scripture-royal">
            <p class="text-lg italic mb-4">${scriptureText}</p>
            <p class="scripture-reference">${reference}</p>
          </div>
          <div class="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 class="font-semibold text-purple-900 mb-2">Context & Application</h4>
            <p class="text-purple-800">This passage encourages us to find our purpose in ${this.getScriptureContext(reference)}</p>
          </div>
        `
      });
    },
    
    getScriptureContext(reference) {
      const contexts = {
        '1 Corinthians 7': 'understanding singleness as a gift for devoted service to God',
        'Ephesians 5': 'building marriages that reflect Christ\'s love for the church',
        'Proverbs 22:6': 'raising children with intentional spiritual training',
        'Deuteronomy 6': 'creating homes where faith is lived out daily'
      };
      
      for (const [key, context] of Object.entries(contexts)) {
        if (reference.includes(key)) {
          return context;
        }
      }
      return 'glorifying God in our current season of life';
    },
    
    addScriptureHoverEffects() {
      document.querySelectorAll('.scripture-royal').forEach(scripture => {
        scripture.addEventListener('mouseenter', () => {
          scripture.classList.add('royal-glow');
        });
        
        scripture.addEventListener('mouseleave', () => {
          scripture.classList.remove('royal-glow');
        });
      });
    }
  };
  
  // Reflection Questions Interactive System
  const ReflectionSystem = {
    init() {
      this.createReflectionTracker();
      this.enhanceReflectionItems();
    },
    
    createReflectionTracker() {
      const reflectionContainer = document.querySelector('.reflection-royal');
      if (!reflectionContainer) return;
      
      // Add progress tracking
      const progressDiv = document.createElement('div');
      progressDiv.className = 'reflection-progress mb-6';
      progressDiv.innerHTML = `
        <div class="flex items-center justify-between text-sm text-purple-600">
          <span>Reflection Progress</span>
          <span id="reflection-count">0 of ${document.querySelectorAll('.reflection-item').length} considered</span>
        </div>
        <div class="w-full bg-purple-200 rounded-full h-2 mt-2">
          <div id="reflection-bar" class="bg-purple-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      `;
      
      reflectionContainer.insertBefore(progressDiv, reflectionContainer.firstChild.nextSibling);
    },
    
    enhanceReflectionItems() {
      const items = document.querySelectorAll('.reflection-item');
      let consideredCount = 0;
      
      items.forEach((item, index) => {
        // Add consideration button
        const button = document.createElement('button');
        button.className = 'mt-3 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors';
        button.textContent = 'Mark as Considered';
        button.onclick = () => {
          if (!item.classList.contains('considered')) {
            item.classList.add('considered');
            item.style.background = 'linear-gradient(135deg, rgb(124 58 237 / 0.1), rgb(253 230 138 / 0.1))';
            button.textContent = '✓ Considered';
            button.disabled = true;
            button.className = 'mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-lg';
            
            consideredCount++;
            this.updateProgress(consideredCount, items.length);
          }
        };
        
        item.appendChild(button);
      });
    },
    
    updateProgress(considered, total) {
      const countElement = document.getElementById('reflection-count');
      const barElement = document.getElementById('reflection-bar');
      
      if (countElement && barElement) {
        countElement.textContent = `${considered} of ${total} considered`;
        barElement.style.width = `${(considered / total) * 100}%`;
        
        if (considered === total) {
          setTimeout(() => {
            this.showCompletionMessage();
          }, 500);
        }
      }
    },
    
    showCompletionMessage() {
      const message = document.createElement('div');
      message.className = 'mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800';
      message.innerHTML = `
        <div class="flex items-center">
          <span class="text-2xl mr-3">🌟</span>
          <div>
            <h4 class="font-semibold">Reflection Complete!</h4>
            <p>You've thoughtfully considered all questions. How will you apply these insights in your current life stage?</p>
          </div>
        </div>
      `;
      
      document.querySelector('.reflection-royal').appendChild(message);
    }
  };
  
  // Quote Interaction System
  const QuoteEnhancer = {
    init() {
      this.enhanceAuthorQuotes();
      this.addQuoteSharing();
    },
    
    enhanceAuthorQuotes() {
      document.querySelectorAll('.author-quote-royal').forEach(quote => {
        quote.style.cursor = 'pointer';
        
        quote.addEventListener('click', () => {
          const author = quote.querySelector('.quote-attribution')?.textContent || 'Unknown';
          const text = quote.querySelector('.quote-text')?.textContent || quote.textContent;
          
          this.showQuoteDetails(author, text);
        });
      });
    },
    
    showQuoteDetails(author, text) {
      window.IECCGeneric2.ModalSystem.open('quote-modal', {
        title: `Wisdom from ${author}`,
        content: `
          <div class="author-quote-royal">
            <p class="quote-text text-lg">${text}</p>
            <p class="quote-attribution">— ${author}</p>
          </div>
          <div class="mt-6 space-y-4">
            <button onclick="QuoteEnhancer.shareQuote('${text}', '${author}')" 
                    class="btn btn-primary w-full">
              Share This Quote
            </button>
            <button onclick="QuoteEnhancer.saveQuote('${text}', '${author}')" 
                    class="btn btn-secondary w-full">
              Save for Later
            </button>
          </div>
        `
      });
    },
    
    shareQuote(text, author) {
      if (navigator.share) {
        navigator.share({
          title: `Quote from ${author}`,
          text: `"${text}" — ${author}`,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`"${text}" — ${author}`).then(() => {
          alert('Quote copied to clipboard!');
        });
      }
    },
    
    saveQuote(text, author) {
      const quotes = JSON.parse(localStorage.getItem('saved-quotes') || '[]');
      quotes.push({ text, author, date: new Date().toISOString() });
      localStorage.setItem('saved-quotes', JSON.stringify(quotes));
      
      alert('Quote saved! Check your browser\'s local storage.');
    },
    
    addQuoteSharing() {
      // Add subtle share icons to quotes
      document.querySelectorAll('.author-quote-royal').forEach(quote => {
        const shareIcon = document.createElement('div');
        shareIcon.className = 'absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity cursor-pointer';
        shareIcon.innerHTML = `
          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
        `;
        
        quote.style.position = 'relative';
        quote.appendChild(shareIcon);
      });
    }
  };
  
  // Purpose Theme Initializer
  const PurposeThemeManager = {
    init() {
      // Set the purpose theme
      window.IECCGeneric2.ThemeManager.setTheme('purpose');
      
      // Initialize all purpose-specific systems
      LifeStageManager.init();
      ScriptureEnhancer.init();
      ReflectionSystem.init();
      QuoteEnhancer.init();
      
      // Add purpose-specific event listeners
      this.bindPurposeEvents();
      
      console.log('🌟 Purpose Theme initialized successfully!');
    },
    
    bindPurposeEvents() {
      // Listen for theme changes
      window.addEventListener('themeChanged', (e) => {
        if (e.detail.theme === 'purpose') {
          this.applyPurposeAnimations();
        }
      });
      
      // Add purpose-driven scroll effects
      this.initPurposeScrollEffects();
    },
    
    applyPurposeAnimations() {
      // Add entrance animations to key elements
      document.querySelectorAll('.life-stage-card, .scripture-royal, .author-quote-royal').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          el.style.transition = 'all 0.6s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 150);
      });
    },
    
    initPurposeScrollEffects() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Special effects for different element types
            if (entry.target.classList.contains('transformation-highlight')) {
              setTimeout(() => {
                entry.target.classList.add('royal-glow');
              }, 500);
            }
          }
        });
      }, { threshold: 0.1 });
      
      // Observe transformation elements
      document.querySelectorAll('.transformation-highlight, .reflection-royal').forEach(el => {
        observer.observe(el);
      });
    }
  };
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Wait for Generic2 to initialize first
      setTimeout(() => {
        PurposeThemeManager.init();
      }, 100);
    });
  } else {
    setTimeout(() => {
      PurposeThemeManager.init();
    }, 100);
  }
  
  // Export for external use
  window.PurposeTheme = {
    LifeStageManager,
    ScriptureEnhancer,
    ReflectionSystem,
    QuoteEnhancer,
    PurposeThemeManager
  };