import styled from "styled-components";
import { Game } from "./components/game";
import { enableConsoleLogger } from "@2048/logger";
import { ObstacleTileProvider } from "./contexts/obstacle-tile-context";

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
        <ObstacleTileProvider>
            <StyledApp>
                <Game />
            </StyledApp>
        </ObstacleTileProvider>
    );
}

export default App;
