import styled from "styled-components";

const StyledScoreView = styled.div`
    color: #ffffff;
    background-color: #8c7063;

    border-radius: 4px;
    padding: 10px 20px;

    display: flex;
    flex-direction: column;

    row-gap: 4px;
`;

const StyledScoreLabel = styled.span`
    display: block;
    font-size: 14px;
`;

const StyledScoreValue = styled.span`
    display: block;
    font-size: 18px;
`;

interface IScoreViewProps {
    label: string;
    value: number;
}

export const ScoreView: React.FC<IScoreViewProps> = ({ label, value }) => {
    return (
        <StyledScoreView>
            <StyledScoreLabel>{label}</StyledScoreLabel>
            <StyledScoreValue>{value}</StyledScoreValue>
        </StyledScoreView>
    );
};
