import { DEBUG, DEFAULT_SKIP_SECONDS, MESSAGE, REWIND_KEY, SKIP_KEY, STORAGE_KEYS } from "../app/config";
import { Settings } from "../models/Settings";
import { ShortcutKey } from "../models/ShortcutKey";

// Activates action handlers for the skip and rewind media keys if the corresponding
// setting is active. **NOTE** that the setup will not work until the YT video has begun playing
export const setupTimeSkip = () => {
    
    chrome.runtime.sendMessage( { action: MESSAGE.getSettings }, (extSettings: Settings) => {
        
        if ( extSettings == undefined ){
            // The response is undefined if an error occurs in the reciever
            console.error(`Error occcured fetching '${STORAGE_KEYS.timeSkipEnabled}':`, 
                chrome.runtime.lastError?.message
            );
        }
        else {
            if (extSettings?.timeSkipEnabled) {
                // Activate the timeSkip feature if the extension's settings
                // has it enabled
                if ('mediaSession' in navigator) {
                    let secondsToSkip = extSettings?.secondsToSkip != undefined ? 
                        extSettings.secondsToSkip : DEFAULT_SKIP_SECONDS ;
                    
                    console.log(`Enabling timeskip: ${secondsToSkip} seconds`);

                    navigator.mediaSession.setActionHandler('previoustrack', () => { 
                        DEBUG && console.log("==>PREV<==");
                        timeSkip(REWIND_KEY, secondsToSkip);
                    });
                    navigator.mediaSession.setActionHandler('nexttrack', () => { 
                        DEBUG && console.log("==>NEXT<=="); 
                        timeSkip(SKIP_KEY, secondsToSkip);
                    });
                }
                else { console.error("No mediaSession available"); }
            }
            else { console.log("Timeskip disabled"); }
        }
    });
}

const timeSkip = (key: ShortcutKey, secondsToSkip: number) => {
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        ...key 
    } as KeyboardEventInit);
    
    for (let i = 0; i <  secondsToSkip / 5; i++){
        // 60 sec skip => 12 skips
        console.log(`skipping -- ${i}`, key);
        document.documentElement.dispatchEvent(keyboardEvent)
    }
}
