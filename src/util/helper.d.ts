import { ExtensionResponse, MESSAGE, STORAGE_KEYS } from "../types";
export declare const validateMinutes: (minutes: number) => boolean;
export declare const chromeMessageErrorOccured: (action: MESSAGE, response: ExtensionResponse, key?: STORAGE_KEYS) => boolean;
