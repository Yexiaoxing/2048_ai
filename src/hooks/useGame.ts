import { useCallback, useState } from "react";
import { getInitialBoard, isBoardChanged, moveBoard, spawnTile } from "../shared/game-logic";
import { getGameStatus } from "../shared/game-status";
import { type Board, type Direction, GameStatus } from "../shared/game-types";
import { getRandomInteger } from "../utils/random";

export const useGame = () => {
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [gameStatus, setGameStatus] = useState(GameStatus.playing);
    const [board, setBoard] = useState<Board>(() => getInitialBoard(getRandomInteger(1, 8)));

    const resetGame = useCallback(() => {
        setScore(0);
        setMoves(0);
        setBoard(getInitialBoard(getRandomInteger(1, 8)));
        setGameStatus(GameStatus.playing);
    }, []);

    const move = useCallback(
        (direction: Direction) => {
            const [newBoard, scoreGain] = moveBoard(board, direction);

            // Check if board changed
            if (!isBoardChanged(board, newBoard)) {
                return; // No valid move
            }

            // Calculate score
            setScore((prevScore) => prevScore + scoreGain);

            // Spawn new tile if board changed
            const finalBoard = spawnTile(newBoard);

            // Update move count
            setMoves((prev) => prev + 1);

            // Update game status
            setGameStatus(getGameStatus(finalBoard));

            setBoard(finalBoard);
        },
        [board],
    );

    return {
        score,
        moves,
        board,
        gameStatus,

        resetGame,
        move,
    };
};
