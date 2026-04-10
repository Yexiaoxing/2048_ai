# 2048 with AI

This project is a web-based implementation of the popular game 2048, enhanced with an AI suggestion feature to help players make optimal moves.

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

AI Model:

- TODO

## Use Ollama and Configure CORS

To use the AI suggestion feature, you need to have Ollama installed and running on your machine. Follow the instructions on the [Ollama website](https://ollama.com/) to set it up.

If you want to use ollama in a production environment, make sure you configure the Ollama to allow origin. Check the [Ollama documentation](https://docs.ollama.com/faq#how-can-i-allow-additional-web-origins-to-access-ollama) for more details on how to do this.

## Evaluations

Please refer to the [evaluation README](evaluation/README.md) for details on how to do evaluation.
