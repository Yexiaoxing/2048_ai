# 2048 with AI

This project is a web-based implementation of the popular game 2048, enhanced with an AI suggestion feature to help players make optimal moves.

## Building the Game

1. Install Devenv and Nix, then run `devenv shell` to enter the development environment.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm run dev` to start the development server and open the game in your browser.

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
