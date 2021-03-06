import { DEBUG, Config, REWIND_KEY, SKIP_KEY } from '../extension/config';
import {
	Settings,
	BKG_MESSAGE,
	ShortcutKey,
	ExtensionResponse,
} from '../types';
import { chromeMessageErrorOccured, debugLog } from './helper';

// Setup action handlers for the skip and rewind media keys in accordance with the
// settings value inside chrome.storage.local.
// **NOTE** that the setup will not work until the YT video has begun playing
export const setupTimeSkip = (): void => {
	chrome.runtime.sendMessage(
		{ action: BKG_MESSAGE.getSettings },
		(extSettings: ExtensionResponse) => {
			if (!chromeMessageErrorOccured(BKG_MESSAGE.getSettings, extSettings)) {
				extSettings = extSettings as Settings;

				if (extSettings?.timeSkipEnabled) {
					// Activate the timeSkip feature if the extension's settings
					// has it enabled
					const minutesToSkip =
						extSettings?.minutesToSkip != undefined
							? extSettings?.minutesToSkip
							: Config.DEFAULT_SKIP_MINUTES;

					console.log(`Enabling timeskip: ${minutesToSkip} minutes`);

					navigator.mediaSession?.setActionHandler('previoustrack', () => {
						debugLog('==>PREV<==');
						timeSkip(REWIND_KEY, minutesToSkip);
					});
					navigator.mediaSession?.setActionHandler('nexttrack', () => {
						debugLog('==>NEXT<==');
						timeSkip(SKIP_KEY, minutesToSkip);
					});
				}
				// Maintain the default behaviour of the mediaKeys if the extension is disabled
			}
		}
	);
};

const timeSkip = (key: ShortcutKey, minutesToSkip: number): void => {
	// We do not want to fetch the current minutesToSkip value for every
	// call to this function, to update how many seconds are skipped we instead
	// re-run the setup function when the config changes
	const keyboardEvent = new KeyboardEvent('keydown', {
		bubbles: true,
		...key,
	} as KeyboardEventInit);

	DEBUG &&
		console.log(
			`Skipping -- ${minutesToSkip} minutes ${
				key.keyCode == 39 ? 'forward' : 'backwards'
			}`
		);

	/* eslint-disable no-loops/no-loops */
	for (let i = 0; i < minutesToSkip * 12; i++) {
		// One skip is 5 seconds:
		//  60 sec => 12 skips
		document.documentElement.dispatchEvent(keyboardEvent);
	}
};
