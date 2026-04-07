import styled from "styled-components";
import { Game } from "./components/game";

const StyledApp = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function App() {
    return (
        <StyledApp>
            <Game />
        </StyledApp>
    );
}

export default App;
