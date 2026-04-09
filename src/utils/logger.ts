// TODO: Replace console.log with a proper logging library for better log management and formatting.
// TODO: Add remote log collector
export const logger = {
    info: (message: string) => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message: string) => {
        console.warn(`[WARN] ${message}`);
    },
    error: (message: string) => {
        console.error(`[ERROR] ${message}`);
    },
};
