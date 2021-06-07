import {Theme} from '@material-ui/core/styles';
import {SvgIconComponent} from "@material-ui/icons";

export interface Settings {
    timeSkipEnabled: boolean,
    minutesToSkip: number,
}

export interface ShortcutKey {
    key: string,
    code: string,
    keyCode: number,
}

/***** Extension API messaging ******/
export enum STORAGE_KEYS {
    timeSkipEnabled = "t",
    minutesToSkip = "m"
}

// Union type
type MESSAGE = CONTENT_MESSAGE|BKG_MESSAGE;

export enum CONTENT_MESSAGE {
    ping,
    featureToggle,
    setSkipValue 
}

export enum BKG_MESSAGE {
    pageLoaded,
    getSettings,
    setSettings
}

interface BasicResponse {
    success: boolean
    message?: string
}

// The type used for messages sent from chrome.*.onMessage.addListener()
// It can either contain a message/status or a Settings object
type ExtensionResponse = BasicResponse|Settings;

type ExtensionRequest = {
    // The type used for messages sent with chrome.*.sendMessage()
    action: MESSAGE
    
    // The `key` and `value` are used when updating settings
    // inside chrome.storage.local
    key?: STORAGE_KEYS
    value?: boolean|string
}

/***** React states and props ******/

interface AppState extends Settings {
    // The 'state' will reflect the Settings along with the
    // flag that determines if the snackbar is visible 
    showSnackbar: boolean
}

interface AppProps extends Settings {
    // The application will take all attributes from
    // Settings along with the theme as props 
    theme: Theme
}

type AppItemProps = {
    icon?: SvgIconComponent 
}

type SwitchProps = {
    storageKey: string // Using 'key' as the prop name causes weird behaviour
    on: boolean
    handleChange: (key: string, value: boolean|string) => void
}

type NumericProps = {
    text: string
    minutes: number
    disabled: boolean
    handleChange: (newNumber:number) => void
}