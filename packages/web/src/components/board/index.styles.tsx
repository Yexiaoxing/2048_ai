import styled from "styled-components";

export const StyledBoard = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 10px;
    background-color: var(--grid-background-color);
    padding: 10px;
    border-radius: 5px;

    padding: 10px;
    background-color: #bbada0;

    width: 100%;
    height: 100%;
`;
