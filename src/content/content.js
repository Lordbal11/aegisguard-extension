// AegisGuard Enterprise - Content Script (DOM Telemetry & Credential Monitoring)

(function () {
  'use strict';

  console.log("AegisGuard Enterprise content script active on:", window.location.href);

  // Monitor DOM mutations to detect password fields or sensitive forms injected dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        checkForCredentialInputs();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initial check on page load
  window.addEventListener("DOMContentLoaded", () => {
    checkForCredentialInputs();
    monitorFormSubmissions();
  });

  function checkForCredentialInputs() {
    const passwordFields = document.querySelectorAll("input[type='password']");
    if (passwordFields.length > 0) {
      // Notify background service worker of potential credential exposure vector
      chrome.runtime.sendMessage({
        action: "DOM_THREAT_DETECTED",
        threatType: "CREDENTIAL_FIELD_EXPOSURE",
        url: window.location.href,
        count: passwordFields.length,
        timestamp: Date.now()
      }).catch((err) => {
        // Suppress extension context invalidation errors during reloads
      });
    }
  }

  function monitorFormSubmissions() {
    document.addEventListener("submit", (event) => {
      const form = event.target;
      const hasPassword = form.querySelector("input[type='password']") !== null;

      if (hasPassword) {
        // Log form submission event targeting credentials
        chrome.runtime.sendMessage({
          action: "DOM_THREAT_DETECTED",
          threatType: "CREDENTIAL_SUBMISSION",
          url: window.location.href,
          timestamp: Date.now()
        }).catch((err) => {});
      }
    }, true);
  }
})();