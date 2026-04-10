import { stringToDirection } from "@2048/game-logic";
import { Game2048 } from "./game";
import type { LLMInference } from "./llm";
import type { GameStepTrace, GameTrace } from "./logger";

export interface EvaluationConfig {
    numRuns: number;
    maxGameMoves: number;
    visualize: boolean;
    visualizeDelayMs: number;
    styleName?: string;
}

export class GameEvaluator {
    private config: EvaluationConfig;

    constructor(config: EvaluationConfig) {
        this.config = config;
    }

    async playGame(
        llmInference: LLMInference,
        onStep?: (
            grid: number[][],
            score: number,
            moves: number,
            message: string,
            noRenderBoard?: boolean,
        ) => void,
    ): Promise<GameTrace> {
        let overallMaxTile = 0;
        let overallMaxScore = 0;

        const game = new Game2048();
        const steps: GameStepTrace[] = [];

        let score = 0;
        let movesCount = 0;
        let maxTile = game.getMaxTile();
        let lastError: string | null = null;
        let stuckCounter = 0;
        const startTime = Date.now();

        // --- Inner game loop ---
        while (movesCount < this.config.maxGameMoves) {
            const preMove = this.copyBoard(game.getBoard());
            const scoreBefore = score;
            const movesBefore = movesCount;
            const maxTileBefore = game.getMaxTile();
            maxTile = Math.max(maxTile, game.getMaxTile());

            // Check game over
            if (game.isGameOver()) {
                lastError = null;
                if (this.config.visualize && onStep) {
                    onStep(game.getBoard(), score, movesCount, "🏁 Game Over!");
                    await this.delay(this.config.visualizeDelayMs * 2);
                }
                break;
            }

            // Get LLM move

            if (this.config.visualize && onStep) {
                onStep(
                    game.getBoard(),
                    score,
                    movesCount,
                    `⏳ Waiting for ${llmInference.constructor.name}...`,
                    movesCount > 0, // Don't render board for remaining steps as they have rendered after move
                );
            }

            const response = await llmInference.generate(game.getBoard());

            if (response.error) {
                lastError = `LLM Error: ${response.error}`;
                steps.push({
                    stepNumber: steps.length + 1,
                    boardBefore: preMove,
                    boardAfter: this.copyBoard(game.getBoard()),
                    suggestedMove: response.completion || null,
                    reasoning: response.reasoning,
                    outcome: "llm-error",
                    message: lastError,
                    scoreBefore,
                    scoreAfter: score,
                    scoreDelta: 0,
                    movesBefore,
                    movesAfter: movesCount,
                    maxTileBefore,
                    maxTileAfter: game.getMaxTile(),
                    stuckCounter,
                    error: response.error,
                });
                if (this.config.visualize && onStep) {
                    onStep(preMove, score, movesCount, `❌ LLM Error: ${response.error}`);
                    await this.delay(this.config.visualizeDelayMs * 2);
                }
                break;
            }

            const action = response.completion;

            let vizMessage = "";
            let outcome: GameStepTrace["outcome"] = "unparsed-response";
            let scoreDelta = 0;
            if (action) {
                const direction = stringToDirection(action);
                if (direction !== null) {
                    const [changed, moveScoreDelta] = game.move(direction);
                    scoreDelta = moveScoreDelta;

                    if (changed) {
                        score += scoreDelta;
                        movesCount++;
                        stuckCounter = 0;
                        outcome = "moved";
                        vizMessage = `↑ Move: ${action.toUpperCase()} | Score +${scoreDelta}`;
                    } else {
                        stuckCounter++;
                        outcome = "invalid-move";
                        vizMessage = `⚠️  Invalid: ${action.toUpperCase()} (Stuck: ${stuckCounter})`;
                    }
                } else {
                    stuckCounter++;
                    outcome = "invalid-direction";
                    vizMessage = `❌ Invalid direction conversion (Stuck: ${stuckCounter})`;
                }
            } else {
                stuckCounter++;
                vizMessage = `❌ Invalid/Unparsed (Stuck: ${stuckCounter})`;
            }

            steps.push({
                stepNumber: steps.length + 1,
                boardBefore: preMove,
                boardAfter: this.copyBoard(game.getBoard()),
                suggestedMove: action || null,
                reasoning: response.reasoning,
                outcome,
                message: vizMessage,
                scoreBefore,
                scoreAfter: score,
                scoreDelta,
                movesBefore,
                movesAfter: movesCount,
                maxTileBefore,
                maxTileAfter: game.getMaxTile(),
                stuckCounter,
                error: null,
            });

            if (this.config.visualize && onStep) {
                onStep(game.getBoard(), score, movesCount, vizMessage);
                await this.delay(this.config.visualizeDelayMs);
            }

            // Check if stuck
            if (stuckCounter >= 5) {
                lastError = `Stuck after ${stuckCounter} invalid moves`;
                if (this.config.visualize && onStep) {
                    onStep(game.getBoard(), score, movesCount, `🔄 LLM stuck, failing the game...`);
                    await this.delay(this.config.visualizeDelayMs * 1.5);
                }
                break;
            }
        }

        // Update overall stats
        overallMaxTile = Math.max(overallMaxTile, maxTile);
        overallMaxScore = Math.max(overallMaxScore, score);

        // Natural end of game
        const duration = (Date.now() - startTime) / 1000;
        const finalMax = game.getMaxTile();
        const win = finalMax >= 2048;

        return {
            timestamp: new Date().toISOString(),
            modelName: llmInference.constructor.name,
            inferenceType: "unknown",
            maxTileAchieved: finalMax,
            finalScore: score,
            numMoves: movesCount,
            win,
            durationSeconds: Math.round(duration * 100) / 100,
            error: lastError,
            steps,
        };
    }

    private copyBoard(board: number[][]): number[][] {
        return board.map((row) => [...row]);
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
