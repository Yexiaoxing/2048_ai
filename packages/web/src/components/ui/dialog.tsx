import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type { ComponentProps, ReactElement } from "react";
import { styled } from "styled-components";

const StyledDialogOverlay = styled(DialogPrimitive.Backdrop)`
    position: fixed;
    z-index: 50;
    animation-duration: var(--default-transition-duration);
    animation-timing-function: var(--ease-out);
    background-color: rgb(0 0 0 / 50%);
    inset: 0;

    @supports (-webkit-touch-callout: none) {
        position: absolute;
    }

    /* State */
    &[data-state="open"] {
        animation-name: var(--animate-in);
    }

    &[data-state="closed"] {
        animation-name: var(--animate-out);
    }
`;

const StyledDialogContent = styled(DialogPrimitive.Popup)`
    display: grid;
    position: fixed;
    z-index: 50;
    left: 50%;
    width: 100%;
    max-width: calc(100% - 2rem);
    padding: calc(var(--spacing) * 6);
    transform: translate(-50%, -50%);
    transition: all var(--default-transition-duration)
        var(--default-transition-timing-function);
    animation-duration: var(--default-transition-duration);
    animation-timing-function: var(--ease-out);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background-color: var(--color-background);
    box-shadow: var(--shadow-lg);
    inset-block-start: 50%;
    gap: calc(var(--spacing) * 4);

    /* State */
    &[data-state="open"] {
        animation-name: var(--animate-fade-zoom-in);
    }

    &[data-state="closed"] {
        animation-name: var(--animate-fade-zoom-out);
    }

    @media (width >= 640px) {
        max-width: 32rem;
    }
`;

const StyledDialogClose = styled(DialogPrimitive.Close)`
    position: absolute;
    border: none;
    border-radius: var(--radius-xs);
    outline: none;
    opacity: 0.7;
    background-color: transparent;
    color: inherit;
    inset-inline-end: calc(var(--spacing) * 4);
    inset-block-start: calc(var(--spacing) * 4);

    /* State */
    &[data-state="open"] {
        background-color: var(--color-accent);
        color: var(--color-muted-foreground);
    }

    /* Icon */
    & > svg {
        flex-shrink: 0;
        width: calc(var(--spacing) * 4);
        height: calc(var(--spacing) * 4);
        pointer-events: none;
    }

    /* Hover */
    &:hover {
        opacity: 1;
    }

    /* Focus */
    &:focus {
        box-shadow: 0 0 0 2px var(--color-ring);
    }

    /* Disabled */
    &:disabled {
        opacity: 0.7;
        pointer-events: none;
    }
`;

const StyledDialogHeader = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: calc(var(--spacing) * 2);

    @media (width >= 640px) {
        text-align: start;
    }
`;

const StyledDialogFooter = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: calc(var(--spacing) * 2);

    @media (width >= 640px) {
        flex-direction: row;
        justify-content: end;
    }
`;

const StyledDialogTitle = styled(DialogPrimitive.Title)`
    font-size: var(--text-lg);
    font-weight: var(--font-weight-semibold);
    line-height: var(--text-lg--line-height);
`;

const StyledDialogDescription = styled(DialogPrimitive.Description)`
    color: var(--color-muted-foreground);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
`;

export const Dialog = ({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) => {
    return <DialogPrimitive.Root {...props} />;
};

export const DialogTrigger = ({
    children,
    ...props
}: ComponentProps<typeof DialogPrimitive.Trigger> & {
    children?: ReactElement;
}) => {
    return <DialogPrimitive.Trigger {...props} render={children} />;
};

export const DialogPortal = ({ ...props }: ComponentProps<typeof DialogPrimitive.Portal>) => {
    return <DialogPrimitive.Portal {...props} />;
};

export const DialogClose = ({
    children,
    ...props
}: ComponentProps<typeof DialogPrimitive.Close> & {
    children?: ReactElement;
}) => {
    return <StyledDialogClose {...props} render={children} />;
};

export const DialogOverlay = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Backdrop>) => {
    return <StyledDialogOverlay {...props} />;
};

export const DialogContent = ({
    className,
    children,
    ...props
}: ComponentProps<typeof DialogPrimitive.Popup>) => {
    return (
        <DialogPortal>
            <DialogOverlay />
            <StyledDialogContent {...props}>{children}</StyledDialogContent>
        </DialogPortal>
    );
};

export const DialogHeader = ({ className, ...props }: ComponentProps<"div">) => {
    return <StyledDialogHeader {...props} />;
};

export const DialogFooter = ({ className, ...props }: ComponentProps<"div">) => {
    return <StyledDialogFooter {...props} />;
};

export const DialogTitle = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => {
    return <StyledDialogTitle {...props} />;
};

export const DialogDescription = ({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => {
    return <StyledDialogDescription {...props} />;
};
