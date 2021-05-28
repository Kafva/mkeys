import { CONFIG, DEBUG } from "../app/config";


// TODO dev server
// We can't save the original actionHandlers so toggling the
// feature will haft to require a reload

const mediaHandlers = () => {
    if ('mediaSession' in navigator) {
        console.log("We have media!");

        chrome.storage.local.get([CONFIG.timeSkipEnabled], function (result) {
            console.log(`Got ${result.key}`);
        })
        //navigator.mediaSession.setActionHandler('play', () => { 
        //    if(DEBUG) console.log("----PLAY----");
        //});
        navigator.mediaSession.setActionHandler('previoustrack', () => { 
            if (DEBUG) console.log("----PREV----");
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => { 
            if (DEBUG) console.log("----NEXT-----"); 
        });
    }
}


export { mediaHandlers }
