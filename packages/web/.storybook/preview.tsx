import type { Preview } from "@storybook/react-vite";
import { GlobalStyle } from "../src/GlobalStyles";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <>
                <GlobalStyle />
                {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
                <Story />
            </>
        ),
    ],
};

export default preview;
