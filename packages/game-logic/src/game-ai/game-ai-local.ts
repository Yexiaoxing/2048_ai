import ollama from "ollama/browser";
import type { Board } from "../game-types";
import type { IGameAiResponse } from "./game-ai.types";
import { getGameAIMessages } from "./prompt";
import { type GameAiSchema, gameAiSchema } from "./schema";

export const queryAvailableModels = async (): Promise<string[]> => {
    const response = await ollama.list();
    return response.models.map((model) => model.name);
};

export const getAIMove = async (board: Board, model: string): Promise<IGameAiResponse> => {
    const response = await ollama.chat({
        model: model,
        messages: getGameAIMessages(board),
        format: gameAiSchema.toJSONSchema(),
    });

    let content: GameAiSchema;
    try {
        content = JSON.parse(response.message.content);
    } catch {
        throw new Error("Local AI returned invalid JSON in message content.");
    }

    const parsedAiResponse = gameAiSchema.safeParse(content);

    if (parsedAiResponse.success) {
        return {
            move: parsedAiResponse.data.move,
            thinking: parsedAiResponse.data.reason,
        };
    }

    throw parsedAiResponse.error;
};
