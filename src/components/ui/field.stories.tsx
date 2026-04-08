import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "./field";

const meta = {
    title: "UI/Field",
    component: Field,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
    render: () => (
        <Field data-orientation="vertical" style={{ maxWidth: "400px" }}>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldControl id="name" type="text" placeholder="Enter your name" />
        </Field>
    ),
};

export const WithDescription: Story = {
    render: () => (
        <Field data-orientation="vertical" style={{ maxWidth: "400px" }}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldControl id="email" type="email" placeholder="user@example.com" />
            <FieldDescription>We'll never share your email with anyone else.</FieldDescription>
        </Field>
    ),
};

export const WithError: Story = {
    render: () => (
        <Field data-orientation="vertical" data-invalid="true" style={{ maxWidth: "400px" }}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldControl
                id="password"
                type="password"
                placeholder="Enter password"
                aria-invalid="true"
            />
            <FieldError>Password must be at least 8 characters.</FieldError>
        </Field>
    ),
};

export const Disabled: Story = {
    render: () => (
        <Field data-orientation="vertical" data-disabled="true" style={{ maxWidth: "400px" }}>
            <FieldLabel htmlFor="disabled-field">Disabled Field</FieldLabel>
            <FieldControl
                id="disabled-field"
                type="text"
                placeholder="This field is disabled"
                disabled
            />
        </Field>
    ),
};

export const Required: Story = {
    render: () => (
        <Field data-orientation="vertical" style={{ maxWidth: "400px" }}>
            <FieldLabel htmlFor="required-field">Required Field</FieldLabel>
            <FieldControl
                id="required-field"
                type="text"
                placeholder="This field is required"
                required
            />
        </Field>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <Field data-orientation="horizontal" style={{ minWidth: "500px" }}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <FieldControl id="username" type="text" placeholder="Enter username" />
        </Field>
    ),
};

export const CompleteForm: Story = {
    render: () => (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: "400px",
            }}
        >
            <Field data-orientation="vertical">
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <FieldControl id="name" type="text" placeholder="John Doe" />
                <FieldDescription>
                    Your full name as it appears on official documents.
                </FieldDescription>
            </Field>

            <Field data-orientation="vertical">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldControl id="email" type="email" placeholder="john@example.com" />
            </Field>

            <Field data-orientation="vertical">
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <FieldControl
                    id="bio"
                    multiline={true}
                    placeholder="Tell us about yourself"
                    style={{ height: "100px" }}
                />
                <FieldDescription>Maximum 500 characters.</FieldDescription>
            </Field>
        </div>
    ),
};
