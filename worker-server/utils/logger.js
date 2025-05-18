export const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data ? data : "");
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error ? error : "");
  },
  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data ? data : "");
  },
  debug: (message, data) => {
    console.debug(`[DEBUG] ${message}`, data ? data : "");
  },
};
