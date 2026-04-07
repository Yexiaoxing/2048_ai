import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScoreView } from "./score-view";

const meta = {
    title: "UI/ScoreView",
    component: ScoreView,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ScoreView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Score: Story = {
    args: {
        label: "Score",
        value: 1024,
    },
};

export const Moves: Story = {
    args: {
        label: "Moves",
        value: 15,
    },
};
