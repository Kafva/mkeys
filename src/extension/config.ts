import { ShortcutKey } from "../models/ShortcutKey";

// Set the DEBUG variable based on if DEBUG is set in the enviroment
// when webpack is invoked
export const DEBUG = process.env.DEBUG == null 
    ? false : true;

export const MAX_SKIP_MINUTES = 30;
export const MIN_SKIP_MINUTES = 1;
export const DEFAULT_SKIP_MINUTES = 1;

export const AUTO_HIDE_SNACKBAR_SEC = 4;

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

export const CONTENT_MESSAGE = {
    /**** content-script ****/
    ping: "ping",
    featureToggle: "featureToggle",
    setSkipValue: "setSkipValue" 
}

export const BKG_MESSAGE = {
    /**** background-script ****/
    pageLoaded: "loaded",
    getSettings: "getSettings",
    setSettings: "setSettings",
};

export const STORAGE_KEYS = {
    timeSkipEnabled: "timeSkipEnabled",
    minutesToSkip: "minutesToSkip"
};