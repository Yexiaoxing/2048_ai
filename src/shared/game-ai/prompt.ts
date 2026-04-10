import type { Board } from "../game-types";

export const getGameAIMessages = (board: Board) => [
    {
        role: "system",
        content: `
You are an AI that suggests the best move for the 2048 game. The board is represented as a 4x4 grid of numbers, where 0 represents an empty cell. Your task is to analyze the current board state and suggest the optimal move (up, down, left, or right) to maximize the score and increase the chances of winning. Here are the rules of the game:

1. You can slide all tiles in one of the four directions (up, down, left, right).
2. When two tiles with the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided.
3. If a move makes no changes to the board, it is considered invalid and should not be played.
4. After each move, a new tile with a value of 2 or 4 will randomly appear in an empty spot on the board.
5. The game is won when a tile with the value of 2048 is created.
6. The game is lost when there are no valid moves left.`,
    },
    {
        role: "user",
        content: `Here is the current board state:\n${board.map((row) => row.join(" ")).join("\n")}\nPlease suggest the best move.`,
    },
];
