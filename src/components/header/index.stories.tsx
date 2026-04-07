import type { Meta, StoryObj } from "@storybook/react-vite";

import { Header } from "./index";

const meta = {
    title: "Components/Header",
    component: Header,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],

    decorators: [
        (Story) => (
            <div
                style={{
                    width: "400px",
                }}
            >
                {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        score: 2048,
        moves: 32,
    },
};
