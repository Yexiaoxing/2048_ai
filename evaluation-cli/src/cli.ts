#!/usr/bin/env -S npx tsx

import * as fs from "node:fs";
import * as path from "node:path";
import chalk from "chalk";
import { type EvaluationConfig, GameEvaluator } from "./evaluator";
import { createInference, type LLMConfig, type LLMInference } from "./llm";
import { type GameResult, ResultsLogger } from "./logger";
import { calculateStats, type IGameStats, writeStatsToFile } from "./stats";
import { clearScreen, hideCursor, showCursor, TUIRenderer } from "./tui";

interface CLIConfig {
	models: LLMConfig[];
	numRuns: number;
	maxGameMoves: number;
	visualize: boolean;
	visualizeDelayMs: number;
	resultsFile: string;
	statsFile: string;
	style: string;
}

// Default configuration
const DEFAULT_CONFIG: CLIConfig = {
	models: [
		{
			name: "gemma4:e4b",
			type: "ollama",
			path: "gemma4:e4b",
		},
	],
	numRuns: 20,
	maxGameMoves: 2000,
	visualize: false,
	visualizeDelayMs: 750,
	resultsFile: "2048_evaluation_results.csv",
	statsFile: "2048_evaluation_stats.json",
	style: "classic",
};

function loadConfig(configPath?: string): CLIConfig {
	const resolvedPath = configPath ? path.resolve(configPath) : null;
	console.log(
		chalk.gray(`Loading config from: ${resolvedPath || "default settings"}`),
	);
	if (resolvedPath && fs.existsSync(resolvedPath)) {
		try {
			const fileContent = fs.readFileSync(resolvedPath, "utf8");
			const loaded = JSON.parse(fileContent) as Partial<CLIConfig> & {
				statesFile?: string;
			};
			const statsFile = loaded.statsFile ?? loaded.statesFile;
			return {
				...DEFAULT_CONFIG,
				...loaded,
				...(statsFile ? { statsFile } : {}),
			};
		} catch (error) {
			console.error(
				chalk.red(`Error loading config from ${configPath}:`),
				error,
			);
			return DEFAULT_CONFIG;
		}
	}
	return DEFAULT_CONFIG;
}

function printHeader(): void {
	console.log(chalk.bold.blue("\n╔════════════════════════════════════╗"));
	console.log(chalk.bold.blue("║   2048 LLM Agent Evaluation CLI    ║"));
	console.log(chalk.bold.blue("╚════════════════════════════════════╝\n"));
}

