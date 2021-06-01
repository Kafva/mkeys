//import { CONFIG, DEBUG } from "../app/config";
//
//var SECONDS_TO_SKIP = 60;
//
//
//// We can't save the original actionHandlers so toggling the
//// feature will haft to require a reload
//
//const mediaHandlers = () => {
//    if ('mediaSession' in navigator) {
//        
//        chrome.storage.local.get([CONFIG.timeSkipEnabledKey], function (result) {
//            console.log("Got", result.timeSkipEnabledKey);
//        });
//
//        navigator.mediaSession.setActionHandler('previoustrack', () => { 
//            if (DEBUG) console.log("----PREV----");
//            timeSkip(backKey);
//        });
//        navigator.mediaSession.setActionHandler('nexttrack', () => { 
//            if (DEBUG) console.log("----NEXT-----"); 
//            timeSkip(forwardKey);
//        });
//    }
//}
//
//
//
//
//export { mediaHandlers }
//