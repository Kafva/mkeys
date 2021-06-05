import { MAX_SKIP_MINUTES, MIN_SKIP_MINUTES } from "../extension/config";

export const validateMinutes = (minutes: number) => {
    return MIN_SKIP_MINUTES <= minutes && minutes <= MAX_SKIP_MINUTES; 
}
