/**
 * Modal Functionality
 * Handles modal interactions for the Plant Etymology Database
 */

class ModalManager {
    constructor() {
        this.detailModal = null;
        this.initializeModal();
    }

    /**
     * Initialize modal functionality
     */
    initializeModal() {
        this.detailModal = document.getElementById('detailModal');
        
        if (this.detailModal) {
            this.detailModal.addEventListener('show.bs.modal', (event) => {
                this.handleModalShow(event);
            });
        }
    }

    /**
     * Handle modal show event
     * @param {Event} event - The modal show event
     */
    handleModalShow(event) {
        const button = event.relatedTarget;
        if (!button) return;

        // Extract data attributes from the triggering element
        const genus = button.getAttribute('data-genus');
        const gender = button.getAttribute('data-gender');
        const language = button.getAttribute('data-language');
        const chinese = button.getAttribute('data-chinese');
        const english = button.getAttribute('data-english');

        // Update modal content
        this.updateModalContent({
            genus,
            gender,
            language,
            chinese,
            english
        });
    }

    /**
     * Update modal content with plant etymology data
     * @param {Object} data - Plant etymology data
     */
    updateModalContent(data) {
        const { genus, gender, language, chinese, english } = data;

        // Set the modal title to the Latin genus name/specific epithet
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = `<span class="latin-name">${genus}</span>`;
        }

        // Update modal body content
        const modalGender = document.getElementById('modalGender');
        if (modalGender) {
            modalGender.textContent = gender;
        }

        const modalLanguage = document.getElementById('modalLanguage');
        if (modalLanguage) {
            modalLanguage.textContent = language;
        }

        const modalChinese = document.getElementById('modalChinese');
        if (modalChinese) {
            modalChinese.textContent = chinese;
        }

        const modalEnglish = document.getElementById('modalEnglish');
        if (modalEnglish) {
            modalEnglish.textContent = english;
        }
    }

    /**
     * Show modal with plant data
     * @param {Object} plantData - Plant etymology data
     */
    showModal(plantData) {
        this.updateModalContent(plantData);
        
        if (this.detailModal) {
            const modal = new bootstrap.Modal(this.detailModal);
            modal.show();
        }
    }

    /**
     * Hide modal
     */
    hideModal() {
        if (this.detailModal) {
            const modal = bootstrap.Modal.getInstance(this.detailModal);
            if (modal) {
                modal.hide();
            }
        }
    }
}

// Export for use in other modules
window.ModalManager = ModalManager;
