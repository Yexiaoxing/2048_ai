import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select";

const meta = {
    title: "UI/Select",
    component: Select,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Select defaultValue="option-1">
            <option value="option-1">Option 1</option>
            <option value="option-2">Option 2</option>
            <option value="option-3">Option 3</option>
        </Select>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Select defaultValue="option-1" disabled>
            <option value="option-1">Option 1</option>
            <option value="option-2">Option 2</option>
            <option value="option-3">Option 3</option>
        </Select>
    ),
};
