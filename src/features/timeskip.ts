import { DEBUG, DEFAULT_SKIP_MINUTES, MESSAGE, REWIND_KEY, SKIP_KEY, STORAGE_KEYS } from "../app/config";
import { Settings } from "../models/Settings";
import { ShortcutKey } from "../models/ShortcutKey";

export const setSkipMinutes = (newMinutes: number) => {
    // Set the new skip value in the extension settings
    // through a message to the background script
    chrome.runtime.sendMessage({
        action: MESSAGE.setSettings, 
        key: STORAGE_KEYS.minutesToSkip, 
        value: newMinutes
    }, (response) => {
        // Once the update has finished re-initalise the
        // event listeners to set the new value for the handlers
        console.log("res", response);
        console.log(`Reseting timeskip with: ${newMinutes} minutes`);
        setupTimeSkip();
    });
}

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
                else { console.error("No mediaSession available"); }
            }
            else { console.log("Timeskip disabled"); }
        }
    });
}

const timeSkip = (key: ShortcutKey, minutesToSkip: number) => {
    // We do not want to fetch the current minutesToSkip value for every
    // call to this function, to update how many seconds are skipped we instead
    // re-run thhe setup function when the config changes
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        ...key 
    } as KeyboardEventInit);
    
    for (let i = 0; i <  minutesToSkip * 12; i++){
        // One skip is 5 seconds:
        //  60 sec => 12 skips
        DEBUG && console.log(`Skipping -- ${i} seconds ${key.keyCode == 39 ? "forward" : "backwards"}`);
        document.documentElement.dispatchEvent(keyboardEvent)
    }
}
