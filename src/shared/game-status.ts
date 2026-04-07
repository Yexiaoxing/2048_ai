import { BOARD_SIZE, canMove } from "./game-logic";
import { type Board, GameStatus } from "./game-types";

export const WINNING_TILE = 2048;

/**
 * Get the maximum tile value on the board
 */
export const getMaxTile = (board: Board): number => {
    let max = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] !== null && (board[i][j] as number) > max) {
                max = board[i][j] as number;
            }
        }
    }
    return max;
};

/**
 * Determine game status: playing, won, lost, or playing-more-2048 (if max tile is below 2048 but no more moves)
 *
 * @param board The current game board
 * @returns The current game status
 */
export const getGameStatus = (board: Board): GameStatus => {
    // If max tile is reached but not 2048, still playing but with special status
    if (getMaxTile(board) > WINNING_TILE) {
        return GameStatus["playing-more-2048"];
    }

    // Check if won (reached 2048)
    if (getMaxTile(board) === WINNING_TILE) {
        return GameStatus.won;
    }

    // Check if lost (no more moves)
    if (!canMove(board)) {
        return GameStatus.lost;
    }

    return GameStatus.playing;
};
