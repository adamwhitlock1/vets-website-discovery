export const getFileSize = num => {
  if (num > 999999) {
    return `${(num / 1000000).toFixed(1)} MB`;
  } else if (num > 999) {
    return `${(num / 1000).toFixed(1)} KB`;
  } else {
    return `${num} B`;
  }
};