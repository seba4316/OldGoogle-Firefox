// This script allows us to redirect search requests to the OldGoogle service
// with the appropriate design style year

// Helper function to get the search URL for a specific year
function getSearchUrlForYear(year) {
  switch(year) {
    case "1998":
      return "https://oldgoogle.neocities.org/search-1998.html?q=";
    case "2009":
      return "https://oldgoogle.neocities.org/2009/search/?q=";
    case "2010":
      return "https://oldgoogle.neocities.org/2010/search/?q=";
    case "2011":
      return "https://oldgoogle.neocities.org/2012-search?q=";
    case "2013":
    default:
      return "https://oldgoogle.neocities.org/2013-search?q=";
  }
}

// Helper function to get the home page URL for a specific year
function getHomeUrlForYear(year) {
  switch(year) {
    case "1998":
      return "https://oldgoogle.neocities.org/1998/";
    case "2009":
      return "https://oldgoogle.neocities.org/2009/";
    case "2010":
      return "https://oldgoogle.neocities.org/2010/";
    case "2011":
      return "https://oldgoogle.neocities.org/2011/";
    case "2013":
    default:
      return "https://oldgoogle.neocities.org/2013/";
  }
}

// Listen for webRequest events to modify search requests
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Get the current design style from storage
    return browser.storage.local.get('designStyle').then((result) => {
      const designStyle = result.designStyle || "2013";
      
      // Extract the search query from the original URL
      const url = new URL(details.url);
      const searchQuery = url.searchParams.get('q') || '';
      
      // Create the redirect URL
      const searchUrl = getSearchUrlForYear(designStyle);
      const redirectUrl = searchUrl + encodeURIComponent(searchQuery);
      
      return { redirectUrl: redirectUrl };
    });
  },
  { urls: ["*://oldgoogle-search/*"] },
  ["blocking"]
);

// Listen for home page requests
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Get the current design style from storage
    return browser.storage.local.get('designStyle').then((result) => {
      const designStyle = result.designStyle || "2013";
      
      // Create the redirect URL for home page
      const homeUrl = getHomeUrlForYear(designStyle);
      
      return { redirectUrl: homeUrl };
    });
  },
  { urls: ["*://oldgoogle-home/*"] },
  ["blocking"]
);