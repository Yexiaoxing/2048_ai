import type { Meta, StoryObj } from "@storybook/react-vite";

import { Game } from "./index";

const meta = {
    title: "Components/Game",
    component: Game,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Game>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
