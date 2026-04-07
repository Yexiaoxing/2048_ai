import type React from "react";
import { useGame } from "../../hooks/useGame";
import { Board } from "../board";
import {
    BoardContainer,
    GameContainer,
    NewGameRow,
    RowContainer,
    StatusRow,
} from "./index.styles";
import { Header } from "../header";
import { useGameKeyboardControl } from "../../hooks/useGameKeyboardControl";
import { Button } from "../ui/button";
import { getStatusMessage } from "./strings";
import { Controls } from "../controls";

export const Game: React.FC = () => {
    const { score, moves, board, move, gameStatus, resetGame } = useGame();

    useGameKeyboardControl((dir) => move(dir));

    return (
        <GameContainer>
            <Header score={score} moves={moves} />

            <div className="game-content">
                <BoardContainer>
                    <Board board={board} />
                </BoardContainer>
            </div>

            <StatusRow>
                <div className={`status ${gameStatus}`}>
                    {getStatusMessage(gameStatus)}
                </div>
            </StatusRow>
            <NewGameRow>
                <Button onClick={resetGame} variant={"outline"}>
                    New Game
                </Button>
            </NewGameRow>
            <Controls onMove={move} />

            <NewGameRow>
                <Button onClick={resetGame} variant={"success"}>
                    Get AI Suggestion
                </Button>
            </NewGameRow>
        </GameContainer>
    );
};
