/**
 * Terminal UI Visualization for 2048 board
 */

export interface TUIStyle {
    bgColor: string;
    cellColors: string[];
    textColor: string;
    gridColor: string;
}

export const STYLES: Record<string, TUIStyle> = {
    classic: {
        bgColor: "\x1b[48;5;15m", // White background
        cellColors: [
            "\x1b[48;5;15m", // Empty - white
            "\x1b[48;5;224m", // 2
            "\x1b[48;5;223m", // 4
            "\x1b[48;5;216m", // 8
            "\x1b[48;5;209m", // 16
            "\x1b[48;5;208m", // 32
            "\x1b[48;5;202m", // 64
            "\x1b[48;5;196m", // 128
            "\x1b[48;5;196m", // 256
            "\x1b[48;5;161m", // 512
            "\x1b[48;5;125m", // 1024
            "\x1b[48;5;89m", // 2048
        ],
        textColor: "\x1b[38;5;0m", // Black text
        gridColor: "\x1b[38;5;8m", // Gray
    },
    dark: {
        bgColor: "\x1b[48;5;16m", // Black background
        cellColors: [
            "\x1b[48;5;16m", // Empty
            "\x1b[48;5;235m", // Dark gray
            "\x1b[48;5;238m", // Medium gray
            "\x1b[48;5;241m", // Light gray
            "\x1b[48;5;243m", // Lighter gray
            "\x1b[48;5;245m", // Even lighter
            "\x1b[48;5;247m", // Tan
            "\x1b[48;5;185m", // Gold
            "\x1b[48;5;184m", // Light gold
            "\x1b[48;5;228m", // Yellow
            "\x1b[48;5;227m", // Light yellow
            "\x1b[48;5;226m", // Bright yellow
        ],
        textColor: "\x1b[38;5;15m", // White text
        gridColor: "\x1b[38;5;8m", // Gray
    },
};

const RESET = "\x1b[0m";

export class TUIRenderer {
    private style: TUIStyle;

    constructor(styleName: string = "classic") {
        this.style = STYLES[styleName] || STYLES.classic;
    }

    private _renderBoard(grid: number[][]): string {
        const lines: string[] = [];

        for (let row = 0; row < 4; row++) {
            const rowLines = this._renderRow(grid[row], row);
            lines.push(...rowLines);
        }

        return lines.join("\n");
    }

    private _renderRow(row: number[], rowIdx: number): string[] {
        const lines: string[] = [];

        // Top border
        if (rowIdx === 0) {
            lines.push(this._renderTopBorder());
        }

        // Cell content
        const contentLine = row.map((val) => this._renderCell(val)).join("\x1b[38;5;8m│\x1b[0m");
        lines.push(`\x1b[38;5;8m│\x1b[0m${contentLine}\x1b[38;5;8m│\x1b[0m`);

        if (rowIdx < 3) {
            // Middle divider
            lines.push(this._renderRowDivider());
        }

        return lines;
    }

    private _renderCell(value: number): string {
        const maxWid = 7;
        const colorIdx = Math.min(
            Math.log2(Math.max(value, 2)) - 1,
            this.style.cellColors.length - 1,
        );
        const bgColor =
            value === 0 ? this.style.bgColor : this.style.cellColors[Math.max(0, colorIdx)];

        const text = value === 0 ? "." : value.toString();
        const padding = Math.max(0, maxWid - text.length);
        const left = Math.floor(padding / 2);
        const right = padding - left;

        return (
            bgColor +
            this.style.textColor +
            " ".repeat(left) +
            text +
            " ".repeat(right) +
            " " +
            RESET
        );
    }

    private _renderCellBorder(): string {
        const cellBorder = Array(9).join("─");

        return cellBorder;
    }

    private _renderTopBorder(): string {
        const cellBorder = this._renderCellBorder();
        return `\x1b[38;5;8m┌${cellBorder}┬${cellBorder}┬${cellBorder}┬${cellBorder}┐\x1b[0m`;
    }

    private _renderRowDivider(): string {
        const cellBorder = this._renderCellBorder();
        return `\x1b[38;5;8m├${cellBorder}┼${cellBorder}┼${cellBorder}┼${cellBorder}┤\x1b[0m`;
    }

    private _renderBottomBorder(): string {
        const cellBorder = this._renderCellBorder();
        return `\x1b[38;5;8m└${cellBorder}┴${cellBorder}┴${cellBorder}┴${cellBorder}┘\x1b[0m`;
    }

    renderGameState(grid: number[][], score: number, moves: number): string {
        let output = this._renderBoard(grid);
        output += `\n${this._renderBottomBorder()}`;
        output += "\n";
        output += `\x1b[1mScore: ${score}\x1b[0m        \x1b[1mMoves: ${moves}\x1b[0m`;

        return output;
    }
}

export function clearScreen(): void {
    process.stdout.write("\x1b[2J\x1b[H");
}

export function moveCursor(x: number, y: number): void {
    process.stdout.write(`\x1b[${y};${x}H`);
}

export function hideCursor(): void {
    process.stdout.write("\x1b[?25l");
}

export function showCursor(): void {
    process.stdout.write("\x1b[?25h");
}

export function reset(): void {
    process.stdout.write(RESET);
}