async function main() {
	try {
		printHeader();

		const args = process.argv.slice(2);
		const configPath = args[0];
		const config = loadConfig(configPath);

		console.log(chalk.cyan("📋 Configuration:"));
		console.log(
			chalk.gray(`  Models: ${config.models.map((m) => m.name).join(", ")}`),
		);
		console.log(chalk.gray(`  Runs per model: ${config.numRuns}`));
		console.log(
			chalk.gray(
				`  Visualization: ${config.visualize ? "enabled" : "disabled"}`,
			),
		);
		console.log(chalk.gray(`  Results file: ${config.resultsFile}\n`));
		console.log(chalk.gray(`  Stats file: ${config.statsFile}\n`));

		const logger = new ResultsLogger(config.resultsFile);
		const evaluationConfig: EvaluationConfig = {
			numRuns: config.numRuns,
			maxGameMoves: config.maxGameMoves,
			visualize: config.visualize,
			visualizeDelayMs: config.visualizeDelayMs,
			styleName: config.style,
		};

		const evaluator = new GameEvaluator(evaluationConfig);
		const modelSummary: Record<string, IGameStats> = {};

		// --- Evaluate each model ---
		for (let modelIdx = 0; modelIdx < config.models.length; modelIdx++) {
			const modelConfig = config.models[modelIdx];
			const modelName = modelConfig.name;

			console.log(
				chalk.yellow(
					`\n🤖 Model ${modelIdx + 1}/${config.models.length}: ${modelName} (${modelConfig.type})`,
				),
			);
			console.log(chalk.gray("─".repeat(50)));

			let llmInference: LLMInference | null = null;

			try {
				llmInference = createInference(modelConfig);

				const runResults: GameResult[] = [];

				// Run visualization game first if enabled
				if (config.visualize && modelIdx === 0) {
					console.log(chalk.cyan("\n📹 Running visualization game...\n"));

					const renderer = new TUIRenderer(config.style);
					hideCursor();

					try {
						await evaluator.playGame(
							llmInference,
							(grid, score, moves, msg, noRenderBoard?: boolean) => {
								if (!noRenderBoard) {
									clearScreen();
									console.log(renderer.renderGameState(grid, score, moves));
								}
								console.log(chalk.cyan(`\n${msg}`));
							},
						);
					} finally {
						showCursor();
					}

					console.log(chalk.green("\n✅ Visualization complete\n"));
					await delay(1000);
				}

				// Run standard evaluation games
				console.log(
					chalk.cyan(`\n⚙️  Running ${config.numRuns} evaluation games...`),
				);

				for (let runId = 1; runId <= config.numRuns; runId++) {
					// Progress indicator
					const progress = Math.round((runId / config.numRuns) * 100);
					process.stdout.write(
						`\r${chalk.blue(`[${progress}%]`)} Game ${runId}/${config.numRuns}`,
					);

					try {
						const result = await evaluator.playGame(llmInference);
						result.runId = runId;
						result.modelName = modelName;
						result.inferenceType = modelConfig.type;

						logger.logResult(result);
						runResults.push(result);
					} catch (error) {
						const errorMsg =
							error instanceof Error ? error.message : String(error);
						console.error(
							chalk.red(`\n❌ Error in game ${runId}: ${errorMsg}`),
						);

						const errorResult: GameResult = {
							timestamp: new Date().toISOString(),
							modelName,
							inferenceType: modelConfig.type,
							runId,
							maxTileAchieved: 0,
							finalScore: 0,
							numMoves: 0,
							win: false,
							durationSeconds: 0,
							error: `Game execution error: ${errorMsg}`,
						};

						logger.logResult(errorResult);
						runResults.push(errorResult);
					}
				}

				console.log(""); // New line after progress

				// Calculate and display stats
				const stats = calculateStats(runResults);

				if (stats && !("error" in stats)) {
					modelSummary[modelName] = stats;

					console.log(chalk.cyan("\n📊 Summary Statistics:"));
					console.log(
						chalk.gray(
							`  Successful runs: ${stats.successfulRuns}/${stats.totalRuns}`,
						),
					);
					console.log(
						chalk.gray(
							`  Avg Score: ${stats.avgScore.toFixed(2)} ± ${stats.stdScore.toFixed(2)}`,
						),
					);
					console.log(
						chalk.gray(
							`  Avg Max Tile: ${stats.avgMaxTile.toFixed(2)} ± ${stats.stdMaxTile.toFixed(2)}`,
						),
					);
					console.log(
						chalk.gray(`  Win Rate (≥2048): ${stats.winRate.toFixed(1)}%`),
					);
					console.log(chalk.gray(`  Avg Moves: ${stats.avgMoves.toFixed(1)}`));

					writeStatsToFile(stats, config.statsFile);

					console.log(chalk.green(`\n✅ Stats saved to: ${config.statsFile}`));
				} else {
					console.log(chalk.red("  ❌ No successful runs"));
					modelSummary[modelName] = { error: "No successful runs" };
				}
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				console.error(chalk.red(`\n❌ Fatal error: ${errorMsg}`));
				modelSummary[modelName] = { error: errorMsg };
			} finally {
				if (llmInference) {
					llmInference.cleanup();
				}
			}
		}

		// --- Final summary ---
		console.log(chalk.bold.blue("\n╔════════════════════════════════════╗"));
		console.log(chalk.bold.blue("║      Evaluation Complete! 🎉       ║"));
		console.log(chalk.bold.blue("╚════════════════════════════════════╝\n"));

		console.log(chalk.cyan("📈 Overall Results:"));
		for (const [name, stats] of Object.entries(modelSummary)) {
			console.log(chalk.bold(`\n  ${name}:`));
			if ("error" in stats) {
				console.log(chalk.red(`    ❌ Error: ${stats.error}`));
			} else {
				console.log(
					chalk.green(
						`    ✅ Successful: ${stats.successfulRuns}/${stats.totalRuns}`,
					),
				);
				console.log(chalk.gray(`    Score: ${stats.avgScore.toFixed(2)}`));
				console.log(chalk.gray(`    Max Tile: ${stats.avgMaxTile.toFixed(2)}`));
				console.log(chalk.gray(`    Win Rate: ${stats.winRate.toFixed(1)}%`));
			}
		}

		console.log(chalk.green(`\n✅ Results saved to: ${config.resultsFile}\n`));
	} catch (error) {
		console.error(chalk.red("Fatal error:"), error);
		process.exit(1);
	}
}

// Helper delay function
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
	console.error(chalk.red("Uncaught error:"), error);
	process.exit(1);
});
