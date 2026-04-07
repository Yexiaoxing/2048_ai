import { useEffect } from "react";
import { Direction } from "../shared/game-types";

// Handle keyboard input
export const useGameKeyboardControl = (move: (direction: Direction) => void) => {
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
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
