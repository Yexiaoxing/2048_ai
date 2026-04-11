#!/usr/bin/env -S npx tsx

import fs from "node:fs";
import path from "node:path";
import { getAIMove } from "@2048/game-ai/game-ai-local";
import { getRemoteAIMove } from "@2048/game-ai/game-ai-remote";
import { type Board, Direction, directionToString, stringToDirection } from "@2048/game-logic";
import chalk from "chalk";
import cliProgress from "cli-progress";

type ModelConfig =
    | {
          name: string;
          type: "ollama";
          apiModelName: string;
      }
    | {
          name: string;
          type: "openai";
          apiModelName: string;
          apiEndpoint: string;
          apiKey?: string;
          noJSONSchemaSupport?: boolean;
      };

interface EvaluatorConfig {
    models: ModelConfig[];
    datasetPath: string;
    labelField: string;
    limit?: number;
    shuffle?: boolean;
    resultsFile?: string;
}

interface DatasetRow {
    board: Board;
    [key: string]: unknown;
}

interface ExampleResult {
    index: number;
    board: Board;
    expectedMove: string;
    aiMove: string;
    aiThinking?: string;
    aligned: boolean;
    error?: string;
}

interface ModelResult {
    model: string;
    type: "ollama" | "openai";
    total: number;
    evaluated: number;
    aligned: number;
    alignmentRate: number;
    failures: number;
    examples: ExampleResult[];
}

const DEFAULT_CONFIG: EvaluatorConfig = {
    models: [
        {
            name: "gemma4:e4b",
            type: "ollama",
            apiModelName: "gemma4:e4b",
        },
    ],
    datasetPath: "dataset/output/game_states.json",
    labelField: "bestMoveExpectimax",
    limit: 200,
    shuffle: false,
    resultsFile: "results/single_move_eval_results.json",
};

const parseExpectedDirection = (value: unknown): Direction | null => {
    if (typeof value === "number") {
        if (value >= Direction.Up && value <= Direction.Right) {
            return value as Direction;
        }
        return null;
    }

    if (typeof value === "string") {
        return stringToDirection(value);
    }

    return null;
};

const resolveExpectedMove = (row: DatasetRow, labelField: string): Direction | null => {
    const direct = parseExpectedDirection(row[labelField]);
    if (direct !== null) {
        return direct;
    }

    const fallbackFields = ["bestMove", "bestMoveExpectimax", "bestMoveMinimax"];
    for (const field of fallbackFields) {
        const parsed = parseExpectedDirection(row[field]);
        if (parsed !== null) {
            return parsed;
        }
    }

    return null;
};

const shuffleInPlace = <T>(items: T[]): void => {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }
};

const ensureParentDirectory = (filePath: string): void => {
    const parent = path.dirname(filePath);
    if (!fs.existsSync(parent)) {
        fs.mkdirSync(parent, { recursive: true });
    }
};

