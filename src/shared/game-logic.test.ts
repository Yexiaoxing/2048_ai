import { describe, expect, it } from "vitest";
import {
    canMove,
    compressRow,
    getEmptyCells,
    getInitialBoard,
    isBoardChanged,
    mergeRow,
    moveDown,
    moveLeft,
    moveRight,
    moveUp,
    spawnTile,
} from "./game-logic";

describe("Game Logic", () => {
    describe("getInitialBoard", () => {
        it("should create a 4x4 board filled with 0", () => {
            const board = getInitialBoard(0);
            expect(board).toHaveLength(4);
            board.forEach((row) => {
                expect(row).toHaveLength(4);
                row.forEach((cell) => {
                    expect(cell).toBe(0);
                });
            });
        });

        it("should spawn the specified number of tiles", () => {
            const spawnCount = 5;
            const board = getInitialBoard(spawnCount);
            const emptyCells = getEmptyCells(board);
            expect(emptyCells).toHaveLength(16 - spawnCount);
        });
    });

    describe("getEmptyCells", () => {
        it("should return empty cell coordinates", () => {
            const board: (number | 0)[][] = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const empty = getEmptyCells(board);
            expect(empty).toMatchObject([
                [0, 2],
                [0, 3],
                [1, 0],
                [1, 1],
                [1, 2],
                [1, 3],
                [2, 0],
                [2, 1],
                [2, 2],
                [2, 3],
                [3, 0],
                [3, 1],
                [3, 2],
                [3, 3],
            ]);
        });

        it("should return empty array for full board", () => {
            const board: (number | 0)[][] = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2048, 4096],
                [8192, 16384, 32768, 65536],
            ];
            expect(getEmptyCells(board)).toHaveLength(0);
        });
    });

    describe("spawnTile", () => {
        it("should spawn a tile on an empty cell", () => {
            const board: (number | 0)[][] = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = spawnTile(board);
            const emptyCells = getEmptyCells(newBoard);
            expect(emptyCells).toHaveLength(13); // One less than original

            // original board is unchanged
            expect(board).toEqual([
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]);
        });

        it("should not change board if no empty cells", () => {
            const board: (number | 0)[][] = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2048, 4096],
                [8192, 16384, 32768, 65536],
            ];
            const newBoard = spawnTile(board);
            expect(newBoard).toEqual(board);
        });
    });

    describe("compressRow", () => {
        it("should compress a row by moving non-zero values to the left", () => {
            const row = [2, 0, 2, 4];
            const compressed = compressRow(row);
            expect(compressed).toEqual([2, 2, 4, 0]);
        });

        it("should not change a row that is already compressed", () => {
            const row = [2, 2, 4, 0];
            const compressed = compressRow(row);
            expect(compressed).toEqual([2, 2, 4, 0]);
        });
    });

    describe("mergeRow", () => {
        it("should merge adjacent equal numbers once per pair", () => {
            const [merged, scoreGain] = mergeRow([2, 2, 2, 2]);
            expect(merged).toEqual([4, 0, 4, 0]);
            expect(scoreGain).toBe(8);
        });

        it("should not merge values more than once in a chain", () => {
            const [merged, scoreGain] = mergeRow([4, 4, 4, 0]);
            expect(merged).toEqual([8, 0, 4, 0]);
            expect(scoreGain).toBe(8);
        });
    });

    describe("moveLeft", () => {
        it("should move tiles to the left", () => {
            const board: (number | 0)[][] = [
                [0, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveLeft(board);
            expect(newBoard).toEqual([
                [
                    [2, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                0,
            ]);
        });

        it("should move tiles to the left and merge adjacent tiles", () => {
            const board: (number | 0)[][] = [
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveLeft(board);
            expect(newBoard).toEqual([
                [
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                4,
            ]);
        });
    });

    describe("moveRight", () => {
        it("should move tiles to the right", () => {
            const board: (number | 0)[][] = [
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveRight(board);
            expect(newBoard).toEqual([
                [
                    [0, 0, 0, 2],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                0,
            ]);
        });

        it("should move tiles to the right and merge adjacent tiles", () => {
            const board: (number | 0)[][] = [
                [2, 2, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveRight(board);
            expect(newBoard).toEqual([
                [
                    [0, 0, 0, 4],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                4,
            ]);
        });
    });

    describe("moveUp", () => {
        it("should move tiles up", () => {
            const board: (number | 0)[][] = [
                [0, 0, 0, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveUp(board);
            expect(newBoard).toEqual([
                [
                    [2, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                0,
            ]);
        });

        it("should move tiles up and merge adjacent tiles", () => {
            const board: (number | 0)[][] = [
                [2, 0, 0, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveUp(board);
            expect(newBoard).toEqual([
                [
                    [4, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                4,
            ]);
        });
    });

    describe("moveDown", () => {
        it("should move tiles down", () => {
            const board: (number | 0)[][] = [
                [0, 0, 0, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveDown(board);
            expect(newBoard).toEqual([
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [2, 0, 0, 0],
                ],
                0,
            ]);
        });

        it("should move tiles down and merge adjacent tiles", () => {
            const board: (number | 0)[][] = [
                [2, 0, 0, 0],
                [2, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const newBoard = moveDown(board);
            expect(newBoard).toEqual([
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [4, 0, 0, 0],
                ],
                4,
            ]);
        });
    });

    describe("canMove", () => {
        it("should return true if there are empty cells", () => {
            const board: (number | 0)[][] = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2048, 4096],
                [8192, 16384, 32768, 0],
            ];
            expect(canMove(board)).toBe(true);
        });

        it("should return true if adjacent tiles can merge", () => {
            const board: (number | 0)[][] = [
                [2, 2, 4, 8],
                [16, 32, 64, 128],
                [256, 512, 1024, 2048],
                [4096, 8192, 16384, 32768],
            ];
            expect(canMove(board)).toBe(true);
        });

        it("should return false if no moves are possible", () => {
            const board: (number | 0)[][] = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2048, 4096],
                [8192, 16384, 32768, 65536],
            ];
            expect(canMove(board)).toBe(false);
        });
    });

    describe("isBoardChanged", () => {
        it("should return false for identical boards", () => {
            const board: (number | 0)[][] = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];

            expect(
                isBoardChanged(
                    board,
                    board.map((row) => [...row]),
                ),
            ).toBe(false);
        });

        it("should return true when any cell differs", () => {
            const board1: (number | 0)[][] = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ];
            const board2: (number | 0)[][] = [
                [2, 4, 0, 0],
                [0, 0, 0, 0],
                [0, 2, 0, 0],
                [0, 0, 0, 0],
            ];

            expect(isBoardChanged(board1, board2)).toBe(true);
        });
    });
});
