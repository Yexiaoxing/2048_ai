import type { Board as BoardType } from "../../shared/game-types";
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
                    <Cell key={rowIndex * 4 + cellIndex} value={cellValue} />
                )),
            )}
        </StyledBoard>
    );
};
