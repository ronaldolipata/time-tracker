/**
 * Checks if the given time entry is valid.
 *
 * A valid time entry must be a non-empty string that is not equal to `"-"` after trimming.
 *
 * @param {string} [timeIn] - The time-in value (optional).
 * @param {string} [timeOut] - The time-out value (optional).
 * @returns {boolean} `true` if both `timeIn` and `timeOut` are valid, otherwise `false`.
 */
export const isValidTimeEntry = (timeIn?: string, timeOut?: string): boolean => {
  return !!timeIn && !!timeOut && timeIn.trim() !== '-' && timeOut.trim() !== '-';
};
