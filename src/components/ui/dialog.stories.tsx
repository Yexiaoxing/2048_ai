import type { Meta, StoryObj } from "@storybook/react-vite";
import type React from "react";
import { Button } from "./button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";

interface DialogStoryProps {
    title: string;
    description: string;
    triggerLabel: string;
}

const Template: React.FC<DialogStoryProps> = ({ title, description, triggerLabel, ...props }) => (
    <Dialog {...props}>
        <DialogTrigger>
            <Button variant="outline" size="md">
                {triggerLabel}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div>
                This dialog uses the shared UI primitives and can be closed with the button below or
                the close icon.
            </div>
            <DialogFooter>
                <DialogClose>
                    <Button variant="secondary" size="md">
                        Close
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const meta = {
    title: "UI/Dialog",
    component: Template,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => <Template {...args} />,
    args: {
        title: "Dialog Title",
        description: "A short description of the dialog content.",
        triggerLabel: "Open dialog",
    },
};
