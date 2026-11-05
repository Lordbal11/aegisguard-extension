// AegisGuard Enterprise - Options Script (BMJ Synthetix Labs)

document.addEventListener("DOMContentLoaded", () => {
  const upgradeBtn = document.getElementById("upgrade-btn");
  
  if (upgradeBtn) {
    upgradeBtn.addEventListener("click", () => {
      // Official BMJ Synthetix Labs Lemon Squeezy checkout URL for AegisGuard Pro
      // (Make sure to replace 'your-product-uuid-here' with your actual Lemon Squeezy product checkout ID)
      const checkoutUrl = "https://bmj-synthetix-labs.lemonsqueezy.com/checkout/buy/your-product-uuid-here";
      
      // Open checkout link securely in a new browser tab as required by Manifest V3
      chrome.tabs.create({ url: checkoutUrl }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error("Error opening checkout tab:", chrome.runtime.lastError.message);
        } else {
          console.log("Opened Lemon Squeezy checkout tab successfully:", tab.id);
        }
      });
    });
  }
});