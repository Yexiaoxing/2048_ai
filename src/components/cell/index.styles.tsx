import styled from "styled-components";
import { CellColors, CellTextColors } from "./colors";

export const StyledCell = styled.div<{ $value: number }>`
    background-color: ${(props) =>
        props.$value ? CellColors[props.$value] : "#cdc1b4"};
    color: ${(props) =>
        props.$value ? CellTextColors[props.$value] : "transparent"};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    font-weight: 700;
    border-radius: 4px;

    transition: all 0.15s ease-in-out;
`;
