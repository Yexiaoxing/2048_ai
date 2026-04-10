import type { Board, Direction } from "@2048/game-logic";
import {
    canMove,
    getInitialBoard,
    getMaxTile,
    isBoardChanged,
    moveBoard,
    spawnTile,
} from "@2048/game-logic";

/**
 * Game2048 class wrapping the core game logic
 * Used for evaluation CLI
 */
export class Game2048 {
    private board: Board;
    private score: number = 0;

    constructor() {
        this.board = getInitialBoard(2);
    }

    move(direction: Direction): [boolean, number] {
        const [newBoard, scoreGain] = moveBoard(this.board, direction);
        const changed = isBoardChanged(this.board, newBoard);

        if (changed) {
            this.board = spawnTile(newBoard);
            this.score += scoreGain;
        }

        return [changed, scoreGain];
    }

    isGameOver(): boolean {
        return !canMove(this.board);
    }

    getBoard(): number[][] {
        return this.board;
    }

    getScore(): number {
        return this.score;
    }

    getMaxTile(): number {
        return getMaxTile(this.board);
    }
}
