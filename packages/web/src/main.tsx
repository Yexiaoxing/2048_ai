import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GlobalStyle } from "./GlobalStyles";

// biome-ignore lint/style/noNonNullAssertion: root should always present
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <GlobalStyle />
        <App />
    </StrictMode>,
);
