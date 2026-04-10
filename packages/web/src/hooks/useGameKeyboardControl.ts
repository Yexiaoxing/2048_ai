import { Direction } from "@2048/game-logic";
import { useEffect } from "react";

// Handle keyboard input
export const useGameKeyboardControl = (move: (direction: Direction) => void) => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const debugOverrideContainer = document.querySelector("#debug-board-override");
            if (debugOverrideContainer?.contains(e.target as Node)) {
                return; // Don't handle if debug override is open
            }

            const keyMap: Record<string, Direction> = {
                ArrowUp: Direction.Up,
                ArrowDown: Direction.Down,
                ArrowLeft: Direction.Left,
                ArrowRight: Direction.Right,
            };

            if (keyMap[e.key] !== undefined) {
                e.preventDefault();
                move(keyMap[e.key]);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [move]);
};
