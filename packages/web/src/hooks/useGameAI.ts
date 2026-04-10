import { aiConfigStore } from "@2048/game-ai/game-ai-configs";
import { getAIMove, queryAvailableModels } from "@2048/game-ai/game-ai-local";
import { getRemoteAIMove } from "@2048/game-ai/game-ai-remote";
import type { Board } from "@2048/game-logic";
import { logger } from "@2048/logger";
import { useCallback, useState } from "react";

export const useGameAI = (board: Board) => {
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [suggestion, setSuggestion] = useState<string>("");
    const [suggestionReason, setSuggestionReason] = useState<string>("");
    const [duration, setDuration] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const queryAI = useCallback(async (): Promise<void> => {
        try {
            setStatus("loading");
            setSuggestion("");
            setSuggestionReason("");
            setError("");
            setDuration(0);
            const config = await aiConfigStore.getConfig();

            const start = performance.now();

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

            const end = performance.now();
            const duration = ((end - start) / 1000).toFixed(2);
            setDuration(Number(duration));

            logger.info(`AI move query took ${duration} seconds.`);

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
        duration,
        resetSuggestion,
    };
};
