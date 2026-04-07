import { styled } from "styled-components";
import { Button } from "../ui/button";

// |    |Up |    |
// |Left|Down|Right|
export const StyledControlsContainer = styled.div`
    display: grid;

    grid-template-areas: "left up right" "left down right";
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);

    gap: 4px;
`;

export const UpControl = styled(Button).attrs({ variant: "secondary" })`
    grid-area: up;
    height: unset !important;
`;
export const DownControl = styled(Button).attrs({ variant: "secondary" })`
    grid-area: down;
    height: unset !important;
`;
export const LeftControl = styled(Button).attrs({ variant: "secondary" })`
    grid-area: left;
    height: unset !important;
`;
export const RightControl = styled(Button).attrs({ variant: "secondary" })`
    grid-area: right;
    height: unset !important;
`;
