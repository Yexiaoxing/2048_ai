# AI Evaluation

This directory contains tools and scripts for evaluating the performance of LLM agents in playing the 2048 game. Two different evaluation modes are provided:

1. Full game evaluation with TUI visualization support (`evaluation-cli`).

   This mode allows you to run multiple games of 2048 with your LLM agent and visualize the game progress in the terminal. It also saves detailed results and step traces for analysis.

   Metrics:
   1. Steps used to reach 2048 tile (if achieved).
   2. Final score.
   3. Maximum tile achieved.
   4. Whether the 2048 tile was achieved.
2. Single move evaluation (`single-move-evaluation`).

   This mode evaluates the LLM agent's ability to suggest the best move for a given board state. A dataset of board states with known optimal moves is used for evaluation.

   Note: The dataset is generated using a Alpha-Beta pruning algorithm and may not be perfect. It serves as a reference for evaluating the LLM agent's move suggestions.

## Full Game Evaluation with TUI Visualization

To run the full game evaluation with TUI visualization, check the README [here](../packages/evaluation-full-game-cli/README.md) for detailed instructions and examples.

## Single Move Evaluation

To run the single move evaluation, check the README [here](../packages/evaluation-single-move-cli/README.md) for detailed instructions and examples.
