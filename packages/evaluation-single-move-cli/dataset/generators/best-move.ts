// Algorithm sources:
// https://medium.com/@doodoroma/ai-solution-for-2048-9d591b3cc49c
// https://stackoverflow.com/questions/22342854/what-is-the-optimal-algorithm-for-the-game-2048/22389702#22389702
//
// This module includes two search strategies for 2048 move suggestion:
// 1) Minimax (adversarial approximation): treats random spawns as if they
//    were chosen by an opponent trying to minimize our score.
// 2) Expectimax (stochastic model): treats random spawns as chance events and
//    uses their probabilities to maximize expected score.
//
// Both strategies share the same heuristic evaluator (scoreBoard), so differences
// in output come from the tree search semantics rather than the value function.

import {
    BOARD_SIZE,
    type Board,
    canMove,
    copyBoard,
    Direction,
    getEmptyCells,
    getMaxTile,
    isBoardChanged,
    moveBoard,
} from "@2048/game-logic";

/**
 * Score heuristics for evaluating board positions
 */

// Count empty cells
const countEmpty = (board: Board): number => {
    let count = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) count++;
        }
    }
    return count;
};

// Check monotonicity - prefer boards where tiles are arranged in order
const calculateMonotonicity = (board: Board): number => {
    let score = 0;

    // Check left-to-right monotonicity
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE - 1; j++) {
            const left = board[i][j];
            const right = board[i][j + 1];
            if (left !== 0 && right !== 0) {
                if (left < right) score += 10;
                else if (left > right) score -= 10;
            }
        }
    }

    // Check top-to-bottom monotonicity
    for (let i = 0; i < BOARD_SIZE - 1; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const top = board[i][j];
            const bottom = board[i + 1][j];
            if (top !== 0 && bottom !== 0) {
                if (top < bottom) score += 10;
                else if (top > bottom) score -= 10;
            }
        }
    }

    return score;
};

// Calculate smoothness - prefer when adjacent tiles have similar values
// log2 is used to measure the difference in terms of merges needed to combine them
const calculateSmoothness = (board: Board): number => {
    let score = 0;

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j] === 0) continue;

            const value = board[i][j] as number;

            if (j < BOARD_SIZE - 1 && board[i][j + 1] !== 0) {
                // Check right neighbor
                const diff = Math.abs(Math.log2(value) - Math.log2(board[i][j + 1] as number));
                score -= diff * 10;
            }

            if (i < BOARD_SIZE - 1 && board[i + 1][j] !== 0) {
                // Check bottom neighbor
                const diff = Math.abs(Math.log2(value) - Math.log2(board[i + 1][j] as number));
                score -= diff * 10;
            }
        }
    }

    return score;
};

// Main heuristic scoring function
export const scoreBoard = (board: Board): number => {
    const emptyCount = countEmpty(board);
    const maxTile = getMaxTile(board);
    const monotonicity = calculateMonotonicity(board);
    const smoothness = calculateSmoothness(board);

    // Weighted combination of heuristics
    let score = 0;
    score += emptyCount * 100; // Highly value empty cells
    score += Math.log2(maxTile) * 50; // Value high tiles
    score += monotonicity * 2;
    score += smoothness;

    return score;
};

/**
 * Minimax search for 2048 (adversarial approximation).
 *
 * Tree structure:
 * - Max node: player chooses a move (left/right/up/down) that maximizes score.
 * - Min node: tile spawn is treated as a hostile choice that minimizes score.
 *
 * Why this is an approximation:
 * - In real 2048, new tiles are random, not adversarial.
 * - Using min nodes is conservative: it tends to prefer safer moves and can
 *   under-value high-upside moves that rely on favorable random spawns.
 *
 * Depth semantics:
 * - currentDepth decreases at every transition (max -> min and min -> max).
 * - Search stops at depth 0 or terminal boards and returns scoreBoard.
 *
 * Implementation detail in this version:
 * - Min nodes sample up to 3 random empty cells, then test both spawn values
 *   (2 and 4). This reduces branching but introduces variance between runs.
 *
 * Complexity intuition:
 * - Full minimax would branch by legal moves and all empty-cell spawns.
 * - Sampling lowers compute cost from combinatorial growth to a cheaper,
 *   approximate evaluation suitable for dataset generation.
 */
