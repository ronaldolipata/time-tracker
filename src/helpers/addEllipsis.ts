const addEllipsis = (maxLength: number, string: string): string => {
  if (string && string.length <= maxLength) return string;
  const truncatedString = string.slice(0, maxLength);
  return truncatedString + '...';
};

export default addEllipsis;
