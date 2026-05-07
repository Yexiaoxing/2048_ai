import { useMemo } from "react";
import { StyledCell } from "./index.styles";
import { OBSTACLE_TILE } from "@2048/game-logic";

interface ICellProps {
    value: number;
}

export const Cell: React.FC<ICellProps> = ({ value }) => {
    const text = useMemo(() => {
        if (value === 0) {
            return "";
        }

        if (value === OBSTACLE_TILE) {
            return "X";
        }

        return value.toString();
    }, [value]);

    return <StyledCell $value={value}>{text}</StyledCell>;
};
