import { useCallback, useState } from "react";
import { aiConfigStore } from "../shared/game-ai/game-ai-configs";
import { getAIMove, queryAvailableModels } from "../shared/game-ai/game-ai-local";
import { getRemoteAIMove } from "../shared/game-ai/game-ai-remote";
import type { Board } from "../shared/game-types";

export const useGameAI = (board: Board) => {
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [suggestion, setSuggestion] = useState<string>("");
    const [suggestionReason, setSuggestionReason] = useState<string | null>("");
    const [error, setError] = useState<string>("");

    const queryAI = useCallback(async (): Promise<void> => {
        try {
            setStatus("loading");
            setSuggestion("");
            setError("");
            const config = await aiConfigStore.getConfig();

            if (!config || config.aiProvider === "local") {
                const models = await queryAvailableModels();
                const model = config?.selectedLocalModel || models[0];
                const { move, thinking } = await getAIMove(board, model);
                setSuggestion(move);
                setSuggestionReason(thinking || "");
            } else {
                const aiConfig = await aiConfigStore.getConfig();
                const { move, thinking } = await getRemoteAIMove(board, aiConfig!);
                setSuggestion(move);
                setSuggestionReason(thinking || "");
            }
        } catch (error) {
            setStatus("error");
            setError((error as Error).message);
        } finally {
            setStatus("idle");
        }
    }, [board]);

    const resetSuggestion = useCallback(() => {
        setSuggestion("");
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
