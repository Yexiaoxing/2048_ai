import { getAIMove } from "@2048/game-ai/game-ai-local";
import { getRemoteAIMove } from "@2048/game-ai/game-ai-remote";
import type { Board } from "@2048/game-logic";

export type LLMConfig =
    | {
          name: string;
          type: "ollama";
          apiModelName: string;
      }
    | {
          name: string;
          type: "ollama" | "openai";
          apiModelName: string;
          baseUrl: string;
          apiKey?: string;
          noJSONSchemaSupport?: boolean;
      };

export interface LLMResponse {
    completion: string;
    reasoning: string | null;
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
    async generate(board: Board): Promise<LLMResponse> {
        try {
            const response = await getAIMove(board, this.config.apiModelName || "");
            const completion = response.move;

            if (completion) {
                return {
                    completion,
                    reasoning: response.thinking ?? null,
                    error: null,
                };
            } else {
                return {
                    completion: "",
                    reasoning: response.thinking ?? null,
                    error: "Ollama returned empty response",
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return { completion: "", reasoning: null, error: errorMessage };
        }
    }
}

export class OpenAIInference extends LLMInference {
    private baseUrl: string;
    private apiKey: string;

    constructor(config: LLMConfig) {
        super(config);

        if (config.type !== "openai") {
            throw new Error("OpenAI API key not provided");
        }

        this.baseUrl = config.baseUrl || "https://api.openai.com/v1";
        this.apiKey = config.apiKey || process.env.OPENAI_API_KEY || "";
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
                return {
                    completion,
                    reasoning: response.thinking ?? null,
                    error: null,
                };
            } else {
                return {
                    completion: "",
                    reasoning: response.thinking ?? null,
                    error: "OpenAI returned empty response",
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return { completion: "", reasoning: null, error: errorMessage };
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
            throw new Error(`Unsupported LLM type: ${config}`);
    }
}
