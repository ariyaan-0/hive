// Nginx default body size limit is 1MB. 
// We keep the client-side limit slightly under to account for multipart overhead.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_SIZE_LABEL = '5MB';

/**
 * Validates a file's size against the server upload limit.
 * Returns an error message string if invalid, or null if valid.
 */
export const validateFileSize = (file) => {
  if (!file) return null;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `Whoa there! Your file is ${fileSizeMB}MB — but our server caps out at ${MAX_FILE_SIZE_LABEL}. `
      + `This is an experimental project and the developer has… let's say… budget constraints 💸. `
      + `Please try again with an image under ${MAX_FILE_SIZE_LABEL}. We appreciate your patience (and your smaller files).`;
  }

  return null;
};
