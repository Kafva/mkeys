import { DEBUG, REWIND_KEY, SKIP_KEY } from "../app/config";
import { ShortcutKey } from "../models/ShortcutKey";


export const setupTimeSkip = () => {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('previoustrack', () => { 
            DEBUG && console.log("==>PREV<==");
            timeSkip(REWIND_KEY);
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => { 
            DEBUG && console.log("==>NEXT<=="); 
            timeSkip(SKIP_KEY);
        });
    }
    else { console.error("No mediaSession available"); }
}

const timeSkip = (key: ShortcutKey) => {
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        ...key 
    } as KeyboardEventInit);
    
    //for (let i = 0; i < SECONDS_TO_SKIP/5; i++){
    //    // 60 sec skip => 12 skips
    //    console.log(`skipping -- ${i}`, key);
    //    document.documentElement.dispatchEvent(keyboardEvent)
    //}
}
