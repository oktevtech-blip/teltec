export const logger = {
  error: (message: string, error?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error ? error : '');
  },
  
  info: (message: string) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`);
  },
  
  warn: (message: string) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`);
  }
};