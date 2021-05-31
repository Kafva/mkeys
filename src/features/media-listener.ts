import { CONFIG, DEBUG } from "../app/config";

var SECONDS_TO_SKIP = 60;

// Utilises the default shortcuts to skip/rewind 5s
const backKey =  {
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
};
const forwardKey = {
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
}

// We can't save the original actionHandlers so toggling the
// feature will haft to require a reload

const mediaHandlers = () => {
    if ('mediaSession' in navigator) {
        
        chrome.storage.local.get([CONFIG.timeSkipEnabled], function (result) {
            console.log("Got", result.timeSkipEnabled);
        });

        navigator.mediaSession.setActionHandler('previoustrack', () => { 
            if (DEBUG) console.log("----PREV----");
            timeSkip(backKey);
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => { 
            if (DEBUG) console.log("----NEXT-----"); 
            timeSkip(forwardKey);
        });
    }
}


const timeSkip = (key) => {
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        ...key
    } as any) 
    
    for (let i = 0; i < SECONDS_TO_SKIP/5; i++){
        // 60 sec skip => 12 skips
        console.log(`skipping -- ${i}`, key);
        document.documentElement.dispatchEvent(keyboardEvent)
    }
}


export { mediaHandlers }
