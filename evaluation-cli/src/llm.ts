import { getAIMove } from "../../src/shared/game-ai/game-ai-local";
import { getRemoteAIMove } from "../../src/shared/game-ai/game-ai-remote";
import type { Board } from "../../src/shared/game-types";

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

export class LLMInference {
	protected config: LLMConfig;

	constructor(config: LLMConfig) {
		this.config = config;
	}

	async generate(_board: Board): Promise<LLMResponse> {
		throw new Error("Not implemented");
	}

	cleanup(): void {
		// Override in subclasses if needed
	}
}

export class OllamaInference extends LLMInference {
	constructor(config: LLMConfig) {
		super(config);
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
