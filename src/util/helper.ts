import { DEBUG, MAX_SKIP_MINUTES, MIN_SKIP_MINUTES } from "../extension/config";

export const validateMinutes = (minutes: number) => {
    return MIN_SKIP_MINUTES <= minutes && minutes <= MAX_SKIP_MINUTES; 
}

export const chromeMessageErrorOccured = (action: string, response: any, key?: string) => {
    
    let completeAction = action + (key != null ? " " + key : "");

    if ( response == undefined ){
        // The response is undefined if an error occurs in the reciever
        console.error(`Error in response for '${completeAction}' action:`, 
            chrome.runtime.lastError?.message
        );
        return true;
    }
    else {
        DEBUG && console.log(`(${completeAction}) response:`, response);
        return false;
    }
}
