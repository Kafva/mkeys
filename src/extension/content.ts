import { setupTimeSkip } from '../util/timeskip';
import { MESSAGE, STORAGE_KEYS  } from './config';

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