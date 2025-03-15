/**
 * OldGoogle Search Extension - Welcome Page Script
 * 
 * This script handles the interactive functionality of the OldGoogle Search
 * extension's welcome page, including style selection, button actions,
 * and modal dialogs.
 * 
 * @author OldGoogle Search Extension Team
 * @version 1.0.0
 */

(function() {
  'use strict';

  // DOM elements cache
  const elements = {
    styleCards: document.querySelectorAll('.style-card'),
    styleRadios: document.querySelectorAll('.style-checkbox'),
    saveButton: document.getElementById('saveButton'),
    visitHomeButton: document.getElementById('visitHomeButton'),
    defaultSearchButton: document.getElementById('defaultSearchButton'),
    defaultHomeButton: document.getElementById('defaultHomeButton'),
    modals: document.querySelectorAll('.help-modal'),
    closeModalButtons: document.querySelectorAll('.modal-close')
  };

  // Configuration
  const config = {
    storageKey: 'designStyle',
    homePageUrl: 'https://oldgoogle-home/',
    defaultStyle: '1998'
  };

  // Cross-browser storage API
  const storage = (typeof browser !== 'undefined' ? browser.storage : chrome.storage);

  /**
   * Initialize the welcome page functionality
   */
  function init() {
    loadSavedPreference();
    attachEventListeners();
  }

  /**
   * Load any previously saved style preference
   */
  function loadSavedPreference() {
    try {
      storage.local.get(config.storageKey, function(data) {
        if (data && data[config.storageKey]) {
          const savedStyle = data[config.storageKey];
          selectStyle(savedStyle);
        } else {
          // Select default style if no preference is saved
          selectStyle(config.defaultStyle);
        }
      });
    } catch (error) {
      console.error('Error loading saved preference:', error);
      // Fall back to default style on error
      selectStyle(config.defaultStyle);
    }
  }

  /**
   * Attach event listeners to interactive elements
   */
  function attachEventListeners() {
    // Style card selection
    elements.styleCards.forEach(card => {
      card.addEventListener('click', handleStyleCardClick);
    });

    // Radio buttons
    elements.styleRadios.forEach(radio => {
      radio.addEventListener('change', handleRadioChange);
    });

    // Action buttons
    if (elements.saveButton) {
      elements.saveButton.addEventListener('click', handleSavePreference);
    }
    
    if (elements.visitHomeButton) {
      elements.visitHomeButton.addEventListener('click', handleVisitHome);
    }
    
    if (elements.defaultSearchButton) {
      elements.defaultSearchButton.addEventListener('click', () => toggleModal('defaultSearchModal'));
    }
    
    if (elements.defaultHomeButton) {
      elements.defaultHomeButton.addEventListener('click', () => toggleModal('defaultHomeModal'));
    }

    // Modal close buttons
    elements.closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        toggleModal(modalId);
      });
    });

    // Close modal on outside click
    window.addEventListener('click', handleOutsideClick);
  }

  /**
   * Handle click on a style card
   * @param {Event} event - The click event
   */
  function handleStyleCardClick(event) {
    const card = event.currentTarget;
    const year = card.getAttribute('data-year');
    const radio = card.querySelector('.style-checkbox');
    
    if (radio) {
      radio.checked = true;
      selectStyle(year);
    }
  }

  /**
   * Handle change of a radio button
   * @param {Event} event - The change event
   */
  function handleRadioChange(event) {
    const radio = event.currentTarget;
    const year = radio.value;
    selectStyle(year);
  }

  /**
   * Select a specific style
   * @param {string} year - The year/style identifier
   */
  function selectStyle(year) {
    // Remove selection from all cards
    elements.styleCards.forEach(card => {
      card.classList.remove('selected');
    });

    // Uncheck all radios
    elements.styleRadios.forEach(radio => {
      radio.checked = false;
    });

    // Find and select the matching card and radio
    const targetCard = document.querySelector(`.style-card[data-year="${year}"]`);
    const targetRadio = document.querySelector(`.style-checkbox[value="${year}"]`);

    if (targetCard) {
      targetCard.classList.add('selected');
    }

    if (targetRadio) {
      targetRadio.checked = true;
    }
  }

  /**
   * Handle saving the user's style preference
   */
  function handleSavePreference() {
    const selectedRadio = document.querySelector('.style-checkbox:checked');
    
    if (selectedRadio) {
      const selectedStyle = selectedRadio.value;
      
      try {
        storage.local.set({ [config.storageKey]: selectedStyle }, function() {
          showStatusMessage('Preference saved successfully!');
        });
      } catch (error) {
        console.error('Error saving preference:', error);
        showStatusMessage('Error saving preference. Please try again.', 'error');
      }
    } else {
      showStatusMessage('Please select a style first.', 'warning');
    }
  }

  /**
   * Handle visiting the OldGoogle home page
   */
  function handleVisitHome() {
    // Cross-browser tabs API
    const tabs = (typeof browser !== 'undefined' ? browser.tabs : chrome.tabs);
    tabs.create({ url: config.homePageUrl });
  }

  /**
   * Toggle the visibility of a modal dialog
   * @param {string} modalId - The ID of the modal to toggle
   */
  function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
      const isActive = modal.classList.contains('is-active');
      
      if (isActive) {
        modal.classList.remove('is-active');
      } else {
        modal.classList.add('is-active');
      }
    }
  }

  /**
   * Handle clicks outside of an open modal to close it
   * @param {Event} event - The click event
   */
  function handleOutsideClick(event) {
    elements.modals.forEach(modal => {
      if (event.target === modal) {
        const modalId = modal.id;
        toggleModal(modalId);
      }
    });
  }

  /**
   * Display a status message to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of message (success, error, warning)
   */
  function showStatusMessage(message, type = 'success') {
    // Check if a status message element already exists
    let statusElement = document.querySelector('.status-message');
    
    // Create one if it doesn't exist
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.className = 'status-message';
      document.querySelector('.buttons-container').insertAdjacentElement('afterend', statusElement);
    }
    
    // Set message and type
    statusElement.textContent = message;
    statusElement.className = `status-message status-message--${type}`;
    
    // Show the message
    statusElement.style.display = 'block';
    
    // Hide after a delay
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }

  // Initialize when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', init);
})();