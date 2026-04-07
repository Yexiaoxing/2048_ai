import { Button as ButtonPrimitive } from "@base-ui/react/button";
import styled from "styled-components";

const StyledButton = styled(ButtonPrimitive)`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--default-transition-duration)
        var(--default-transition-timing-function);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    outline: none;
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    line-height: var(--text-sm--line-height);
    gap: calc(var(--spacing) * 2);

    /* Variant */
    &[data-variant="primary"] {
        background-color: var(--color-foreground);
        color: var(--color-background);

        &:hover {
            background-color: color-mix(
                in oklab,
                var(--color-primary) 90%,
                transparent
            );
        }
    }

    &[data-variant="secondary"] {
        background-color: var(--color-secondary);
        color: var(--color-secondary-foreground);

        &:hover {
            background-color: color-mix(
                in oklab,
                var(--color-secondary) 80%,
                transparent
            );
        }
    }

    &[data-variant="outline"] {
        border-color: var(--color-input);
        background-color: var(--color-background);
        box-shadow: var(--shadow-xs);
        color: var(--color-secondary-foreground);

        &:hover {
            background-color: var(--color-accent);
            color: var(--color-accent-foreground);
        }
    }

    &[data-variant="ghost"] {
        background-color: transparent;
        color: var(--color-secondary-foreground);

        &:hover {
            background-color: var(--color-accent);
            color: var(--color-accent-foreground);
        }
    }

    &[data-variant="destructive"] {
        background-color: var(--color-destructive);
        color: var(--color-white);

        &:hover {
            background-color: color-mix(
                in oklab,
                var(--color-destructive) 90%,
                transparent
            );
        }
    }

    &[data-variant="success"] {
        background-color: var(--color-success);
        color: var(--color-white);

        &:hover {
            background-color: color-mix(
                in oklab,
                var(--color-success) 90%,
                transparent
            );
        }
    }

    &[data-variant="link"] {
        background-color: transparent;
        color: var(--color-secondary-foreground);
        text-decoration: none;
        text-underline-offset: 4px;

        &:hover {
            text-decoration: underline;
        }
    }

    /* Size */
    &[data-size="sm"] {
        height: calc(var(--spacing) * 8);
        padding-inline: calc(var(--spacing) * 3);
        border-radius: var(--radius-sm);
        gap: calc(var(--spacing) * 1.5);

        &:has(> svg) {
            padding-inline: calc(var(--spacing) * 2.5);
        }
    }

    &[data-size="md"] {
        height: calc(var(--spacing) * 9);
        padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);

        &:has(> svg) {
            padding-inline: calc(var(--spacing) * 3);
        }
    }

    &[data-size="lg"] {
        height: calc(var(--spacing) * 10);
        padding-inline: calc(var(--spacing) * 6);

        &:has(> svg) {
            padding-inline: calc(var(--spacing) * 4);
        }
    }

    &[data-size="icon"] {
        width: calc(var(--spacing) * 9);
        height: calc(var(--spacing) * 9);
    }

    &[data-size="icon-sm"] {
        width: calc(var(--spacing) * 8);
        height: calc(var(--spacing) * 8);
    }

    &[data-size="icon-lg"] {
        width: calc(var(--spacing) * 10);
        height: calc(var(--spacing) * 10);
    }

    /* Icon */
    & > svg {
        flex-shrink: 0;
        width: calc(var(--spacing) * 4);
        height: calc(var(--spacing) * 4);
        pointer-events: none;
    }

    /* Active */
    &:active {
        scale: 0.98;
    }

    /* Disabled */
    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    /* Focus */
    &:focus-visible {
        &:not(&[data-variant="destructive"]) {
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-ring) 50%, transparent);
        }

        &[data-variant="destructive"] {
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-destructive) 20%, transparent);
        }

        &[data-variant="success"] {
            box-shadow: 0 0 0 3px
                color-mix(in oklab, var(--color-success) 20%, transparent);
        }

        &[data-variant="outline"] {
            border-color: var(--color-ring);
        }
    }
`;

type ButtonProps = React.ComponentProps<typeof StyledButton> & {
    variant?:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "destructive"
        | "success"
        | "link";
    size?: "sm" | "md" | "lg" | "icon" | "icon-sm" | "icon-lg";
};

export function Button({
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    return <StyledButton data-size={size} data-variant={variant} {...props} />;
}
