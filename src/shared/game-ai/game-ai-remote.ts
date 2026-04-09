import type { Board } from "../game-types";
import type { IGameAiResponse } from "./game-ai.types";
import { getGameAIMessages } from "./prompt";
import { gameAiSchema } from "./schema";

interface IRemoteAiConfig {
    apiEndpoint: string;
    apiSecret?: string;
    selectedRemoteModel?: string;
}

export const getRemoteAIMove = async (
    board: Board,
    config: IRemoteAiConfig,
): Promise<IGameAiResponse> => {
    const requestHeader: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (config.apiSecret) {
        requestHeader.Authorization = `Bearer ${config.apiSecret}`;
    }

    const response = await fetch(config.apiEndpoint, {
        method: "POST",
        headers: requestHeader,
        body: JSON.stringify({
            model: config.selectedRemoteModel || "",
            messages: getGameAIMessages(board),
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "2048_move_decision",
                    strict: true,
                    schema: gameAiSchema.toJSONSchema(),
                },
            },
        }),
    });

    const content = (await response.json()) as {
        choices: { message: { content: string } }[];
    };
    const parsedAiResponse = gameAiSchema.safeParse(JSON.parse(content.choices[0].message.content));

    if (parsedAiResponse.success) {
        return {
            move: parsedAiResponse.data.move,
            thinking: parsedAiResponse.data.reason,
        };
    }

    throw parsedAiResponse.error;
};
