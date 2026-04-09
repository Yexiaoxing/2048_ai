import type { Meta, StoryObj } from "@storybook/react-vite";

import { AiSettingsDialog } from "./index";

const meta = {
    title: "Components/AiSettingsDialog",
    component: AiSettingsDialog,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof AiSettingsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
