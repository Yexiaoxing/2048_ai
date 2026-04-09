import { describe, expect, it } from "vitest";
import { getGameStatus, getMaxTile, WINNING_TILE } from "./game-status";
import { GameStatus } from "./game-types";

describe("game-status", () => {
    describe("getMaxTile", () => {
        it("returns the highest tile on the board", () => {
            const board = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, WINNING_TILE, 4],
                [2, 8, 16, 32],
            ];

            expect(getMaxTile(board)).toBe(WINNING_TILE);
        });
    });

    describe("getGameStatus", () => {
        it("returns won when a 2048 tile is present", () => {
            const board = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, WINNING_TILE, 4],
                [2, 8, 16, 32],
            ];

            expect(getGameStatus(board)).toBe(GameStatus.won);
        });

        it("returns playing-more-2048 when board exceeds 2048", () => {
            const board = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 4096, 4],
                [0, 8, 16, 32],
            ];

            expect(getGameStatus(board)).toBe(GameStatus["playing-more-2048"]);
        });

        it("returns playing when no win tile and moves still exist", () => {
            const board = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 4, 8],
                [16, 32, 64, 0],
            ];

            expect(getGameStatus(board)).toBe(GameStatus.playing);
        });

        it("returns lost when no moves remain", () => {
            const board = [
                [2, 4, 8, 16],
                [32, 64, 128, 256],
                [512, 1024, 2, 4],
                [8, 16, 32, 64],
            ];

            expect(getGameStatus(board)).toBe(GameStatus.lost);
        });
    });
});
