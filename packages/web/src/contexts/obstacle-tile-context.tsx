import { createContext, useContext, useMemo, useState } from "react";
import { safeParseJSON } from "../utils/json";

const STORAGE_KEY = "enable-obstacle-tile";

interface ObstacleTileContextValue {
    isObstacleTileEnabled: boolean;
    setIsObstacleTileEnabled: (enabled: boolean) => void;
}

const ObstacleTileContext = createContext<ObstacleTileContextValue | null>(null);

export const ObstacleTileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [isObstacleTileEnabled, setIsObstacleTileEnabledState] = useState<boolean>(() => {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        return safeParseJSON(storedValue ?? "false", false);
    });

    const setIsObstacleTileEnabled = (enabled: boolean) => {
        setIsObstacleTileEnabledState(enabled);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
    };

    const value = useMemo(
        () => ({ isObstacleTileEnabled, setIsObstacleTileEnabled }),
        [isObstacleTileEnabled],
    );

    return <ObstacleTileContext.Provider value={value}>{children}</ObstacleTileContext.Provider>;
};

export const useObstacleTileContext = (): ObstacleTileContextValue => {
    const context = useContext(ObstacleTileContext);

    if (!context) {
        throw new Error("useObstacleTileContext must be used inside ObstacleTileProvider");
    }

    return context;
};
