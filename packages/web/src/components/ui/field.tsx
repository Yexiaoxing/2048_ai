import { Field as FieldPrimitive } from "@base-ui/react";
import type React from "react";
import { styled } from "styled-components";

const StyledLabel = styled(FieldPrimitive.Label)`
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  user-select: none;

  /* Required (asterisk) */
  &:has(~ input:required) {
    &::after {
      content: " *";
      color: var(--color-destructive);
    }
  }

  /* Disabled */
  &:has(~ input:disabled) {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
`;

const StyledField = styled(FieldPrimitive.Root)`
    display: flex;
    width: 100%;
    gap: calc(var(--spacing) * 3);

    /* Invalid */
    &[data-invalid="true"] {
        color: var(--color-destructive);
    }

    /* Orientation */
    &[data-orientation="vertical"] {
        flex-direction: column;

        & > * {
            width: 100%;
        }

        & > .sr-only {
            width: auto;
        }
    }

    &[data-orientation="horizontal"] {
        flex-direction: row;
        align-items: center;

        .field-description {
            text-wrap: balance;
        }

        & > [data-slot="field-label"] {
            flex: 1 1 auto;
        }

        &:has(> [data-slot="field-content"]) {
            align-items: flex-start;

            & > [data-slot="field-content"] {
                & > [role="radio"],
                & > [role="checkbox"] {
                    margin-block-start: 1px;
                }
            }
        }
    }

    &[data-orientation="responsive"] {
        flex-direction: column;

        & > * {
            width: 100%;
        }

        & > .sr-only {
            width: auto;
        }
    }

    &[data-disabled="true"] {
        .field-label,
        .field-title {
            opacity: 0.5;
        }
    }
`;

const StyledControl = styled(FieldPrimitive.Control)`
    display: flex;
    width: 100%;
    height: calc(var(--spacing) * 9);
    padding-inline: calc(var(--spacing) * 3);
    transition: all var(--default-transition-duration)
        var(--default-transition-timing-function);
    border: 1px solid var(--color-input);
    border-radius: var(--radius-md);
    outline: none;
    background-color: transparent;
    box-shadow: var(--shadow-xs);
    color: var(--color-foreground);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);

    /* Invalid */
    &[aria-invalid="true"] {
        border-color: var(--color-destructive);
    }

    /* Placeholder */
    &::placeholder {
        color: var(--color-muted-foreground);
    }

    /* Selection */
    &::selection {
        background-color: var(--color-primary);
        color: var(--color-primary-foreground);
    }

    /* Upload */
    &::file-selector-button {
        height: 100%;
        border: none;
        background-color: transparent;
        color: var(--color-foreground);
        font-size: var(--text-sm);
        font-weight: var(--font-weight-medium);
    }

    /* Disabled */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Focus */
    &:focus {
        &:not([aria-invalid="true"]) {
            border-color: var(--color-ring);
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-ring) 50%, transparent);
        }

        &[aria-invalid="true"] {
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-destructive) 20%, transparent);
        }
    }
`;

const StyledTextarea = styled(StyledControl).attrs({
    render: (props) => <textarea {...props} />,
})`
    display: flex;
    width: 100%;
    min-height: calc(var(--spacing) * 16);
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
    transition: box-shadow var(--default-transition-duration)
        var(--default-transition-timing-function);
    border: 1px solid var(--color-input);
    border-radius: var(--radius-md);
    outline: none;
    background-color: transparent;
    box-shadow: var(--shadow-xs);
    color: var(--color-foreground);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    resize: vertical;

    /* Invalid */
    &[aria-invalid="true"] {
        border-color: var(--color-destructive);
    }

    /* Placeholder */
    &::placeholder {
        color: var(--color-muted-foreground);
    }

    /* Selection */
    &::selection {
        background-color: var(--color-primary);
        color: var(--color-primary-foreground);
    }

    /* Disabled */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Focus */
    &:focus {
        &:not([aria-invalid="true"]) {
            border-color: var(--color-ring);
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-ring) 50%, transparent);
        }

        &[aria-invalid="true"] {
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-destructive) 20%, transparent);
        }
    }
`;

const StyledError = styled(FieldPrimitive.Error)`
    color: var(--color-destructive);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-normal);
    line-height: var(--text-sm--line-height);
`;

const StyledErrorDescription = styled(FieldPrimitive.Description)`
    color: var(--color-destructive);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-normal);
    line-height: var(--text-sm--line-height);
`;

const StyledDescription = styled(FieldPrimitive.Description)`
    color: var(--color-muted-foreground);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);

    &:last-child {
        margin-block-start: 0;
    }

    &:nth-last-child(2) {
        margin-block-start: calc(var(--spacing) * -1);
    }

    & > a {
        text-underline-offset: 4px;
        text-decoration: underline;

        &:hover {
            color: var(--color-primary);
        }
    }
`;

export const Field: React.FC<React.ComponentProps<typeof StyledField>> = ({ ...props }) => {
    return <StyledField {...props} />;
};

export const FieldLabel: React.FC<React.ComponentProps<typeof StyledLabel>> = ({ ...props }) => {
    return <StyledLabel {...props} />;
};

export const FieldControl: React.FC<
    React.ComponentProps<typeof StyledControl> & {
        multiline?: boolean;
    }
> = ({ ...props }) => {
    const Component = props.multiline ? StyledTextarea : StyledControl;

    return <Component {...props} />;
};

export const FieldError: React.FC<React.ComponentProps<typeof StyledError>> = ({ ...props }) => {
    return <StyledError {...props} />;
};

export const FieldDescription: React.FC<React.ComponentProps<typeof StyledDescription>> = ({
    ...props
}) => {
    return <StyledDescription {...props} />;
};

export const FieldItem = FieldPrimitive.Item;

export const FieldErrorDescription = StyledErrorDescription;
