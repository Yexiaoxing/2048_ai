import { getRandomInteger } from "../utils/random";
import { type Board, type Coordinates, Direction } from "./game-types";

export const BOARD_SIZE = 4;
const NEW_TILE_PROBABILITY = 0.9; // 90% chance of 2, 10% chance of 4

export const getInitialBoard = (spawnCount: number): Board => {
    let board: Board = Array(BOARD_SIZE)
        .fill(0)
        .map(() => Array(BOARD_SIZE).fill(0));

    for (let i = 0; i < spawnCount; i++) {
        board = spawnTile(board);
    }

    return board;
};

/**
 *
 * @param board The current game board
 * @returns An array of coordinates for empty cells in the format [row, col]
 */
export const getEmptyCells = (board: Board): Coordinates[] => {
    const empty: Coordinates[] = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) {
                empty.push([i, j]);
            }
        }
    }
    return empty;
};

/**
 * Create a deep copy of the board to ensure immutability when making changes
 *
 * @param board The current game board
 * @returns A new board instance with the same values
 */
export const copyBoard = (board: Board): Board => {
    return board.map((row) => row.slice());
};

/**
 * Spawn a new tile (2 or 4) at a random empty position
 *
 * @param board The current game board
 * @returns A new board with a new tile spawned
 */
export const spawnTile = (board: Board): Board => {
    const emptyCell = getEmptyCells(board);
    if (emptyCell.length === 0) return board;

    const newBoard = copyBoard(board);
    const [row, col] = emptyCell[getRandomInteger(0, emptyCell.length - 1)];
    const value = Math.random() < NEW_TILE_PROBABILITY ? 2 : 4;
    newBoard[row][col] = value;
    return newBoard;
};

/**
 * Compress a row by sliding non-zero values to the left and filling the rest with zeros
 *
 * @param row An array representing a single row of the board
 * @returns A new array with non-zero values compressed to the left
 */
export const compressRow = (row: number[]): number[] => {
    const filtered = row.filter((val) => val !== 0);
    return [...filtered, ...Array(BOARD_SIZE - filtered.length).fill(0)];
};

/**
 * Merge a row by combining adjacent tiles of the same value
 *
 * @param row An array representing a single row of the board
 * @returns A new array with merged values and zeros for merged tiles, along with the score gain
 */
export const mergeRow = (row: number[]): [number[], number] => {
    const merged = [...row];
    let scoreGain = 0;
    for (let i = 0; i < merged.length - 1; i++) {
        if (merged[i] !== 0 && merged[i] === merged[i + 1]) {
            scoreGain += merged[i] * 2; // Score gain is the value of the new tile
            merged[i] *= 2;
            merged[i + 1] = 0;
        }
    }
    return [merged, scoreGain];
};

/**
 * Move the board left by compressing and merging each row
 *
 * @param board The current game board
 * @returns A new board after moving left
 */
export const moveLeft = (board: Board): [Board, number] => {
    const newBoard = copyBoard(board);
    let allScoreGain = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        // Steps:
        // 1. Compress the row to move all non-zero values to the left
        // 2. Merge the row to combine adjacent tiles of the same value
        // 3. Compress again to move any new non-zero values to the left after merging
        const [mergedRow, scoreGain] = mergeRow(compressRow(newBoard[i]));
        allScoreGain += scoreGain;
        newBoard[i] = compressRow(mergedRow);
    }
    return [newBoard, allScoreGain];
};

/**
 * Move the board right by compressing and merging each row in reverse
 *
 * @param board The current game board
 * @returns A new board after moving right
 */
export const moveRight = (board: Board): [Board, number] => {
    const newBoard = copyBoard(board);
    let allScoreGain = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        const [mergedRow, scoreGain] = mergeRow(compressRow(newBoard[i].slice().reverse()));
        allScoreGain += scoreGain;
        newBoard[i] = compressRow(mergedRow).reverse();
    }
    return [newBoard, allScoreGain];
};

/**
 * Move the board up by compressing and merging each column
 *
 * @param board The current game board
 * @returns A new board after moving up
 */
export const moveUp = (board: Board): [Board, number] => {
    const newBoard = copyBoard(board);
    let allScoreGain = 0;
    for (let col = 0; col < BOARD_SIZE; col++) {
        const column = newBoard.map((row) => row[col]);
        const [mergedColumn, scoreGain] = mergeRow(compressRow(column));
        const compressedMerged = compressRow(mergedColumn);
        allScoreGain += scoreGain;
        compressedMerged.forEach((val, row) => {
            newBoard[row][col] = val;
        });
    }
    return [newBoard, allScoreGain];
};

/**
 * Move the board down by compressing and merging each column in reverse
 *
 * @param board The current game board
 * @returns A new board after moving down
 */
export const moveDown = (board: Board): [Board, number] => {
    const newBoard = copyBoard(board);
    let allScoreGain = 0;
    for (let col = 0; col < BOARD_SIZE; col++) {
        const column = newBoard.map((row) => row[col]).reverse();
        const [mergedColumn, scoreGain] = mergeRow(compressRow(column));
        const compressedMerged = compressRow(mergedColumn).reverse();
        allScoreGain += scoreGain;
        compressedMerged.forEach((val, row) => {
            newBoard[row][col] = val;
        });
    }
    return [newBoard, allScoreGain];
};

/**
 * Move the board in the specified direction
 *
 * @param board The current game board
 * @param direction The direction to move (left, right, up, down)
 * @returns A new board after moving in the specified direction
 */
export const moveBoard = (board: Board, direction: Direction): [Board, number] => {
    switch (direction) {
        case Direction.Left:
            return moveLeft(board);
        case Direction.Right:
            return moveRight(board);
        case Direction.Up:
            return moveUp(board);
        case Direction.Down:
            return moveDown(board);
        default:
            return [board, 0];
    }
};

/**
 * Check if there are any possible moves
 *
 * A move is possible if there are empty cells or if adjacent tiles can merge
 * @param board The current game board
 * @returns True if a move is possible, false otherwise
 */
export const canMove = (board: Board): boolean => {
    // Check if there are empty cells
    if (getEmptyCells(board).length > 0) {
        return true;
    }

    // Check if any adjacent tiles can merge
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const current = board[i][j];
            if (current !== null) {
                // Check right
                if (j < BOARD_SIZE - 1 && board[i][j + 1] === current) {
                    return true;
                }
                // Check down
                if (i < BOARD_SIZE - 1 && board[i + 1][j] === current) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * Check if two boards are different
 *
 * @param board1 The first game board
 * @param board2 The second game board
 * @returns True if the boards are different, false if they are the same
 */
export const isBoardChanged = (board1: Board, board2: Board): boolean => {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board1[i][j] !== board2[i][j]) {
                return true;
            }
        }
    }
    return false;
};

export function stringToDirection(action: string): Direction | null {
    switch (action.toLowerCase()) {
        case "up":
            return Direction.Up;
        case "down":
            return Direction.Down;
        case "left":
            return Direction.Left;
        case "right":
            return Direction.Right;
        default:
            return null;
    }
}
