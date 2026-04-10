import type { Meta, StoryObj } from "@storybook/react-vite";

import { Board } from "./index";

const meta = {
    title: "Components/Board",
    component: Board,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        board: [
            [1024, 512, 128, 64],
            [2048, 2, 256, 32],
            [0, 0, 4, 16],
            [0, 0, 0, 8],
        ],
    },
};
