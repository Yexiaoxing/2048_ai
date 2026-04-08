import styled from "styled-components";

export const GameContainer = styled.div`
    max-width: 400px;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: 16px;
`;

export const BoardContainer = styled.div`
    width: 400px;
    height: 400px;
`;

export const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
    column-gap: 10px;
`;

export const StretchedRow = styled(RowContainer)`
    flex-direction: column;
    justify-content: stretch;
`;

export const StatusRow = styled(RowContainer)`
    justify-content: center;
    align-items: center;
`;

export const AiActionRow = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 5fr 3fr;
    column-gap: 8px;
`;

export const AiSuggestionRow = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    background-color: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: var(--border-radius);
    padding: 12px;
    text-align: center;
    margin-top: 10px;
`;

export const AiSuggestedMove = styled.span`
    font-size: 18px;
    color: #ff6b6b;
    display: block;
    margin: 5px 0;
`;

export const AiSuggestionErrorRow = styled(AiSuggestionRow)`
    background-color: var(--color-destructive);
    color: var(--color-white);
`;

export const AiSuggestionReasonContainer = styled.div`
    display: flex;

    text-align: left;
`;

export const AiSuggestionReasonPre = styled.pre`
    white-space: pre-wrap;
`;
