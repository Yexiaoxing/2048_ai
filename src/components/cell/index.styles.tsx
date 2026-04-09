import styled from "styled-components";
import { CellColors, CellFontSizes, CellTextColors } from "./consts";

export const StyledCell = styled.div<{ $value: number }>`
    background-color: ${(props) => CellColors[props.$value] ?? CellColors[2048]};
    color: ${(props) => CellTextColors[props.$value] ?? CellTextColors[2048]};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${(props) => CellFontSizes[props.$value] ?? CellFontSizes[2048]};
    font-weight: 700;
    border-radius: 4px;

    transition: background-color 0.15s ease, color 0.15s ease-in-out;
`;
