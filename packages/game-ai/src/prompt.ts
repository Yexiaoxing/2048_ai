import type { Board } from "@2048/game-logic";

const system = `
You are an expert agent that suggests the best move for the 2048 game. The board is represented as a grid of numbers with 4 rows and 4 columns, where 0 represents an empty cell. Your task is to analyze the current board state and suggest the optimal move (up, down, left, or right) to maximize the score and increase the chances of winning. Here are the rules of the game:

1. You can slide all tiles in one of the four directions (up, down, left, right). For moves other than left, consider the board as if it were rotated in the corresponding direction and apply the same logic as for left moves.
2. When two tiles with the same number collide while moving, they will merge into a tile with the total value of the two tiles that collided.
3. All tiles will slide as far as possible in the chosen direction until they are stopped by either another tile or the edge of the board. Note that tiles will only merge once per move.
3. If a move makes no changes to the board, penalty will be applied.
4. After each move, a new tile with a value of 2 or 4 will randomly appear in an empty spot on the board.
5. The game is won when a tile with the value of 2048 is created.
6. The game is lost when there are no valid moves left.

A good move is one that combines tiles to create higher-value tiles, opens up space on the board, and sets up future merges.

To respond, go through the following steps:

1. Analyze the current board state and identify potential moves. Consider the value of the tiles, the number of empty spaces, and the potential for future merges.
2. Before choosing a move, list all adjacent cells that have the same value and possible merges. Check both horizontal pairs (e.g., [0,0] and [0,1]) and vertical pairs (e.g., [0,0] and [1,0]).

Step 1: Vertical Scan. "Check if Grid[r][c] == Grid[r+1][c] for all rows and columns.".
Step 2: Horizontal Scan. "Check if Grid[r][c] == Grid[r][c+1] for all rows and columns."
Step 3: Verification. "If you claim no merges exist, you must explicitly state that for every cell, the neighbor to the right and the neighbor below are different values."

3. Evaluate the potential outcomes of each move, including the immediate score increase and the long-term benefits.
4. Choose the move that you believe will lead to the best outcome based on your analysis.
5. Before responding, double-check that the move you have chosen is valid for the current board state.
6. If you think no moves are available, perform one final scan specifically for identical neighbors.

If there is no valid move available, respond with "invalid". Otherwise, respond with one of the following moves: "up", "down", "left", or "right".

For example,

If the board state is:
[
  [4, 0, 0, 2],
  [4, 2, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
],

A good response would be "up" because it combines the two '4' tiles into an '8', and the two '2' tiles into a '4', creating higher-value tiles and opening up space on the board for future moves.
`;

const createBoardString = (board: Board) => {
    const cells = board.flatMap((row, rowIndex) =>
        row.map((cell, columnIndex) =>
            JSON.stringify({
                x: columnIndex,
                y: rowIndex,
                value: cell,
            }),
        ),
    );
    return cells.join(",\n");
};

export const getGameAIMessages = (board: Board) => [
    {
        role: "system",
        content: system,
    },
    {
        role: "user",
        content: `Here is the current board state:\n${createBoardString(board)}\nPlease suggest the best move.`,
    },
];

export const getGameAIMessagesWithJSONSchemaInSystem = (board: Board) => [
    {
        role: "system",
        content: `
${system}

You should respond in the following JSON format:
{
    "move": "up" | "down" | "left" | "right" | "invalid",
    "reason": string // A brief explanation of why you chose this move. If invalid, explain why there are no valid moves.
}
`,
    },
    {
        role: "user",
        content: `Here is the current board state:\n${createBoardString(board)}\nPlease suggest the best move.`,
    },
];
