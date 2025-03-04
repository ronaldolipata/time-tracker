/**
 * Truncates a string to a specified length and appends an ellipsis ("...") if it exceeds the limit.
 *
 * @param {number} maxLength - The maximum length allowed before truncation.
 * @param {string} string - The input string to be truncated.
 * @returns {string} The truncated string with an ellipsis if it exceeds the maxLength.
 */
const addEllipsis = (maxLength: number, string: string): string => {
  if (string && string.length <= maxLength) return string;
  const truncatedString = string.slice(0, maxLength);
  return truncatedString + '...';
};

export default addEllipsis;
