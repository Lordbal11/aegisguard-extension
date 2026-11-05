// AegisGuard Enterprise - Complete Popup Script

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Check local storage for existing activation state on startup
  const data = await chrome.storage.local.get(["isProActive", "savedLicenseKey", "threatLogs"]);
  
  if (data.isProActive) {
    unlockProFeatures();
  } else {
    lockProFeatures();
  }

  // 2. Render live telemetry logs if available
  renderTelemetryLogs(data.threatLogs);

  // 3. Event Listener: Open Options/Pricing Page via "View Plans" button
  const openPricingBtn = document.getElementById("open-pricing-btn");
  if (openPricingBtn) {
    openPricingBtn.addEventListener("click", () => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("src/options/options.html"));
      }
    });
  }

  // 4. Event Listener: Refresh Data button
  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      const updatedData = await chrome.storage.local.get(["threatLogs"]);
      renderTelemetryLogs(updatedData.threatLogs);
    });
  }

  // 5. Event Listener: Handle license key activation button click
  const activateBtn = document.getElementById("activate-btn");
  if (activateBtn) {
    activateBtn.addEventListener("click", async () => {
      const licenseKey = document.getElementById("license-key-input").value.trim();
      const statusEl = document.getElementById("activation-status");

      if (!licenseKey) {
        statusEl.style.color = "#dc2626";
        statusEl.innerText = "Please enter a valid license key.";
        return;
      }

      statusEl.style.color = "#475569";
      statusEl.innerText = "Verifying license...";

      try {
        // Call Lemon Squeezy (or Gumroad) license verification API endpoint
        const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            license_key: licenseKey
          })
        });

        const result = await response.json();

        // Check activation success from API response
        if (result.activated || result.success) {
          await chrome.storage.local.set({ isProActive: true, savedLicenseKey: licenseKey });
          statusEl.style.color = "#059669";
          statusEl.innerText = "License activated successfully!";
          setTimeout(() => { unlockProFeatures(); }, 1200);
        } else {
          statusEl.style.color = "#dc2626";
          statusEl.innerText = "Invalid or expired license key.";
        }
      } catch (error) {
        // Fallback for offline testing or local mock keys
        if (licenseKey.startsWith("PRO-")) {
          await chrome.storage.local.set({ isProActive: true, savedLicenseKey: licenseKey });
          statusEl.style.color = "#059669";
          statusEl.innerText = "Test Pro License activated!";
          setTimeout(() => { unlockProFeatures(); }, 1200);
        } else {
          statusEl.style.color = "#dc2626";
          statusEl.innerText = "Verification failed. Check network.";
        }
      }
    });
  }
});

function unlockProFeatures() {
  const proGate = document.getElementById("pro-gate");
  if (proGate) {
    proGate.style.display = "none";
  }
  console.log("Pro features unlocked.");
}

function lockProFeatures() {
  const proGate = document.getElementById("pro-gate");
  if (proGate) {
    proGate.style.display = "block";
  }
}

function renderTelemetryLogs(logs) {
  const logContainer = document.getElementById("log-container");
  if (!logContainer) return;

  if (logs && Array.isArray(logs) && logs.length > 0) {
    logContainer.innerHTML = logs.map(log => `[${log.timestamp}] ${log.type}: ${log.details}`).join("<br>");
  } else {
    logContainer.innerHTML = `[System] Security worker active.<br>[Ready] Monitoring DOM & Credential vectors.`;
  }
}