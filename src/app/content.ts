import { setupTimeSkip } from '../features/timeskip';
import { Settings } from '../models/Settings';
import { getSettings } from './background';
import { STORAGE_KEYS } from './config';

var settings: Settings;

// Check if the document is done loading once a second and
// send the 'ready' message to the background once its done  
//var readyCheckId = setInterval( () => {
//    
//    if (document.readyState === "complete") {
//        clearInterval(readyCheckId);
//        chrome.runtime.sendMessage({name: "ready"}, (response) => {
//            console.log("(content) Got response", response);
//        });
//    }
//}, 1000);

// The script execution starts from here, the content script is able to
// interact with the DOM, the background script (service worker) can't
// and is used to fetch relevant information

chrome.runtime.sendMessage({id: 'loaded'}, async (res) => {
    
    // `setInterval` returns an Id which we can pass to `clearInterval`
    // to deactivate the repeated checks for the readyState of the document
    var readyCheckId = setInterval( async () => {
        
        if (document.readyState === "complete") {
            clearInterval(readyCheckId);
            
            (async () => {
                chrome.storage.local.set( { [STORAGE_KEYS.timeSkipEnabled]: true}, () => {
                    console.log("Set!");
                });
                await new Promise(r => setTimeout(r, 2000));
                //mediaHandlers();
                
                // Once the document is loaded, fetch all settings from the
                // extensions local storage
                settings = await getSettings(); 
                console.log("My settings:", settings);
            })();
            
            
            // Activate the timeSkip feature if the extension's settings
            // has it enabled
            
            //chrome.storage.local.get([CONFIG.timeSkipEnabled], (result) => {
            //    result.timeSkipEnabledKey && setupTimeSkip(); 
            //});
            

            // Note that chrome.storage.local and localStorage are NOT the
            // same, the latter is tied to a domain while the prior is tied
            // to the browser extension

            // 1. Check if we should remap the media keys based on settings
            // in the extension
            //chrome.storage.local.get([CONFIG.timeSkipEnabledKey], function (result) {
            //    console.log("Got", result.timeSkipEnabledKey);
            //});
            
        }
    })
})