import { styled } from "styled-components";

export const Select = styled.select`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: fit-content;
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 3);
    transition-property: color, box-shadow;
    transition-duration: var(--default-transition-duration);
    transition-timing-function: var(--default-transition-timing-function);
    border: 1px solid var(--color-input);
    border-radius: var(--radius-sm);
    outline: none;
    background-color: transparent;
    box-shadow: var(--shadow-xs);
    color: var(--color-primary);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    white-space: nowrap;
    gap: calc(var(--spacing) * 2);

    /* Focus */
    &:focus {
        border-color: var(--color-ring);
        box-shadow: 0 0 0 3px
            color-mix(in oklab, var(--color-ring) 50%, transparent);
    }

    /* Disabled */
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &::picker-icon {
        content: "+";
        font-size: 1.3rem;
    }

    appearance: base-select;
`;
