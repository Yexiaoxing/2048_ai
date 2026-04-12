import {
    type Board,
    type Direction,
    GameStatus,
    getGameStatus,
    getInitialBoard,
    getRandomInteger,
    isBoardChanged,
    moveBoard,
    spawnTile,
} from "@2048/game-logic";
import { useCallback, useState } from "react";

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

    const overrideBoard = useCallback((newBoard: Board) => {
        setBoard(newBoard);
        setGameStatus(getGameStatus(newBoard));
    }, []);

    return {
        score,
        moves,
        board,
        gameStatus,

        resetGame,
        move,
        overrideBoard,
    };
};
