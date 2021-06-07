import { ShortcutKey } from '../types';

// Set the DEBUG variable based on if DEBUG is set in the enviroment
// when webpack is invoked
export const DEBUG = process.env.DEBUG == null ? false : true;

export const Config = {
	MAX_SKIP_MINUTES: 30,
	MIN_SKIP_MINUTES: 1,
	DEFAULT_SKIP_MINUTES: 1,
	AUTO_HIDE_SNACKBAR_SEC: 4,
};

// Utilises the default shortcuts on YT to skip/rewind 5s
export const REWIND_KEY: ShortcutKey = {
	key: 'ArrowLeft',
	code: 'ArrowLeft',
	keyCode: 37,
};
export const SKIP_KEY: ShortcutKey = {
	key: 'ArrowRight',
	code: 'ArrowRight',
	keyCode: 39,
};
