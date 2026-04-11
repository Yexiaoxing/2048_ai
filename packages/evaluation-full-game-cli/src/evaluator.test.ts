import { describe, expect, it } from "vitest";
import { GameEvaluator } from "./evaluator";
import { type LLMConfig, LLMInference, type LLMResponse } from "./llm";

class StubInference extends LLMInference {
    private responses: LLMResponse[];

    constructor(responses: LLMResponse[]) {
        const config: LLMConfig = {
            name: "stub-model",
            type: "ollama",
            apiModelName: "stub-model",
        };
        super(config);
        this.responses = responses;
    }

    async generate(): Promise<LLMResponse> {
        return (
            this.responses.shift() ?? {
                completion: "",
                reasoning: null,
                error: "No more stub responses",
            }
        );
    }
}

describe("GameEvaluator", () => {
    it("captures LLM reasoning in the per-step trace", async () => {
        const evaluator = new GameEvaluator({
            numRuns: 1,
            maxGameMoves: 1,
            visualize: false,
            visualizeDelayMs: 0,
        });

        const result = await evaluator.playGame(
            new StubInference([
                {
                    completion: "left",
                    reasoning: "favor merges on the left edge",
                    error: null,
                },
            ]),
        );

        expect(result.steps.length).toBeGreaterThan(0);
        expect(result.steps[0]?.reasoning).toBe("favor merges on the left edge");
        expect(result.steps[0]?.suggestedMove).toBe("left");
        expect(result.steps[0]?.boardBefore).toHaveLength(4);
        expect(result.steps[0]?.boardAfter).toHaveLength(4);
    });

    it("records provider errors as trace steps", async () => {
        const evaluator = new GameEvaluator({
            numRuns: 1,
            maxGameMoves: 1,
            visualize: false,
            visualizeDelayMs: 0,
        });

        const result = await evaluator.playGame(
            new StubInference([
                {
                    completion: "",
                    reasoning: null,
                    error: "rate limited",
                },
            ]),
        );

        expect(result.error).toBe("LLM Error: rate limited");
        expect(result.steps).toHaveLength(1);
        expect(result.steps[0]?.outcome).toBe("llm-error");
        expect(result.steps[0]?.error).toBe("rate limited");
    });
});
