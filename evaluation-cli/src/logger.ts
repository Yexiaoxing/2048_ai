/**
 * Results logging to CSV
 */

import fs from "node:fs";

export interface GameResult {
	timestamp: string;
	modelName: string;
	inferenceType: string;
	runId?: number;
	maxTileAchieved: number;
	finalScore: number;
	numMoves: number;
	win: boolean;
	durationSeconds: number;
	error: string | null;
}

export interface GameStepTrace {
	stepNumber: number;
	boardBefore: number[][];
	boardAfter: number[][];
	suggestedMove: string | null;
	reasoning: string | null;
	outcome:
		| "moved"
		| "invalid-move"
		| "invalid-direction"
		| "unparsed-response"
		| "llm-error";
	message: string;
	scoreBefore: number;
	scoreAfter: number;
	scoreDelta: number;
	movesBefore: number;
	movesAfter: number;
	maxTileBefore: number;
	maxTileAfter: number;
	stuckCounter: number;
	error: string | null;
}

export interface GameTrace extends GameResult {
	steps: GameStepTrace[];
}

interface TraceFileContents {
	updatedAt: string;
	runs: GameTrace[];
}

type CsvRecord = GameResult;

const FIELDNAMES = [
	"timestamp",
	"modelName",
	"inferenceType",
	"runId",
	"maxTileAchieved",
	"finalScore",
	"numMoves",
	"win",
	"durationSeconds",
	"temperature",
	"max_new_tokens",
	"top_p",
	"min_p",
	"error",
];

export class ResultsLogger {
	private filename: string;

	constructor(filename: string = "2048_evaluation_results.csv") {
		this.filename = filename;
		this.ensureFileExists();
	}

	private ensureFileExists(): void {
		if (!fs.existsSync(this.filename)) {
			const headerLine = `${FIELDNAMES.join(",")}\n`;
			fs.writeFileSync(this.filename, headerLine, "utf8");
		}
	}

	logResult(result: CsvRecord): void {
		try {
			const row = this._resultToCsvRow(result);
			fs.appendFileSync(this.filename, `${row}\n`, "utf8");
		} catch (error) {
			console.error(`Error writing results to ${this.filename}:`, error);
		}
	}

	private _resultToCsvRow(result: CsvRecord): string {
		const values = FIELDNAMES.map((field) => {
			const camelCaseKey = (
				field.includes("_")
					? field.replace(/_([a-z])/g, (_, letter: string) =>
							letter.toUpperCase(),
						)
					: field.charAt(0).toLowerCase() + field.slice(1)
			) as keyof CsvRecord;
			const value = result[field as keyof CsvRecord] ?? result[camelCaseKey];

			if (value === undefined || value === null) {
				return "";
			}

			if (typeof value === "string") {
				// Escape quotes and wrap in quotes if contains comma
				if (
					value.includes(",") ||
					value.includes('"') ||
					value.includes("\n")
				) {
					return `"${value.replace(/"/g, '""')}"`;
				}
				return value;
			}

			return String(value);
		});

		return values.join(",");
	}

	getFilename(): string {
		return this.filename;
	}
}

export class TraceLogger {
	private filename: string;

	constructor(filename: string = "2048_evaluation_steps.json") {
		this.filename = filename;
		this.ensureFileExists();
	}

	private ensureFileExists(): void {
		if (!fs.existsSync(this.filename)) {
			this.writeTraceFile({
				updatedAt: new Date().toISOString(),
				runs: [],
			});
		}
	}

	logTrace(trace: GameTrace): void {
		try {
			const contents = this.readTraceFile();
			contents.updatedAt = new Date().toISOString();
			contents.runs.push(trace);
			this.writeTraceFile(contents);
		} catch (error) {
			console.error(`Error writing traces to ${this.filename}:`, error);
		}
	}

	getFilename(): string {
		return this.filename;
	}

	private readTraceFile(): TraceFileContents {
		if (!fs.existsSync(this.filename)) {
			return {
				updatedAt: new Date().toISOString(),
				runs: [],
			};
		}

		const raw = fs.readFileSync(this.filename, "utf8").trim();
		if (raw.length === 0) {
			return {
				updatedAt: new Date().toISOString(),
				runs: [],
			};
		}

		const parsed = JSON.parse(raw) as Partial<TraceFileContents>;
		return {
			updatedAt:
				typeof parsed.updatedAt === "string"
					? parsed.updatedAt
					: new Date().toISOString(),
			runs: Array.isArray(parsed.runs) ? parsed.runs : [],
		};
	}

	private writeTraceFile(contents: TraceFileContents): void {
		fs.writeFileSync(
			this.filename,
			`${JSON.stringify(contents, null, 2)}\n`,
			"utf8",
		);
	}
}
