import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { type GameTrace, TraceLogger } from "./logger";

const tempDirs: string[] = [];

const makeTrace = (overrides: Partial<GameTrace> = {}): GameTrace => ({
    timestamp: "2026-01-01T00:00:00.000Z",
    modelName: "test-model",
    inferenceType: "openai",
    runId: 1,
    maxTileAchieved: 128,
    finalScore: 500,
    numMoves: 50,
    win: false,
    durationSeconds: 10,
    error: null,
    steps: [
        {
            stepNumber: 1,
            boardBefore: [[2, 0, 0, 0]],
            boardAfter: [[0, 0, 0, 2]],
            suggestedMove: "right",
            reasoning: "keep large tiles aligned",
            outcome: "moved",
            message: "↑ Move: RIGHT | Score +0",
            scoreBefore: 0,
            scoreAfter: 0,
            scoreDelta: 0,
            movesBefore: 0,
            movesAfter: 1,
            maxTileBefore: 2,
            maxTileAfter: 2,
            stuckCounter: 0,
            error: null,
        },
    ],
    ...overrides,
});

afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

describe("TraceLogger", () => {
    it("creates and appends run traces in a JSON file", () => {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "trace-logger-"));
        tempDirs.push(tempDir);

        const traceFile = path.join(tempDir, "steps.json");
        const logger = new TraceLogger(traceFile);

        logger.logTrace(makeTrace());
        logger.logTrace(makeTrace({ runId: 2, finalScore: 900 }));

        const parsed = JSON.parse(fs.readFileSync(traceFile, "utf8")) as {
            updatedAt: string;
            runs: GameTrace[];
        };

        expect(typeof parsed.updatedAt).toBe("string");
        expect(parsed.runs).toHaveLength(2);
        expect(parsed.runs[0]?.steps[0]?.reasoning).toBe("keep large tiles aligned");
        expect(parsed.runs[1]?.runId).toBe(2);
        expect(parsed.runs[1]?.finalScore).toBe(900);
    });
});
