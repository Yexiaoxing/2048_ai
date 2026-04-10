import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Radio, RadioContainer, RadioGroup } from "./radio";

const DefaultExample = () => {
    const [value, setValue] = useState("easy");

    return (
        <RadioGroup value={value} onValueChange={(newValue) => setValue(String(newValue))}>
            <RadioContainer>
                <Radio value="easy" />
                <span>Easy</span>
            </RadioContainer>
            <RadioContainer>
                <Radio value="medium" />
                <span>Medium</span>
            </RadioContainer>
            <RadioContainer>
                <Radio value="hard" />
                <span>Hard</span>
            </RadioContainer>
        </RadioGroup>
    );
};

const DisabledExample = () => {
    const [value, setValue] = useState("easy");

    return (
        <RadioGroup value={value} onValueChange={(newValue) => setValue(String(newValue))}>
            <RadioContainer>
                <Radio value="easy" />
                <span>Easy</span>
            </RadioContainer>
            <RadioContainer>
                <Radio value="medium" disabled />
                <span>Medium (disabled)</span>
            </RadioContainer>
            <RadioContainer>
                <Radio value="hard" />
                <span>Hard</span>
            </RadioContainer>
        </RadioGroup>
    );
};

const meta = {
    title: "UI/Radio",
    component: DefaultExample,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof DefaultExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => <DefaultExample />,
};

export const Disabled: Story = {
    render: () => <DisabledExample />,
};
