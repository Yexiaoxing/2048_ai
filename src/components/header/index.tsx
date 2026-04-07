import { ScoreView } from "../ui/score-view";
import { GameHeader, ScoreContainer, StyledHeader } from "./index.styles";

interface IHeaderProps {
    score: number;
    moves: number;
}

export const Header: React.FC<IHeaderProps> = ({ score, moves }) => {
    return (
        <StyledHeader>
            <GameHeader>2048</GameHeader>
            <ScoreContainer>
                <ScoreView label="Score" value={score} />
                <ScoreView label="Moves" value={moves} />
            </ScoreContainer>
        </StyledHeader>
    );
};
