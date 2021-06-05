import { ShortcutKey } from "../models/ShortcutKey";

export const DEBUG = true;
export const MAX_SKIP_MINUTES = 30;
export const MIN_SKIP_MINUTES = 1;
export const DEFAULT_SKIP_MINUTES = 1;


// Utilises the default shortcuts on YT to skip/rewind 5s
export const REWIND_KEY: ShortcutKey =  {
    key: 'ArrowLeft',
    code: 'ArrowLeft',
    keyCode: 37,
};
export const SKIP_KEY: ShortcutKey = {
    key: 'ArrowRight',
    code: 'ArrowRight',
    keyCode: 39,
}

export const MESSAGE = {
    pageLoaded: "loaded",
    getSettings: "getSettings",
    setSettings: "setSettings"
};

export const STORAGE_KEYS = {
    timeSkipEnabled: "timeSkipEnabled",
    minutesToSkip: "minutesToSkip"
};

//---------

export const validateMinutes = (minutes: number) => {
    return MIN_SKIP_MINUTES <= minutes && minutes <= MAX_SKIP_MINUTES; 
}
