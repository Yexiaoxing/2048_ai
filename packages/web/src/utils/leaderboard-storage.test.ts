// 1. Load existing data during game init
// 2. Store the new score if it's in the top 5
//
// Use local storage, and fallback to memory storage if unavailable

import { describe, expect, it, vi } from "vitest";
import {
    LEADERBOARD_STORAGE_KEY,
    loadLeaderboard,
    onNewScore,
    saveLeaderboard,
} from "./leaderboard-storage";

// mock local storage

const getItemMock = vi.fn();
const setItemMock = vi.fn();
const removeItemMock = vi.fn();
const clearMock = vi.fn();
const keyMock = vi.fn();
const lengthMock = 0;

global.localStorage = {
    getItem: getItemMock,
    setItem: setItemMock,
    removeItem: removeItemMock,
    clear: clearMock,
    length: lengthMock,
    key: keyMock,
};

describe("leaderboard-storage", () => {
    it("should load existing data during game init", () => {
        getItemMock.mockReturnValueOnce(JSON.stringify({ scores: [100, 200, 300, 400, 500] }));

        const leaderboard = loadLeaderboard();

        expect(leaderboard).toEqual({ scores: [100, 200, 300, 400, 500] });
    });

    it("should save new score if it's in the top 5", () => {
        getItemMock.mockReturnValueOnce(JSON.stringify({ scores: [] }));
        const leaderboard = loadLeaderboard();

        expect(leaderboard).toEqual({ scores: [] });

        saveLeaderboard({ scores: [100, 200, 300, 400, 500] });

        expect(setItemMock).toHaveBeenCalledWith(
            LEADERBOARD_STORAGE_KEY,
            JSON.stringify({ scores: [100, 200, 300, 400, 500] }),
        );
    });

    it("should save new score if it is in top 5", () => {
        getItemMock.mockReturnValueOnce(JSON.stringify({ scores: [500, 400, 300, 200, 100] }));

        onNewScore(600);

        expect(setItemMock).toHaveBeenCalledWith(
            LEADERBOARD_STORAGE_KEY,
            JSON.stringify({ scores: [600, 500, 400, 300, 200] }),
        );
    });

    it("should save new score in desc order", () => {
        getItemMock.mockReturnValueOnce(JSON.stringify({ scores: [500, 400, 300, 200, 100] }));

        onNewScore(450);

        expect(setItemMock).toHaveBeenCalledWith(
            LEADERBOARD_STORAGE_KEY,
            JSON.stringify({ scores: [500, 450, 400, 300, 200] }),
        );
    });
});