const loadConfig = (configPathArg?: string): EvaluatorConfig => {
    const fallbackPath = path.resolve(process.cwd(), "config.ollama.json");
    const selectedPath = configPathArg ? path.resolve(configPathArg) : fallbackPath;

    if (!fs.existsSync(selectedPath)) {
        return DEFAULT_CONFIG;
    }

    try {
        const content = fs.readFileSync(selectedPath, "utf8");
        const loaded = JSON.parse(content) as Partial<EvaluatorConfig>;

        return {
            ...DEFAULT_CONFIG,
            ...loaded,
            models:
                loaded.models && loaded.models.length > 0 ? loaded.models : DEFAULT_CONFIG.models,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(
            chalk.yellow(`Failed to parse config at ${selectedPath}. Using defaults. (${message})`),
        );
        return DEFAULT_CONFIG;
    }
};

const loadDataset = (datasetPath: string): DatasetRow[] => {
    const resolvedPath = path.resolve(datasetPath);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Dataset file not found: ${resolvedPath}`);
    }

    const content = fs.readFileSync(resolvedPath, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
        throw new Error("Dataset must be a JSON array.");
    }

    return parsed as DatasetRow[];
};

const queryModel = async (
    model: ModelConfig,
    board: Board,
): Promise<{ move: string; reason: string | null; error: string | null }> => {
    try {
        if (model.type === "ollama") {
            const response = await getAIMove(board, model.apiModelName);
            return { move: response.move, reason: response.thinking || "", error: null };
        }

        const apiKey = model.apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return {
                move: "",
                reason: "",
                error: "Missing OpenAI API key (config.apiKey or OPENAI_API_KEY).",
            };
        }

        const response = await getRemoteAIMove(board, {
            apiEndpoint: model.apiEndpoint,
            apiSecret: apiKey,
            selectedRemoteModel: model.apiModelName,
            noJSONSchemaSupport: model.noJSONSchemaSupport || false,
        });

        return { move: response.move, reason: response.thinking || "", error: null };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { move: "", reason: "", error: message };
    }
};

const evaluateModel = async (
    model: ModelConfig,
    rows: DatasetRow[],
    labelField: string,
): Promise<ModelResult> => {
    let aligned = 0;
    let evaluated = 0;
    let failures = 0;
    const examples: ExampleResult[] = [];

    const bar = new cliProgress.SingleBar(
        {
            format: `${model.name} |{bar}| {percentage}% | {value}/{total} | aligned={aligned} failures={failures}`,
            hideCursor: true,
            barCompleteChar: "\u2588",
            barIncompleteChar: "\u2591",
        },
        cliProgress.Presets.shades_classic,
    );

    bar.start(rows.length, 0, { aligned: 0, failures: 0 });

    const logWithProgress = (message: string, current: number): void => {
        bar.stop();
        console.log(message);
        bar.start(rows.length, current, { aligned, failures });
    };

    for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const current = index + 1;
        const expectedDirection = resolveExpectedMove(row, labelField);
        if (expectedDirection === null) {
            failures++;
            examples.push({
                index,
                board: row.board,
                expectedMove: "invalid",
                aiMove: "invalid",
                aligned: false,
                error: `Missing or invalid expected move in field '${labelField}'.`,
            });
            bar.increment(1, { aligned, failures });
            logWithProgress(
                `[${model.name}] ${current}/${rows.length} | expected=invalid | ai=invalid | aligned=false | error=missing expected move`,
                current,
            );
            continue;
        }

        const expectedMove = directionToString(expectedDirection);
        const response = await queryModel(model, row.board);

        if (response.error) {
            failures++;
            examples.push({
                index,
                board: row.board,
                expectedMove,
                aiMove: "invalid",
                aligned: false,
                error: response.error,
            });
            bar.increment(1, { aligned, failures });
            logWithProgress(
                `[${model.name}] ${current}/${rows.length} | expected=${expectedMove} | ai=invalid | aligned=false | error=${response.error}`,
                current,
            );
            continue;
        }

        const aiDirection = stringToDirection(response.move);
        if (aiDirection === null) {
            failures++;
            examples.push({
                index,
                board: row.board,
                expectedMove,
                aiMove: response.move,
                aligned: false,
                error: `Model returned invalid move: '${response.move}'.`,
            });
            bar.increment(1, { aligned, failures });
            logWithProgress(
                `[${model.name}] ${current}/${rows.length} | expected=${expectedMove} | ai=${response.move} | aligned=false | error=invalid move format`,
                current,
            );
            continue;
        }

        const aiMove = directionToString(aiDirection);
        const isAligned = aiDirection === expectedDirection;

        if (isAligned) {
            aligned++;
        }

        evaluated++;
        examples.push({
            index,
            board: row.board,
            expectedMove,
            aiMove,
            aligned: isAligned,
            aiThinking: response.reason || undefined,
        });

        bar.increment(1, { aligned, failures });
        logWithProgress(
            `[${model.name}] ${current}/${rows.length} | expected=${expectedMove} | ai=${aiMove} | aligned=${isAligned}`,
            current,
        );
    }

    bar.stop();

    const alignmentRate = evaluated > 0 ? (aligned / evaluated) * 100 : 0;

    return {
        model: model.name,
        type: model.type,
        total: rows.length,
        evaluated,
        aligned,
        alignmentRate,
        failures,
        examples,
    };
};

const main = async (): Promise<void> => {
    const configPath = process.argv[2];
    const config = loadConfig(configPath);

    console.log(chalk.bold.blue("\n2048 Single-Move Alignment Evaluator\n"));
    console.log(chalk.gray(`Dataset: ${path.resolve(config.datasetPath)}`));
    console.log(chalk.gray(`Label field: ${config.labelField}`));

    const dataset = loadDataset(config.datasetPath);
    const workingSet = [...dataset];

    if (config.shuffle) {
        shuffleInPlace(workingSet);
    }

    const limit = Math.max(1, config.limit || workingSet.length);
    const rows = workingSet.slice(0, limit);

    console.log(chalk.gray(`Samples to evaluate: ${rows.length}\n`));

    const results: ModelResult[] = [];

    for (const model of config.models) {
        console.log(chalk.cyan(`Evaluating model: ${model.name} (${model.type})`));
        const modelResult = await evaluateModel(model, rows, config.labelField);
        results.push(modelResult);

        console.log(chalk.green(`Aligned: ${modelResult.aligned}/${modelResult.evaluated}`));
        console.log(chalk.green(`Alignment rate: ${modelResult.alignmentRate.toFixed(2)}%`));
        console.log(chalk.yellow(`Failures: ${modelResult.failures}\n`));
    }

    const outputFile = path.resolve(
        config.resultsFile || DEFAULT_CONFIG.resultsFile || "results/single_move_eval_results.json",
    );
    ensureParentDirectory(outputFile);
    fs.writeFileSync(
        outputFile,
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                datasetPath: path.resolve(config.datasetPath),
                labelField: config.labelField,
                evaluatedRows: rows.length,
                results,
            },
            null,
            2,
        ),
    );

    console.log(chalk.bold.green(`Saved results to ${outputFile}`));
};

main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`Fatal error: ${message}`));
    process.exit(1);
});
