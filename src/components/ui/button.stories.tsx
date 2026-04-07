import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";

const meta = {
    title: "UI/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: "Primary",
        variant: "primary",
        size: "md",
    },
};

export const Secondary: Story = {
    args: {
        children: "Secondary",
        variant: "secondary",
        size: "md",
    },
};

export const Outline: Story = {
    args: {
        children: "Outline",
        variant: "outline",
        size: "md",
    },
};

export const Ghost: Story = {
    args: {
        children: "Ghost",
        variant: "ghost",
        size: "md",
    },
};

export const Destructive: Story = {
    args: {
        children: "Delete",
        variant: "destructive",
        size: "md",
    },
};

export const Success: Story = {
    args: {
        children: "Success",
        variant: "success",
        size: "md",
    },
};

export const Link: Story = {
    args: {
        children: "Learn more",
        variant: "link",
        size: "md",
    },
};
