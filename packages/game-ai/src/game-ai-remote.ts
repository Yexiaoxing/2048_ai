import type { Board } from "@2048/game-logic";
import type { IGameAiResponse } from "./game-ai.types";
import { getGameAIMessages, getGameAIMessagesWithJSONSchemaInSystem } from "./prompt";
import { gameAiSchema } from "./schema";

const getRemoteErrorMessage = (payload: unknown): string | null => {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const record = payload as Record<string, unknown>;
    const message = record.message;
    if (typeof message === "string" && message.trim().length > 0) {
        return message;
    }

    const error = record.error;
    if (typeof error === "string" && error.trim().length > 0) {
        return error;
    }

    if (error && typeof error === "object") {
        const errorMessage = (error as Record<string, unknown>).message;
        if (typeof errorMessage === "string" && errorMessage.trim().length > 0) {
            return errorMessage;
        }
    }

    return null;
};

interface IRemoteAiConfig {
    apiEndpoint: string;
    apiSecret?: string;
    selectedRemoteModel?: string;
    noJSONSchemaSupport?: boolean;
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
            messages: config.noJSONSchemaSupport
                ? getGameAIMessagesWithJSONSchemaInSystem(board)
                : getGameAIMessages(board),
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

    const body = await response.text();

    let payload: unknown;
    try {
        payload = JSON.parse(body);
    } catch {
        throw new Error(`Remote AI returned a non-JSON response (${response.status}).`);
    }

    if (!response.ok) {
        const message = getRemoteErrorMessage(payload) || response.statusText || "Unknown error";
        throw new Error(`Remote AI request failed (${response.status}): ${message}`);
    }

    const choices = (payload as { choices?: { message?: { content?: string } }[] }).choices;
    const content = choices?.[0]?.message?.content;

    if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Remote AI response did not contain message content.");
    }

    let parsedContent: unknown;
    try {
        parsedContent = JSON.parse(content);
    } catch {
        if (
            content &&
            ["up", "down", "left", "right", "invalid"].includes(content.trim().toLowerCase())
        ) {
            parsedContent = {
                move: content.trim().toLowerCase(),
                reason: "",
            };
        } else {
            throw new Error(`Remote AI returned invalid JSON in message content.`);
        }
    }

    const parsedAiResponse = gameAiSchema.safeParse(parsedContent);

    if (parsedAiResponse.success) {
        return {
            move: parsedAiResponse.data.move,
            thinking: parsedAiResponse.data.reason,
        };
    }

    throw new Error(
        `Remote AI response schema validation failed: ${parsedAiResponse.error.message}`,
    );
};
