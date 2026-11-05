// AegisGuard Enterprise - Background Service Worker

// Initialize default storage on installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("AegisGuard Enterprise extension installed.");
  chrome.storage.local.get(["telemetryLogs"], (result) => {
    if (!result.telemetryLogs) {
      chrome.storage.local.set({ telemetryLogs: [] });
    }
  });
});

// Listen for messages from the popup dashboard or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "SIMULATE_AI_ANOMALY") {
    handleThreatSimulation().then((newLogs) => {
      sendResponse({ status: "SUCCESS", logs: newLogs });
    });
    return true; // Keeps the messaging channel open for asynchronous response
  }
});

async function handleThreatSimulation() {
  const data = await chrome.storage.local.get(["telemetryLogs"]);
  const existingLogs = data.telemetryLogs || [];

  // Generate simulated AI threat events
  const simulatedEvents = [
    {
      type: "DOM_CREDENTIAL_HARVEST",
      extensionName: "SmartSync Assistant (Simulated AI Breach)",
      severity: "CRITICAL",
      aiScoreAfter: 98,
      aiEnforcement: "AI_EXECUTION_REVOKED",
      timestamp: Date.now()
    },
    {
      type: "RUNTIME_NETWORK_FETCH",
      extensionName: "SmartSync Assistant (Simulated AI Breach)",
      severity: "HIGH",
      aiScoreAfter: 85,
      aiEnforcement: "AI_NETWORK_ISOLATED (untrusted-exfiltration)",
      timestamp: Date.now() + 10
    },
    {
      type: "API_CLIPBOARD_READ",
      extensionName: "SmartSync Assistant (Simulated AI Breach)",
      severity: "MEDIUM",
      aiScoreAfter: 62,
      aiEnforcement: "LOGGED_BY_AI",
      timestamp: Date.now() + 20
    }
  ];

  // Prepend new simulated logs to the existing log array
  const updatedLogs = [...simulatedEvents, ...existingLogs];

  // Save back to local storage
  await chrome.storage.local.set({ telemetryLogs: updatedLogs });
  return updatedLogs;
}