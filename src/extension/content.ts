import { setupTimeSkip } from '../util/timeskip';
import { chromeMessageErrorOccured, validateMinutes, debugLog } from '../util/helper';
import { Config } from './config';
import { BKG_MESSAGE, CONTENT_MESSAGE, STORAGE_KEYS } from '../types';

let previous_video = ""

// Note that Firefox has both the browser.* (webextension-polyfill-ts)
// and chrome.* APIs defined, the main difference is that the browser.*
// API returns promises instead of relying on callbacks
//  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#firefox_supports_both_the_chrome_and_browser_namespaces

const setupContentListener = (): void => {
	// To interact with the actual webpage from events in the extension page
	// we need to add a listener for the content script
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		debugLog('(content) In listener:', message);

		switch (message?.action) {
		case CONTENT_MESSAGE.ping:
			sendResponse({
				message: `At '${window.location.href}': content-script is running`,
				success: true,
			});
			break;
		case CONTENT_MESSAGE.featureToggle:
			if (message?.key == null || message?.value == null) {
				console.error(
					`Missing parameters in '${CONTENT_MESSAGE.featureToggle}' message`,
					message
				);
			}
			else {
				// Toggle the feature specified by the key and value of the message
				// through a message to the *background-script*
				chrome.runtime.sendMessage(
					{
						action: BKG_MESSAGE.setSettings,
						key: message.key,
						value: message.value,
					},
					(response) => {
						if (
							!chromeMessageErrorOccured(
								BKG_MESSAGE.setSettings,
								response,
								message.key
							)
						) {
							// Upon successfully setting the value proceed to perform the necessary function
							// inside the content-script if no error occurred
							switch (message.key) {
							case STORAGE_KEYS.timeSkipEnabled:
								if (message.value) {
									setupTimeSkip();
								}
								else {
									// Explicitly disable the media key handlers
									// To restore default behaviour the user will need to reload the page
									console.log('Disabling timeskip');
									navigator.mediaSession?.setActionHandler(
										'previoustrack',
										null
									);
									navigator.mediaSession?.setActionHandler(
										'nexttrack',
										null
									);
								}
								break;
							}
						}
					}
				);
			}
			break;
		case CONTENT_MESSAGE.setSkipValue:
			// Validate the input and set the new skip value on the page
			if (validateMinutes(message.value)) {
				// Set the new skip value in the extension settings
				// through a message to the background script
				chrome.runtime.sendMessage(
					{
						action: BKG_MESSAGE.setSettings,
						key: STORAGE_KEYS.minutesToSkip,
						value: message.value,
					},
					(response) => {
						if (
							!chromeMessageErrorOccured(
								BKG_MESSAGE.setSettings,
								response,
								STORAGE_KEYS.minutesToSkip
							)
						) {
							// Once the update has finished re-initialise the
							// event listeners to set the new value for the handlers
							setupTimeSkip();
						}
					}
				);
			}
			break;
		default:
			sendResponse({
				message: `Unknown message: '${JSON.stringify(message)}'`,
				success: false,
			});
		}

		// Required: https://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
		return true;
	});
};

/// Poll the website URL every X seconds and re-run the
/// the setup if the URL changes (i.e. we visit another video)
const extensionSetup = async () => {
	const current_video = (new URL(window.location.href)).searchParams.get('v');

	if ( current_video != null && current_video != previous_video ){
		previous_video = current_video;
		console.log(`Running mkeys setup for ${current_video}...`);
		setupContentListener();
		await new Promise((r) => setTimeout(r, 2000)); // Wait before activating keybinds
		setupTimeSkip();
	}
	else { debugLog(`Not running setup on ${current_video}`); }
}

// The script execution starts from here, the content script is able to
// interact with the DOM, the background script (service worker) can't
// and is used to fetch relevant information
chrome.runtime.sendMessage({ action: BKG_MESSAGE.pageLoaded }, () => {
	// `setInterval` returns an Id which we can pass to `clearInterval`
	// to deactivate the repeated checks for the readyState of the document
	const readyCheckId = setInterval( () => {
		if (document.readyState === 'complete') {
			clearInterval(readyCheckId);
			setInterval(extensionSetup, Config.POLL_MS)
		}
	});
});
