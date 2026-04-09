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
