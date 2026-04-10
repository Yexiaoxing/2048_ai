import { RadioGroup as RadioGroupPrimitive, Radio as RadioPrimitive } from "@base-ui/react";

import { styled } from "styled-components";

const StyledRadioGroup = styled(RadioGroupPrimitive)`
    display: grid;
    gap: calc(var(--spacing) * 3);
`;

const StyledRadioContainer = styled.div`
    display: flex;
    flex-direction: row;
    column-gap: 8px;
`;

const StyledRadio = styled(RadioPrimitive.Root)`
    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;
    width: calc(var(--spacing) * 4);
    height: calc(var(--spacing) * 4);
    transition: color var(--default-transition-duration)
        var(--default-transition-timing-function);
    border: 1px solid var(--color-input);
    border-radius: var(--radius-rounded);
    outline: none;
    background-color: transparent;
    box-shadow: var(--shadow-xs);
    color: var(--color-primary);
    aspect-ratio: 1 / 1;

    /* Invalid */
    &[aria-invalid="true"] {
        border-color: var(--color-destructive);
        color: var(--color-destructive);
    }

    /* Focus */
    &:focus-visible {
        border-color: var(--color-ring);
        box-shadow: 0 0 0 3px
            color-mix(in oklab, var(--color-ring) 50%, transparent);

        &[aria-invalid="true"] {
            border-color: var(--color-destructive);
            box-shadow: 0 0 0 2px
                color-mix(in oklab, var(--color-destructive) 20%, transparent);
        }
    }

    /* Disabled */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

const StyledRadioIndicator = styled(RadioPrimitive.Indicator)`
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;

    &[data-unchecked] {
        display: none;
    }

    &::before {
        content: " ";
        border-radius: 100%;
        width: 0.5rem;
        height: 0.5rem;
        background-color: var(--color-primary);
    }
`;

export const RadioGroup = StyledRadioGroup;

export const RadioContainer = StyledRadioContainer;

export const Radio = ({ ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) => {
    return (
        <StyledRadio {...props}>
            <StyledRadioIndicator></StyledRadioIndicator>
        </StyledRadio>
    );
};
