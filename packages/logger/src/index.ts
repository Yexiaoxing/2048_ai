/** biome-ignore-all lint/suspicious/noExplicitAny: follow the same console.log type */
let shouldLogToConsole = false;

export const enableConsoleLogger = () => {
    shouldLogToConsole = true;
};

export const logger = {
    debug: (message: string, ...optionalParams: any[]) => {
        if (shouldLogToConsole) {
            console.debug(`[DEBUG] ${message}`, ...optionalParams);
        }
    },
    info: (message: string, ...optionalParams: any[]) => {
        if (shouldLogToConsole) {
            console.log(`[INFO] ${message}`, ...optionalParams);
        }
    },
    warn: (message: string, ...optionalParams: any[]) => {
        if (shouldLogToConsole) {
            console.warn(`[WARN] ${message}`, ...optionalParams);
        }
    },
    error: (message: string, ...optionalParams: any[]) => {
        if (shouldLogToConsole) {
            console.error(`[ERROR] ${message}`, ...optionalParams);
        }
    },
};
