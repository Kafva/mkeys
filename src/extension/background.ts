import { DEBUG } from './config';
import {
	ExtensionRequest,
	STORAGE_KEYS,
	BKG_MESSAGE,
	Settings,
} from '../types';

// Service workers can NOT access the DOM directly
//  https://developers.google.com/web/fundamentals/primers/service-workers
// To view the devtools for the background worker:
//  https://stackoverflow.com/questions/10257301/accessing-console-and-devtools-of-extensions-background-js

// Returns a Settings object with the value for the specified key,
// passing null will return a Settings object with all attributes
export const getSettings = (key = ''): Promise<Settings> => {
	return new Promise((resolve) => {
		chrome.storage.local.get(key == '' ? null : [key], (result) => {
			// Fetch all keys from the storage of the extension if null is passed
			const extSettings = Object.keys(result)
				// Filter out the attributes needed for the Settings object
				.filter((key) => Object.keys(STORAGE_KEYS).includes(key))
				.reduce(
					(obj, key) => {
						// The `obj` parameter in the callback function is the
						// accumulator which will get updated with each
						// iteration and the `key` parameter will go over
						// each value that was present in the `STORAGE_KEYS`

						return {
							...obj,
							[key]: result[key],
						};
					},
					// The initial value for the `reduce` call is set to an empty '{}'
					// which we fill out with each iteration
					{}
				) as Settings;

			resolve(extSettings);
		});
	});
};

chrome.runtime.onMessage.addListener(
	(message: ExtensionRequest, sender, sendResponse) => {
		// We use regular Promise syntax since an async function for `addListener`
		// does not work: https://stackoverflow.com/questions/44056271/chrome-runtime-onmessage-response-with-async-await
		DEBUG && console.log('(background) In listener:', message);

		switch (message?.action) {
			case BKG_MESSAGE.pageLoaded:
				sendResponse({
					message: 'Background script is running',
					success: true,
				});
				break;
			case BKG_MESSAGE.getSettings:
				getSettings(message?.key).then((extSettings: Settings) => {
					DEBUG && console.log('Fetched settings:', extSettings);
					sendResponse(extSettings);
				});
				break;
			case BKG_MESSAGE.setSettings:
				if (message?.key != null && message?.value != null) {
					chrome.storage.local.set({ [message.key]: message.value }, () => {
						DEBUG && console.log(`Set ext[${message.key}] := ${message.value}`);
						sendResponse({ success: true });
					});
				} else {
					sendResponse({ success: false });
				}
				break;
			default:
				// If we send a contentPing and the content-script is not running
				// will receive this message as a response in the popup
				sendResponse({
					message: `Unknown message: '${JSON.stringify(message)}'`,
					success: false,
				});
		}

		// Required: https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
		return true;
	}
);
