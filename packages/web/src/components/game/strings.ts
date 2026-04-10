import { GameStatus } from "@2048/game-logic";

export const getStatusMessage = (gameStatus: GameStatus): string => {
    switch (gameStatus) {
        case GameStatus.won:
            return "You won! 🎉 You can continue playing or start a new game.";
        case GameStatus.lost:
            return "Game Over! No more moves.";
        default:
            return "Keep playing!";
    }
};
