// Check if the extension is being installed for the first time
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open the welcome page when the extension is installed
    browser.tabs.create({
      url: browser.runtime.getURL("welcome.html")
    });
    
    // Set the default design style to 2013
    browser.storage.local.set({ designStyle: "2013" });
  }
});

// When the extension icon is clicked, open the welcome page
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    url: browser.runtime.getURL("welcome.html")
  });
});

// Update the search URL when the design style changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.designStyle) {
    // No need to do anything here now, as we get the URLs dynamically
    // in the search.js file when requests are made
  }
});