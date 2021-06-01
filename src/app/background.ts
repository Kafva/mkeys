import { MESSAGE, STORAGE_KEYS } from '../app/config';
import { Settings } from '../models/Settings';

// Service workers can NOT access the DOM directly
// https://developers.google.com/web/fundamentals/primers/service-workers

//chrome.runtime.onInstalled.addListener(function() {
//    chrome.contextMenus.create({
//      "id": "sampleContextMenu",
//      "title": "Sample Context Menu",
//      "contexts": ["selection"]
//    });
//});

export const getSettings = () : Promise<Settings> => {
    
    return new Promise( (resolve) => {
        
        chrome.storage.local.get(null, (result) => {
            // Fetch all keys from the storage of the extension
            resolve(
                Object.keys(result)
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
                ) as Settings
            );
        });
    })
    
    
}

chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
    
    console.log("Recieved", message, "from",sender);
    
    switch (message){
        case MESSAGE.getSettings:
            sendResponse( {message: (await getSettings())} );
        default:
            sendResponse( {message: `Unknown message: '${message}'`});
    }

})