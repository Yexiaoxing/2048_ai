export enum Direction {
    Up,
    Down,
    Left,
    Right,
}

export enum GameStatus {
    "playing-more-2048",
    playing,
    won,
    lost,
}

export type Board = number[][];

// Coordinates in the format [row, col]
export type Coordinates = [number, number];
