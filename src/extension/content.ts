import { setupTimeSkip } from '../util/timeskip';
import { MESSAGE, STORAGE_KEYS  } from './config';

// Note that Firefox has both the browser.* (webextension-polyfill-ts)
// and chrome.* APIs defined, the main difference is that the browser.*
// API returns promises instead of relying on callbacks
//  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#firefox_supports_both_the_chrome_and_browser_namespaces


// The script execution starts from here, the content script is able to
// interact with the DOM, the background script (service worker) can't
// and is used to fetch relevant information
chrome.runtime.sendMessage({ action: MESSAGE.pageLoaded }, () => {
    // `setInterval` returns an Id which we can pass to `clearInterval`
    // to deactivate the repeated checks for the readyState of the document
    var readyCheckId = setInterval( async () => {
        
        if (document.readyState === "complete") {
            
            clearInterval(readyCheckId);
            console.log("Content script running...");
            //chrome.storage.local.set( { [STORAGE_KEYS.timeSkipEnabled]: true}, () => {
            //    console.log("Set!");
            //});
            
            await new Promise(r => setTimeout(r, 2000));
            
            setupTimeSkip(); 
        }
    })
})