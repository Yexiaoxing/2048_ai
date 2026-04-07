import type { Meta, StoryObj } from "@storybook/react-vite";

import { Controls } from "./index";

const meta = {
    title: "Components/Controls",
    component: Controls,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onMove: () => undefined,
    },
    render: (args) => (
        <Controls
            {...args}
            onMove={(direction) => {
                // eslint-disable-next-line no-console
                console.log("Move:", direction);
            }}
        />
    ),
};
