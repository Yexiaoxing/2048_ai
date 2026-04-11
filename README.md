# 2048 with AI

This project is a web-based implementation of the popular game 2048, enhanced with an AI suggestion feature to help players make optimal moves.

> *Disclaimer: This project is for educational and entertainment purposes only. The AI prompt engineering and model integration are basic and may not always yield optimal suggestions. Use at your own discretion.*

## Monorepo Layout

- packages/web: React + Vite web app.
- packages/evaluation-cli: CLI evaluator for running model-based game evaluations.
- packages/game-logic: Shared game logic, game status/types, and AI integration utilities.

## Building the Game

1. Install Devenv and Nix, then run `devenv shell` to enter the development environment.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm run dev` to start the web app from `packages/web`.

## Common Commands

- `pnpm run dev`: Run the web app.
- `pnpm run build`: Build all workspace packages that expose a build script.
- `pnpm run test`: Run all workspace package tests.
- `pnpm --filter @2048/web storybook`: Run Storybook for the web package.

## Shared Package Scripts

From the repo root:

- `pnpm --filter @2048/game-logic run typecheck`: Typecheck the shared package.
- `pnpm --filter @2048/game-logic run build`: Generate declaration output in `packages/game-logic/dist`.
- `pnpm --filter @2048/game-logic run test`: Run shared package tests.

## Infrastructure

Frontend:

- React 19
- TypeScript 6
- Vite
- styled-components
- Component styles from <https://shadcn-css.com/>

Development Tools:

- Devenv (<https://devenv.sh/>)
- Nix
- Biome
- Husky
- Lint-staged

## Use Ollama and Configure CORS

To use the AI suggestion feature, you need to have Ollama installed and running on your machine. Follow the instructions on the [Ollama website](https://ollama.com/) to set it up.

If you want to use ollama in a production environment, make sure you configure the Ollama to allow origin. Check the [Ollama documentation](https://docs.ollama.com/faq#how-can-i-allow-additional-web-origins-to-access-ollama) for more details on how to do this.

## Evaluations

This project contains tools and scripts for evaluating the performance of LLM agents in playing the 2048 game. Two different evaluation modes are provided:

1. Full game evaluation with TUI visualization support (`evaluation-full-game-cli`).

   This mode allows you to run multiple games of 2048 with your LLM agent and visualize the game progress in the terminal. It also saves detailed results and step traces for analysis.

   Metrics:
   1. Steps used to reach 2048 tile (if achieved).
   2. Final score.
   3. Maximum tile achieved.
   4. Whether the 2048 tile was achieved.
2. Single move evaluation (`evaluation-single-move-cli`).

   This mode evaluates the LLM agent's ability to suggest the best move for a given board state. A dataset of board states with known optimal moves is used for evaluation.

   Note: The dataset is generated using a Alpha-Beta pruning algorithm and may not be perfect. It serves as a reference for evaluating the LLM agent's move suggestions.

## Full Game Evaluation with TUI Visualization

To run the full game evaluation with TUI visualization, check the README [here](../packages/evaluation-full-game-cli/README.md) for detailed instructions and examples.

## Single Move Evaluation

To run the single move evaluation, check the README [here](../packages/evaluation-single-move-cli/README.md) for detailed instructions and examples.
