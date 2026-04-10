import fs from "node:fs";

import type { GameResult } from "./logger";

export type IGameStats =
    | {
          successfulRuns: number;
          totalRuns: number;
          avgScore: number;
          stdScore: number;
          avgMaxTile: number;
          stdMaxTile: number;
          winRate: number;
          avgMoves: number;
      }
    | { error: string };

export function calculateStats(results: GameResult[]): IGameStats | null {
    const successful = results.filter((r) => !r.error);

    if (successful.length === 0) {
        return null;
    }

    const scores = successful.map((r) => r.finalScore);
    const tiles = successful.map((r) => r.maxTileAchieved);
    const wins = successful.filter((r) => r.win).length;

    return {
        successfulRuns: successful.length,
        totalRuns: results.length,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
        stdScore: Math.sqrt(
            scores.reduce(
                (sq, n) => sq + (n - scores.reduce((a, b) => a + b, 0) / scores.length) ** 2,
                0,
            ) / scores.length,
        ),
        avgMaxTile: tiles.reduce((a, b) => a + b, 0) / tiles.length,
        stdMaxTile: Math.sqrt(
            tiles.reduce(
                (sq, n) => sq + (n - tiles.reduce((a, b) => a + b, 0) / tiles.length) ** 2,
                0,
            ) / tiles.length,
        ),
        winRate: (wins / successful.length) * 100,
        avgMoves: successful.reduce((sum, r) => sum + r.numMoves, 0) / successful.length,
    };
}

export function writeStatsToFile(
    stats: ReturnType<typeof calculateStats>,
    filename: string = "latest_game_stats.json",
): void {
    try {
        fs.writeFileSync(filename, JSON.stringify(stats, null, 2), "utf8");
    } catch (error) {
        console.error(`Error writing game stats to ${filename}:`, error);
    }
}
