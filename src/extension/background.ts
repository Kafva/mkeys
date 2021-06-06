import { BKG_MESSAGE, CONTENT_MESSAGE, STORAGE_KEYS } from './config';
import { Settings } from '../models/Settings';
import { chromeMessageErrorOccured } from '../util/helper';

// Service workers can NOT access the DOM directly
//  https://developers.google.com/web/fundamentals/primers/service-workers
// To view the devtools for the background worker:
//  https://stackoverflow.com/questions/10257301/accessing-console-and-devtools-of-extensions-background-js

//chrome.runtime.onInstalled.addListener(function() {
//    chrome.contextMenus.create({
//      "id": "sampleContextMenu",
//      "title": "Sample Context Menu",
//      "contexts": ["selection"]
//    });
//});

// Returns a Settings object with the value for the specified key,
// passing null will return a Settings object with all attributes
export const getSettings = (key: string = "") : Promise<Settings> => {
    
    return new Promise( (resolve) => {
        chrome.storage.local.get( key == "" ? null : [key] , (result) => {
            // Fetch all keys from the storage of the extension if null is passed
            let extSettings = Object.keys(result)
                // Filter out the attributes needed for the Settings object
                .filter( key => Object.keys(STORAGE_KEYS).includes(key) )
                .reduce( (obj, key) => {
                    // The `obj` paramter in the callback function is the
                    // accumulator which will get updated with each
                    // iteration and the `key` parameter will go over
                    // each value that was present in the `STORAGE_KEYS`
                    
                    return {
                        ...obj, [key]: result[key]
                    }
                }, 
                // The inital value for the `reduce` call is set to an empty '{}'
                // which we fill out with each iteration
                {}
            ) as Settings;

            resolve(extSettings);
        });
    });
}

chrome.runtime.onMessage.addListener( (message, sender, sendResponse) => {
    // We use regular Promise syntax since an async function for `addListener`
    // does not work: https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
    const { tab, frameId } = sender 
    console.log("In listener:", message);
    
    switch (message?.action) {
        case BKG_MESSAGE.pageLoaded:
            
            chrome.tabs.query({currentWindow: true}, (tabs) => {
                // Mark a tab as active when the popup is opened for the
                // first time, at the sime time register an event listener
                // on the page to unset the global flag when the window is closed

                console.log("TABS", tabs);
                //for(let tab of tabs){
                //    chrome.tabs.executeScript(tab.id, {code: ""}, function(result) {
                //      console.log("There are " + result.length + " execution contexts");
                //    });            
                //}
            })

            sendResponse({message: "Background script is running", success: true});
            break;
        case BKG_MESSAGE.getSettings:
            getSettings(message?.key)
                .then( (extSettings) => {
                    console.log("Fetched settings:", extSettings);
                    sendResponse( extSettings ) 
                });
            break;
        case BKG_MESSAGE.setSettings:
            if ( message?.key != null && message?.value != null ){
                console.log(`Trying to set ext[${message.key}] := ${message.value}`);
                chrome.storage.local.set( { [message.key]: message.value}, () => {
                    console.log(`Set ext[${message.key}] := ${message.value}`);
                    sendResponse({success: true});
                });
            } 
            else { sendResponse({success: false}); }
            break;
        default:
            // If we send a contentPing and the content-script is not running
            // will recieve this message as a response in the popup
            sendResponse( {
                message: `Unknown message: '${JSON.stringify(message)}'`,
                success: false
            });
    }
    
    // Required: https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
})