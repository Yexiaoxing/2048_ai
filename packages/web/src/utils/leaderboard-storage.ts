import { safeParseJSON } from "./json";

export interface LeaderboardStorage {
    scores: number[];
}

export const isLocalStorageAvailable = (): boolean => {
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
    } catch {
        return false;
    }
};

export const LEADERBOARD_STORAGE_KEY = "leaderboard";
const DEFAULT_LEADERBOARD: LeaderboardStorage = { scores: [] };

export const loadLeaderboard = (): LeaderboardStorage => {
    if (!isLocalStorageAvailable()) {
        return DEFAULT_LEADERBOARD;
    }

    const leaderboard = localStorage.getItem(LEADERBOARD_STORAGE_KEY);

    if (!leaderboard) {
        return DEFAULT_LEADERBOARD;
    }

    return safeParseJSON<LeaderboardStorage>(leaderboard, DEFAULT_LEADERBOARD);
};

export const saveLeaderboard = (leaderboard: LeaderboardStorage): void => {
    if (!isLocalStorageAvailable()) {
        return;
    }

    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
};

export const onNewScore = (score: number): void => {
    const leaderboard = loadLeaderboard();

    if (leaderboard.scores.length < 5) {
        leaderboard.scores.push(score);
    } else {
        leaderboard.scores.sort((a, b) => b - a);
        leaderboard.scores.pop();
        leaderboard.scores.splice(0, 0, score);
        leaderboard.scores.sort((a, b) => b - a);
    }

    saveLeaderboard(leaderboard);
};
