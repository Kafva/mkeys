import { Theme } from '@material-ui/core/styles';
import { SvgIconComponent } from '@material-ui/icons';

// This file should preferably have the extension *.d.ts since it contains
// type declerations but webpack refuses to include it properly without
// a plain .ts extension
// https://github.com/TypeStrong/ts-loader/issues/1036#issuecomment-630179801

/***** Extension API messaging ******/
export enum STORAGE_KEYS {
	timeSkipEnabled = 'timeSkipEnabled',
	minutesToSkip = 'minutesToSkip',
}

// Union type
export type MESSAGE = CONTENT_MESSAGE | BKG_MESSAGE;

export enum CONTENT_MESSAGE {
	ping = 0,
	featureToggle,
	setSkipValue,
}

export enum BKG_MESSAGE {
	pageLoaded = 3,
	getSettings,
	setSettings,
}

export interface BasicResponse {
	success: boolean;
	message?: string;
}

// The type used for messages sent from chrome.*.onMessage.addListener()
// It can either contain a message/status or a Settings object
export type ExtensionResponse = BasicResponse | Settings;

export type ExtensionRequest = {
	// The type used for messages sent with chrome.*.sendMessage()
	action: MESSAGE;

	// The `key` and `value` are used when updating settings
	// inside chrome.storage.local
	key?: STORAGE_KEYS;
	value?: boolean | string;
};

/***** React states and props ******/

export interface AppState extends Settings {
	// The 'state' will reflect the Settings along with the
	// flag that determines if the snackbar is visible
	showSnackbar: boolean;
}

export interface AppProps extends Settings {
	// The application will take all attributes from
	// Settings along with the theme as props
	theme: Theme;
}

export type AppItemProps = {
	icon?: SvgIconComponent;
};

export type SwitchProps = {
	storageKey: STORAGE_KEYS; // Using 'key' as the prop name causes weird behaviour
	on: boolean;
	handleChange: (key: STORAGE_KEYS, value: boolean|string) => void;
};

export type NumericProps = {
	text: string;
	minutes: number;
	disabled: boolean;
	handleChange: (newNumber: number) => void;
};

/***** Misc *******/

// Note that the keys must be the same as those defined
// in the STORAGE_KEYS enum for parsing to work
export interface Settings {
	[STORAGE_KEYS.timeSkipEnabled]: boolean;
	[STORAGE_KEYS.minutesToSkip]: number;
}

export interface ShortcutKey {
	key: string;
	code: string;
	keyCode: number;
}
