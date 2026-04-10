import { StyledCell } from "./index.styles";

interface ICellProps {
    value: number;
}

export const Cell: React.FC<ICellProps> = ({ value }) => {
    return <StyledCell $value={value}>{value > 0 ? value : ""}</StyledCell>;
};
