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
