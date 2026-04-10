const possibleValues = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

export const generateGameState = () => {
    const gameState: number[][] = [];
    for (let j = 0; j < 4; j++) {
        const row: number[] = [];
        for (let k = 0; k < 4; k++) {
            row.push(possibleValues[Math.floor(Math.random() * possibleValues.length)]);
        }
        gameState.push(row);
    }

    return gameState;
};
