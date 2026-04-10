import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Board } from "@2048/game-logic";

import { DebugBoardOverride } from "./index";

const initialBoard: Board = [
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 0, 0],
    [0, 0, 0, 0],
];

const StoryHarness = ({ initiallyOpen = false }: { initiallyOpen?: boolean }) => {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [isDebugMode, setIsDebugMode] = useState(initiallyOpen);

    return (
        <DebugBoardOverride
            board={board}
            onOverride={setBoard}
            isDebugMode={isDebugMode}
            onToggleDebugMode={() => setIsDebugMode((prev) => !prev)}
        />
    );
};

const meta = {
    title: "Components/DebugBoardOverride",
    component: StoryHarness,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof StoryHarness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClosedByDefault: Story = {
    args: {
        initiallyOpen: false,
    },
};

export const OpenByDefault: Story = {
    args: {
        initiallyOpen: true,
    },
};
