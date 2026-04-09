import { useCallback, useState } from "react";
import { aiConfigStore } from "../shared/game-ai/game-ai-configs";
import { getAIMove, queryAvailableModels } from "../shared/game-ai/game-ai-local";
import { getRemoteAIMove } from "../shared/game-ai/game-ai-remote";
import type { Board } from "../shared/game-types";

export const useGameAI = (board: Board) => {
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [suggestion, setSuggestion] = useState<string>("");
    const [suggestionReason, setSuggestionReason] = useState<string>("");
    const [error, setError] = useState<string>("");

    const queryAI = useCallback(async (): Promise<void> => {
        try {
            setStatus("loading");
            setSuggestion("");
            setSuggestionReason("");
            setError("");
            const config = await aiConfigStore.getConfig();

            if (!config || config.aiProvider === "local") {
                const models = await queryAvailableModels();
                if (models.length === 0) {
                    throw new Error(
                        "No local Ollama models found. Pull a model first (for example: ollama pull gemma3).",
                    );
                }
                const model = config?.selectedLocalModel || models[0];
                if (!model) {
                    throw new Error("No local model selected.");
                }
                const { move, thinking } = await getAIMove(board, model);
                setSuggestion(move);
                setSuggestionReason(thinking || "");
            } else {
                const { move, thinking } = await getRemoteAIMove(board, config);
                setSuggestion(move);
                setSuggestionReason(thinking || "");
            }
            setStatus("idle");
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setStatus("error");
            setError(message);
        }
    }, [board]);

    const resetSuggestion = useCallback(() => {
        setSuggestion("");
        setSuggestionReason("");
        setError("");
        setStatus("idle");
    }, []);

    return {
        queryAI,
        error,
        status,
        suggestionReason,
        suggestion,
        resetSuggestion,
    };
};
