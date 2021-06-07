import { DEBUG, DEFAULT_SKIP_MINUTES, BKG_MESSAGE, REWIND_KEY, SKIP_KEY, STORAGE_KEYS } from "../extension/config";
import { Settings } from "../models/Settings";
import { ShortcutKey } from "../models/ShortcutKey";
import { chromeMessageErrorOccured } from "./helper";

// Setup action handlers for the skip and rewind media keys in accordance with the
// settings value inside chrome.storage.local. 
// **NOTE** that the setup will not work until the YT video has begun playing
export const setupTimeSkip = () => {
    
    chrome.runtime.sendMessage( { action: BKG_MESSAGE.getSettings }, (extSettings: Settings) => {
       
        if ( !chromeMessageErrorOccured(BKG_MESSAGE.getSettings, extSettings) ){

            if (extSettings?.timeSkipEnabled) {
                // Activate the timeSkip feature if the extension's settings
                // has it enabled
                let minutesToSkip = extSettings?.minutesToSkip != undefined ? 
                    extSettings.minutesToSkip : DEFAULT_SKIP_MINUTES ;
                
                console.log(`Enabling timeskip: ${minutesToSkip} minutes`);

                navigator.mediaSession.setActionHandler('previoustrack', () => { 
                    DEBUG && console.log("==>PREV<==");
                    timeSkip(REWIND_KEY, minutesToSkip);
                });
                navigator.mediaSession.setActionHandler('nexttrack', () => { 
                    DEBUG && console.log("==>NEXT<=="); 
                    timeSkip(SKIP_KEY, minutesToSkip);
                });
            }
            // Maintain the default behaviour of the mediaKeys if the extension is disabled
        }
    });
}

const timeSkip = (key: ShortcutKey, minutesToSkip: number) => {
    // We do not want to fetch the current minutesToSkip value for every
    // call to this function, to update how many seconds are skipped we instead
    // re-run the setup function when the config changes
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        ...key 
    } as KeyboardEventInit);
    
    DEBUG && console.log(`Skipping -- ${minutesToSkip} minutes ${key.keyCode == 39 ? "forward" : "backwards"}`);
    for (let i = 0; i <  minutesToSkip * 12; i++){
        // One skip is 5 seconds:
        //  60 sec => 12 skips
        document.documentElement.dispatchEvent(keyboardEvent)
    }
}
