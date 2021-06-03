import { ShortcutKey } from "../models/ShortcutKey";

export const DEBUG = true;
export const DEFAULT_SKIP_SECONDS = 60;

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
    getSettings: "getSettings"
};

export const STORAGE_KEYS = {
    timeSkipEnabled: "timeSkipEnabled",
    secondsToSkip: "secondsToSkip"
};