import { describe, expect, it } from "vitest";
import type { GameResult } from "./logger";
import { calculateStats } from "./stats";

const makeResult = (overrides: Partial<GameResult>): GameResult => ({
	timestamp: "2026-01-01T00:00:00.000Z",
	modelName: "test-model",
	inferenceType: "openai",
	maxTileAchieved: 128,
	finalScore: 500,
	numMoves: 50,
	win: false,
	durationSeconds: 10,
	error: null,
	...overrides,
});

describe("calculateStats", () => {
	it("returns null when no successful runs exist", () => {
		const results: GameResult[] = [
			makeResult({ error: "timeout" }),
			makeResult({ error: "provider error" }),
		];

		expect(calculateStats(results)).toBeNull();
	});

	it("calculates avgMoves from successful runs only", () => {
		const results: GameResult[] = [
			makeResult({ numMoves: 10, finalScore: 100, maxTileAchieved: 64 }),
			makeResult({ numMoves: 20, finalScore: 200, maxTileAchieved: 128 }),
			makeResult({
				numMoves: 999,
				finalScore: 0,
				maxTileAchieved: 2,
				error: "failed",
			}),
		];

		const stats = calculateStats(results);

		expect(stats).not.toBeNull();
		expect(stats?.successfulRuns).toBe(2);
		expect(stats?.totalRuns).toBe(3);
		expect(stats?.avgMoves).toBe(15);
		expect(stats?.avgScore).toBe(150);
		expect(stats?.avgMaxTile).toBe(96);
	});
});
