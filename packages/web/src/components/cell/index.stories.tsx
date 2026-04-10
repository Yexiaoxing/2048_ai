import type { Meta, StoryObj } from "@storybook/react-vite";

import { Cell } from "./index";

const meta = {
    title: "Components/Cell",
    component: Cell,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Cell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
    args: {
        value: 0,
    },
};

export const NumberTile: Story = {
    args: {
        value: 128,
    },
};
