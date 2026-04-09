import { stringToDirection } from "../../src/shared/game-logic";
import { Game2048 } from "./game";
import type { LLMInference } from "./llm";
import type { GameResult } from "./logger";
import { TUIRenderer } from "./tui";

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
	): Promise<GameResult> {
		let overallMaxTile = 0;
		let overallMaxScore = 0;

		const game = new Game2048();

		let score = 0;
		let movesCount = 0;
		let maxTile = game.getMaxTile();
		let lastError: string | null = null;
		let stuckCounter = 0;
		const startTime = Date.now();

		// --- Inner game loop ---
		while (movesCount < this.config.maxGameMoves) {
			const preMove = game.getBoard().map((row) => [...row]);
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
				if (this.config.visualize && onStep) {
					onStep(preMove, score, movesCount, `❌ LLM Error: ${response.error}`);
					await this.delay(this.config.visualizeDelayMs * 2);
				}
				break;
			}

			const action = response.completion;

			let vizMessage = "";
			if (action) {
				const direction = stringToDirection(action);
				if (direction !== null) {
					const [changed, scoreDelta] = game.move(direction);

					if (changed) {
						score += scoreDelta;
						movesCount++;
						stuckCounter = 0;
						vizMessage = `↑ Move: ${action.toUpperCase()} | Score +${scoreDelta}`;
					} else {
						stuckCounter++;
						vizMessage = `⚠️  Invalid: ${action.toUpperCase()} (Stuck: ${stuckCounter})`;
					}
				} else {
					stuckCounter++;
					vizMessage = `❌ Invalid direction conversion (Stuck: ${stuckCounter})`;
				}
			} else {
				stuckCounter++;
				vizMessage = `❌ Invalid/Unparsed (Stuck: ${stuckCounter})`;
			}

			if (this.config.visualize && onStep) {
				onStep(game.getBoard(), score, movesCount, vizMessage);
				await this.delay(this.config.visualizeDelayMs);
			}

			// Check if stuck
			if (stuckCounter >= 5) {
				lastError = `Stuck after ${stuckCounter} invalid moves`;
				if (this.config.visualize && onStep) {
					onStep(
						game.getBoard(),
						score,
						movesCount,
						`🔄 LLM stuck, failing the game...`,
					);
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
		};
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
