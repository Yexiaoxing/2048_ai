/**
 * LLM inference implementations
 */

import { getAIMove } from "../../src/shared/game-ai/game-ai-local";
import { getRemoteAIMove } from "../../src/shared/game-ai/game-ai-remote";
import { type Board, Direction } from "../../src/shared/game-types";

export interface LLMConfig {
	name: string;
	type: "ollama" | "openai";
	path?: string; // For Ollama
	apiModelName?: string; // For OpenAI
	baseUrl?: string; // For OpenAI
	apiKey?: string; // For OpenAI
}

export interface LLMResponse {
	completion: string;
	error: string | null;
}

const SYSTEM_PROMPT = `You are a deep thinker. You analyze problems and provide answers as asked of you. When answering you provide your reasoning in <thinking> tags and final answer in <answer> tags. <thinking>
Write your detailed analysis and step-by-step reasoning here
</thinking>
<answer>
Write your final response here
</answer>
You do not say anything outside of the tags. You follow the format exactly as asked of you.`;

const LLM_PROMPT_TEMPLATE = `You are an expert 2048 game player. Given a board state, select the best next move.

The 2048 game board is a 4x4 grid where tiles with powers of 2 can be merged by swiping.
When identical tiles collide, they combine into one tile with double the value.

Current board state:
{board_text}

Analyze this board carefully. Consider:
1. Available empty cells
2. Potential tile merges
3. High-value tile positions
4. Avoiding game-ending situations

Based on your analysis, what is the BEST move? Choose only one direction:
- up
- down
- left
- right

Format your response as follows:
<thinking>
Analyze the current board configuration thoroughly. Consider what happens with each possible move (up, down, left, right). Think about immediate merges, resulting empty cells, and how the board position affects future possibilities. Consider how each move impacts your ability to create higher-value tiles and maximize score. Think several moves ahead if possible. Then make your decision to move up, down, left, or right.
</thinking>
<answer>
[SINGLE WORD RESPONSE: up/down/left/right]
</answer>`;

export class LLMInference {
	protected config: LLMConfig;

	constructor(config: LLMConfig) {
		this.config = config;
	}

	async generate(board: Board): Promise<LLMResponse> {
		throw new Error("Not implemented");
	}

	cleanup(): void {
		// Override in subclasses if needed
	}
}

export class OllamaInference extends LLMInference {
	private baseUrl: string;

	constructor(config: LLMConfig) {
		super(config);
		this.baseUrl = config.baseUrl || "http://localhost:11434";
	}

	async generate(board: Board): Promise<LLMResponse> {
		try {
			const response = await getAIMove(board, this.config.path!);
			const completion = response.move;

			if (completion) {
				return { completion, error: null };
			} else {
				return {
					completion: "",
					error: "Ollama returned empty response",
				};
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return { completion: "", error: errorMessage };
		}
	}
}

export class OpenAIInference extends LLMInference {
	private baseUrl: string;
	private apiKey: string;

	constructor(config: LLMConfig) {
		super(config);
		this.baseUrl = config.baseUrl || "https://api.openai.com/v1";
		this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";

		if (!this.apiKey) {
			throw new Error("OpenAI API key not provided");
		}
	}

	async generate(board: Board): Promise<LLMResponse> {
		try {
			const response = await getRemoteAIMove(board, {
				apiEndpoint: `${this.baseUrl}/chat/completions`,
				apiSecret: this.apiKey,
				selectedRemoteModel: this.config.apiModelName,
			});
			const completion = response.move;

			if (completion) {
				return { completion, error: null };
			} else {
				return {
					completion: "",
					error: "OpenAI returned empty response",
				};
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return { completion: "", error: errorMessage };
		}
	}
}

export function parseAction(completion: string): string | null {
	const match = completion.match(/<answer>\s*(.*?)\s*<\/answer>/is);

	if (match) {
		const action = match[1].trim().toLowerCase();
		if (["up", "down", "left", "right"].includes(action)) {
			return action;
		}
	}

	// Fallback: check if entire response is just the action word
	const simple = completion.trim().toLowerCase();
	if (["up", "down", "left", "right"].includes(simple)) {
		return simple;
	}

	return null;
}

export function createInference(config: LLMConfig): LLMInference {
	switch (config.type) {
		case "ollama":
			return new OllamaInference(config);
		case "openai":
			return new OpenAIInference(config);
		default:
			throw new Error(`Unsupported LLM type: ${config.type}`);
	}
}
