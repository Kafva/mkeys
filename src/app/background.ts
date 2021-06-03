import { MESSAGE, STORAGE_KEYS } from '../app/config';
import { Settings } from '../models/Settings';

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
    
    switch (message?.action) {
        case MESSAGE.getSettings:
            getSettings(message?.key)
                .then( (extSettings) => sendResponse( extSettings ) );
            break;
        default:
            sendResponse( {message: `Unknown message: '${message}'`});
    }
    
    // Required: https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
})