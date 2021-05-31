import {mediaHandlers} from '../features/media-listener';
import {CONFIG} from './config';


chrome.runtime.sendMessage({}, async (res) => {
    var checkReady = setInterval(() => {
        
        if (document.readyState === "complete") {
            
            clearInterval(checkReady);
            
            // 1. Check if we should remap the media keys based on settings
            // in the extension
            //chrome.storage.local.get([CONFIG.timeSkipEnabled], function (result) {
            //    console.log("Got", result.timeSkipEnabled);
            //});
            
            (async () => {
                chrome.storage.local.set( { [CONFIG.timeSkipEnabled]: true}, () => {
                    console.log("timeskip enabled!");
                });
                
                await new Promise(r => setTimeout(r, 2000));
                mediaHandlers();
            })();
        }
    })
})