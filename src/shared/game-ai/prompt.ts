import type { Board } from "../game-types";

export const getGameAIMessages = (board: Board) => [
    {
        role: "system",
        content: `You are an AI that suggests the best move for the 2048 game. The board is represented as a 4x4 grid of numbers, where 0 represents an empty cell. Your task is to analyze the current board state and suggest the optimal move (up, down, left, or right) to maximize the score and increase the chances of winning.`,
    },
    {
        role: "user",
        content: `Here is the current board state:\n${board.map((row) => row.join(" ")).join("\n")}\nPlease suggest the best move.`,
    },
];
