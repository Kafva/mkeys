import { DEBUG, Config } from '../extension/config';
import { ExtensionResponse, MESSAGE, STORAGE_KEYS } from '../types';

export const validateMinutes = (minutes: number): boolean => {
	return (
		Config.MIN_SKIP_MINUTES <= minutes && minutes <= Config.MAX_SKIP_MINUTES
	);
};

export const chromeMessageErrorOccured = (
	action: MESSAGE,
	response: ExtensionResponse,
	key?: STORAGE_KEYS
): boolean => {
	const completeAction =
		'action:' + action + (key != null ? ' key:' + key : '');

	if (response == undefined) {
		// The response is undefined if an error occurs in the receiver
		console.error(
			`Error in response for '${completeAction}':`,
			chrome.runtime.lastError?.message
		);
		return true;
	} else {
		DEBUG && console.log(`(${completeAction}) response:`, response);
		return false;
	}
};
