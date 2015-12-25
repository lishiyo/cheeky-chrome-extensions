/**
 * CONTENT SCRIPT
 *
 * Chrome injects this into current tab after DOM is complete.
 * Content scripts cannot use chrome.* APIs, with the exception of extension, i18n, runtime, and storage. So the content script will be able to pull a URL out of the current page, but will need to hand that URL over to the background script to do something useful with it.
 * How? Via message passing.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "clicked_browser_action") {
    const firstHref = $("a[href^='http']").eq(0).attr("href");

    console.log("got message! " + firstHref);
  }
});
