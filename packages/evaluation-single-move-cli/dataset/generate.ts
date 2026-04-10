// generate.ts - Entry point for generating game states for evaluation

import fs from "node:fs";
import path from "node:path";
import cliProgress from "cli-progress";
import { getMinimaxSuggestion } from "./generators/best-move";
import { generateGameState } from "./generators/game-state";

const OUTPUT_DIR = path.join(__dirname, "output");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const main = () => {
    const filePath = path.join(OUTPUT_DIR, "game_states.json");
    const totalStates = 2048;

    // Initialize progress bar
    const progressBar = new cliProgress.SingleBar({
        format: "Progress |{bar}| {percentage}% || {value}/{total} states",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        hideCursor: true,
    });

    progressBar.start(totalStates, 0);

    const gameStates = Array.from({ length: totalStates }, () => {
        const board = generateGameState();
        const bestMoveExpectimax = getMinimaxSuggestion(board, 5);
        progressBar.increment();

        return {
            board,
            bestMoveExpectimax,
        };
    });

    progressBar.stop();
    fs.writeFileSync(filePath, JSON.stringify(gameStates, null, 2));

    console.log(`\nGenerated ${gameStates.length} game states in ${OUTPUT_DIR}`);
};

main();
