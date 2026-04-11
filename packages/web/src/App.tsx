import styled from "styled-components";
import { Game } from "./components/game";
import { enableConsoleLogger } from "@2048/logger";

const StyledApp = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

enableConsoleLogger();

function App() {
    return (
        <StyledApp>
            <Game />
        </StyledApp>
    );
}

export default App;
