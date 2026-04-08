import type { Board } from "../game-types";
import type { IGameAiResponse } from "./game-ai.types";
import { aiConfigStore } from "./game-ai-configs";
import { getGameAIMessages } from "./prompt";
import { gameAiSchema } from "./schema";

export const getRemoteAIMove = async (board: Board): Promise<IGameAiResponse> => {
    const aiConfig = await aiConfigStore.getConfig();
    if (!aiConfig || aiConfig.aiProvider !== "remote") {
        throw new Error("Remote AI provider is not configured.");
    }

    const requestHeader: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (aiConfig.apiSecret) {
        requestHeader.Authorization = `Bearer ${aiConfig.apiSecret}`;
    }

    const response = await fetch(aiConfig.apiEndpoint, {
        method: "POST",
        headers: requestHeader,
        body: JSON.stringify({
            model: aiConfig.selectedModel || "",
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

    const content = await response.json();
    const parsedAiResponse = gameAiSchema.safeParse(JSON.parse(content.choices[0].message.content));

    if (parsedAiResponse.success) {
        return {
            move: parsedAiResponse.data.move,
            thinking: parsedAiResponse.data.reason,
        };
    }

    throw parsedAiResponse.error;
};