export const getMinimaxSuggestion = (board: Board, depth: number = 1): Direction => {
    const moves: Direction[] = [Direction.Left, Direction.Right, Direction.Up, Direction.Down];

    const minimax = (currentBoard: Board, currentDepth: number, isMaximizing: boolean): number => {
        if (currentDepth === 0 || !canMove(currentBoard)) {
            return scoreBoard(currentBoard);
        }

        if (isMaximizing) {
            // Our turn - pick move that maximizes score
            let maxScore = -Infinity;
            for (const move of moves) {
                const [newBoard] = moveBoard(currentBoard, move);
                if (isBoardChanged(currentBoard, newBoard)) {
                    const score = minimax(newBoard, currentDepth - 1, false);
                    maxScore = Math.max(maxScore, score);
                }
            }
            return maxScore === -Infinity ? scoreBoard(currentBoard) : maxScore;
        } else {
            // Opponent's turn - simulate random tile placement
            const emptyCell = getEmptyCells(currentBoard);
            if (emptyCell.length === 0) {
                return scoreBoard(currentBoard);
            }

            let minScore = Infinity;
            // Sample a few random positions instead of trying all
            const samplesToTry = Math.min(3, emptyCell.length);
            for (let i = 0; i < samplesToTry; i++) {
                const idx = Math.floor(Math.random() * emptyCell.length);
                const [row, col] = emptyCell[idx];

                // Try both 2 and 4
                for (const val of [2, 4]) {
                    const testBoard = copyBoard(currentBoard);
                    testBoard[row][col] = val;
                    const score = minimax(testBoard, currentDepth - 1, true);
                    minScore = Math.min(minScore, score);
                }
            }
            return minScore === Infinity ? scoreBoard(currentBoard) : minScore;
        }
    };

    let bestMove: Direction = Direction.Left;
    let bestScore = -Infinity;

    for (const move of moves) {
        const [newBoard] = moveBoard(board, move);

        if (!isBoardChanged(board, newBoard)) {
            continue;
        }

        const score = minimax(newBoard, depth, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
};

/**
 * Expectimax search for 2048 (stochastic model).
 *
 * Tree structure:
 * - Max node: player chooses the move with maximum downstream value.
 * - Chance node: tile spawn outcomes are averaged by probability.
 *
 * Chance model used:
 * - Empty cell location is uniform among all empty cells.
 * - Spawn value probabilities follow standard 2048 behavior:
 *   P(2) = 0.9 and P(4) = 0.1.
 *
 * Expectation formula at chance nodes:
 * - For each empty cell c:
 *   E_c = 0.9 * V(board + 2 at c) + 0.1 * V(board + 4 at c)
 * - Total expected value is average over all empty cells.
 *
 * Why expectimax is a better fit for 2048:
 * - 2048 is stochastic, not adversarial.
 * - Expected-value backups generally produce stronger move selection than
 *   worst-case backups when randomness is unbiased.
 *
 * Tradeoff:
 * - Chance nodes enumerate all empty cells, so this is more expensive than
 *   sampled minimax at the same depth.
 */
export const getExpectimaxSuggestion = (board: Board, depth: number = 3): Direction => {
    const moves: Direction[] = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
    const probabilityOf2 = 0.9;
    const probabilityOf4 = 0.1;

    const expectimax = (
        currentBoard: Board,
        currentDepth: number,
        isMaximizing: boolean,
    ): number => {
        if (currentDepth === 0 || !canMove(currentBoard)) {
            return scoreBoard(currentBoard);
        }

        if (isMaximizing) {
            // Player turn: choose the move with the highest expected utility.
            let maxScore = -Infinity;

            for (const move of moves) {
                const [newBoard] = moveBoard(currentBoard, move);
                if (!isBoardChanged(currentBoard, newBoard)) {
                    continue;
                }

                const score = expectimax(newBoard, currentDepth - 1, false);
                maxScore = Math.max(maxScore, score);
            }

            return maxScore === -Infinity ? scoreBoard(currentBoard) : maxScore;
        }

        // Chance turn: average over all possible spawns with 2048 probabilities.
        const emptyCells = getEmptyCells(currentBoard);
        if (emptyCells.length === 0) {
            return scoreBoard(currentBoard);
        }

        const cellProbability = 1 / emptyCells.length;
        let expectedScore = 0;

        for (const [row, col] of emptyCells) {
            const boardWith2 = copyBoard(currentBoard);
            boardWith2[row][col] = 2;

            const boardWith4 = copyBoard(currentBoard);
            boardWith4[row][col] = 4;

            const scoreWith2 = expectimax(boardWith2, currentDepth - 1, true);
            const scoreWith4 = expectimax(boardWith4, currentDepth - 1, true);

            expectedScore +=
                cellProbability * (probabilityOf2 * scoreWith2 + probabilityOf4 * scoreWith4);
        }

        return expectedScore;
    };

    let bestMove: Direction = Direction.Left;
    let bestScore = -Infinity;

    for (const move of moves) {
        const [newBoard] = moveBoard(board, move);

        if (!isBoardChanged(board, newBoard)) {
            continue;
        }

        const score = expectimax(newBoard, depth, false);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
};
