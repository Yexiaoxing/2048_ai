import { useCallback, useEffect, useState } from "react";

export const useDebugMode = () => {
    const [isDebugMode, setIsDebugMode] = useState(false);

    // Toggle debug mode with Ctrl+Shift+D (or Cmd+Shift+D on Mac)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.shiftKey &&
                event.key.toLowerCase() === "d"
            ) {
                event.preventDefault();
                setIsDebugMode((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const toggleDebugMode = useCallback(() => {
        setIsDebugMode((prev) => !prev);
    }, []);

    return {
        isDebugMode,
        toggleDebugMode,
    };
};
