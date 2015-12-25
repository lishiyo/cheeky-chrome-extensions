chrome.runtime.onStartup.addListener(function() {
    console.log("eventPage startup!");
});

chrome.runtime.getBackgroundPage((backgroundPageWindow) => {
    console.log("got eventPage ", backgroundPageWindow);
});

// Send message on browser action
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
        // can be any key
        "message": "clicked_browser_action"
    });
  });
