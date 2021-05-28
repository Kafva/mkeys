import {mediaHandlers} from '../features/media-listener';
import {CONFIG} from './config';


chrome.runtime.sendMessage({}, (response) => {
    var checkReady = setInterval(() => {
        
        if (document.readyState === "complete") {
            
            clearInterval(checkReady)
            console.log("We're in the injected content script!");
            
            // 1. Check if we should remap the media keys based on settings
            // in the extension
            
            (async () => {
                chrome.storage.local.set( { [CONFIG.timeSkipEnabled]: true}, () => {
                    console.log("timeskip enabled!");
                });
                await new Promise(r => setTimeout(r, 3000));
                mediaHandlers();
            })();
        }
    })
})