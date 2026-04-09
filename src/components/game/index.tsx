import type React from "react";
import { useGame } from "../../hooks/useGame";
import { useGameAI } from "../../hooks/useGameAI";
import { useGameKeyboardControl } from "../../hooks/useGameKeyboardControl";
import { stringToDirection } from "../../shared/game-logic";
import { AiSettingsDialog } from "../ai-settings-dialog";
import { Board } from "../board";
import { Controls } from "../controls";
import { Header } from "../header";
import { Button } from "../ui/button";
import {
    AiActionRow,
    AiSuggestedMove,
    AiSuggestionErrorRow,
    AiSuggestionReasonContainer,
    AiSuggestionReasonPre,
    AiSuggestionRow,
    BoardContainer,
    GameContainer,
    StatusRow,
    StretchedRow,
} from "./index.styles";
import { getStatusMessage } from "./strings";

export const Game: React.FC = () => {
    const { score, moves, board, move, gameStatus, resetGame } = useGame();

    useGameKeyboardControl((dir) => move(dir));

    const { queryAI, resetSuggestion, suggestion, suggestionReason, status, error } =
        useGameAI(board);

    const applyMoveSuggestion = (suggestedMove: string) => {
        const direction = stringToDirection(suggestedMove);
        if (direction !== null) {
            move(direction);
        }
        resetSuggestion();
    };

    return (
        <GameContainer>
            <Header score={score} moves={moves} />

            <div className="game-content">
                <BoardContainer>
                    <Board board={board} />
                </BoardContainer>
            </div>

            <StatusRow>{getStatusMessage(gameStatus)}</StatusRow>

            <StretchedRow>
                <Button onClick={resetGame} variant={"primary"}>
                    New Game
                </Button>
            </StretchedRow>
            <Controls onMove={move} />

            <AiActionRow>
                <Button onClick={queryAI} variant={"success"} disabled={status === "loading"}>
                    {status === "loading" ? "Getting AI Suggestion..." : "Get AI Suggestion"}
                </Button>
                <AiSettingsDialog />
            </AiActionRow>

            {suggestion && (
                <AiSuggestionRow>
                    <p>
                        AI suggests: <AiSuggestedMove>{suggestion.toUpperCase()}</AiSuggestedMove>
                    </p>
                    <AiSuggestionReasonContainer>
                        <details>
                            <summary>Reason</summary>
                            <AiSuggestionReasonPre>{suggestionReason}</AiSuggestionReasonPre>
                        </details>
                    </AiSuggestionReasonContainer>
                    <Button onClick={() => applyMoveSuggestion(suggestion)}>Apply Move</Button>
                </AiSuggestionRow>
            )}
            {error && (
                <AiSuggestionErrorRow>
                    <p>Error during querying AI suggestion: {error}</p>
                </AiSuggestionErrorRow>
            )}
        </GameContainer>
    );
};
