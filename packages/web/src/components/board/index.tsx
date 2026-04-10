import type { Board as BoardType } from "@2048/game-logic";
import { Cell } from "../cell";
import { StyledBoard } from "./index.styles";

interface IBoardProps {
    board: BoardType;
}

export const Board: React.FC<IBoardProps> = ({ board }) => {
    return (
        <StyledBoard>
            {board.map((row, rowIndex) =>
                row.map((cellValue, cellIndex) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Only available key
                    <Cell key={rowIndex * 4 + cellIndex} value={cellValue} />
                )),
            )}
        </StyledBoard>
    );
};
