export const safeParseJSON = <T>(json: string, defaultValue: T): T => {
    try {
        return JSON.parse(json) as unknown as T;
    } catch {
        return defaultValue;
    }
};
