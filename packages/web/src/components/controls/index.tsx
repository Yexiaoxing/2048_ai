import { Direction } from "@2048/game-logic";
import {
    DownControl,
    LeftControl,
    RightControl,
    StyledControlsContainer,
    UpControl,
} from "./index.styles";

interface IGameControlsProps {
    onMove: (direction: Direction) => void;
}

export const Controls: React.FC<IGameControlsProps> = ({ onMove }) => {
    return (
        <StyledControlsContainer>
            <LeftControl onClick={() => onMove(Direction.Left)}>Left</LeftControl>
            <UpControl onClick={() => onMove(Direction.Up)}>Up</UpControl>
            <DownControl onClick={() => onMove(Direction.Down)}>Down</DownControl>
            <RightControl onClick={() => onMove(Direction.Right)}>Right</RightControl>
        </StyledControlsContainer>
    );
};
