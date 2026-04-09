import styled from "styled-components";
import { Button } from "../ui/button";

export const DebugPanelContainer = styled.div`
    width: 100%;
    padding: 16px;
    background-color: var(--color-neutral-50);
    border: 2px solid var(--color-red-500);
    border-radius: 8px;
    margin: 12px 0;
`;

export const DebugPanelTitle = styled.h3`
    margin: 0 0 12px 0;
    color: var(--color-red-500);
    font-weight: bold;
    font-size: 14px;
`;

export const BoardInputContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 12px;
`;

export const CellInput = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid var(--color-neutral-200);
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    font-weight: bold;

    &:focus {
        outline: none;
        border-color: var(--color-red-300);
        box-shadow: 0 0 0 2px var(--color-red-50);
    }
`;

export const DebugButtonContainer = styled.div`
    display: flex;
    gap: 8px;
    justify-content: center;
`;

export const DebugButton = styled(Button).attrs({ variant: "destructive" })``;

export const DebugToggleButton = styled(Button).attrs({ variant: "outline" })``;

export const DebugHintText = styled.p`
    font-size: 11px;
    color: var(--color-muted-foreground);;
    margin: 8px 0;
    text-align: center;
`;

export const ErrorMessage = styled.div`
    padding: 8px 12px;
    background-color: var(--color-red-50);
    border: 1px solid var(--color-red-500);
    border-radius: 4px;
    color: var(--color-red-700);
    font-size: 12px;
    margin-bottom: 12px;
`;
