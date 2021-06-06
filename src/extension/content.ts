import { setupTimeSkip } from '../util/timeskip';
import { chromeMessageErrorOccured, validateMinutes } from '../util/helper';
import { DEBUG, BKG_MESSAGE, CONTENT_MESSAGE, STORAGE_KEYS  } from './config';

// Note that Firefox has both the browser.* (webextension-polyfill-ts)
// and chrome.* APIs defined, the main difference is that the browser.*
// API returns promises instead of relying on callbacks
//  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#firefox_supports_both_the_chrome_and_browser_namespaces

const setupContentListener = () => {
    // To interact with the actual webpage from events in the extension page
    // we need to add a listener for the content script
    chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
        console.log("(content) In listener:", message);
        
        switch (message?.action) {
            case CONTENT_MESSAGE.ping:
                sendResponse({
                    message: `At '${window.location.href}': content-script is running`,
                    success: true
                });
                break;
            case CONTENT_MESSAGE.featureToggle:
                if (message?.key == null || message?.value == null){
                    console.error(`Missing parameters in '${CONTENT_MESSAGE.featureToggle}' message`, message); 
                }    
                else {
                    // Toggle the feature specified by the key and value of the message
                    // through a message to the *background-script*
                    chrome.runtime.sendMessage( {
                        action: BKG_MESSAGE.setSettings, 
                        key: message.key, 
                        value: message.value 
                    }, (response) => {
                        if ( !chromeMessageErrorOccured(BKG_MESSAGE.setSettings, response, message.key) ){
                            // Upon successfully setting the value proced to perform the neccessary function
                            // inside the content-script if no error occured
                            switch (message.key){
                                case STORAGE_KEYS.timeSkipEnabled:
                                    // Setup the timeskip feature if the
                                    // newState was the 'active' state
                                    setupTimeSkip();
                                    break;
                            }
                        }
                    });
                }
                break;
            case CONTENT_MESSAGE.setSkipValue:
                // Validate the input and set the new skip value on the page
                if (validateMinutes(message.value)){
                    // Set the new skip value in the extension settings
                    // through a message to the background script
                    chrome.runtime.sendMessage({
                        action: BKG_MESSAGE.setSettings, 
                        key: STORAGE_KEYS.minutesToSkip, 
                        value: message.value
                    }, (response) => {
                        if (!chromeMessageErrorOccured(BKG_MESSAGE.setSettings, response, STORAGE_KEYS.minutesToSkip)){
                            // Once the update has finished re-initalise the
                            // event listeners to set the new value for the handlers
                            setupTimeSkip();
                        }
                    });
                } 
                break;
            default:
                sendResponse( {
                    message: `Unknown message: '${JSON.stringify(message)}'`,
                    success: false
                });
        }
        
        // Required: https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
        return true;
    });

}

// The script execution starts from here, the content script is able to
// interact with the DOM, the background script (service worker) can't
// and is used to fetch relevant information
chrome.runtime.sendMessage({ action: BKG_MESSAGE.pageLoaded }, () => {
    // `setInterval` returns an Id which we can pass to `clearInterval`
    // to deactivate the repeated checks for the readyState of the document
    var readyCheckId = setInterval( async () => {
        
        if (document.readyState === "complete") {
            
            clearInterval(readyCheckId);
            console.log("Content script running...");
            
            setupContentListener(); 

            // Short wait before activating the time skip feature
            await new Promise(r => setTimeout(r, 2000));
            setupTimeSkip(); 
        }
    })
})