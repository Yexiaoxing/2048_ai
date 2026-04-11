import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { Board } from "@2048/game-logic";
import {
    BoardInputContainer,
    CellInput,
    DebugButton,
    DebugButtonContainer,
    DebugHintText,
    DebugPanelContainer,
    DebugPanelTitle,
    DebugToggleButton,
    ErrorMessage,
} from "./index.styles";

interface IDebugBoardOverrideProps {
    board: Board;
    onOverride: (board: Board) => void;
    isDebugMode: boolean;
    onToggleDebugMode: () => void;
}

export const DebugBoardOverride: React.FC<IDebugBoardOverrideProps> = ({
    board,
    onOverride,
    isDebugMode,
    onToggleDebugMode,
}) => {
    const [inputValues, setInputValues] = useState<(string | number)[][]>(
        board.map((row) => row.map((val) => (val === 0 ? "" : val))),
    );
    const [error, setError] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const parseBoardFromClipboard = useCallback(
        (rawClipboardText: string): (string | number)[][] => {
            let parsed: Array<Array<number>>;
            try {
                parsed = JSON.parse(rawClipboardText);
            } catch {
                throw new Error("Clipboard does not contain valid JSON.");
            }

            if (!Array.isArray(parsed) || parsed.length !== board.length) {
                throw new Error(`Board must contain exactly ${board.length} rows.`);
            }

            for (const [rowIdx, row] of parsed.entries()) {
                if (!Array.isArray(row) || row.length !== board[rowIdx].length) {
                    throw new Error(
                        `Row ${rowIdx + 1} must contain exactly ${board[rowIdx].length} values.`,
                    );
                }

                for (const cell of row) {
                    if (!Number.isInteger(cell) || cell < 0) {
                        throw new Error(
                            "All board values must be non-negative integers.",
                        );
                    }
                }
            }

            return parsed.map((row) => row.map((val) => (val === 0 ? "" : val)));
        },
        [board],
    );

    const handleCellChange = (row: number, col: number, value: string) => {
        const numValue = value === "" ? 0 : parseInt(value, 10);
        if (!Number.isNaN(numValue) && numValue >= 0) {
            const newValues = inputValues.map((r, rIdx) =>
                rIdx === row ? r.map((v, cIdx) => (cIdx === col ? value : v)) : r,
            );
            setInputValues(newValues);
        }
    };

    const handleApplyBoard = useCallback(() => {
        const newBoard: Board = inputValues.map((row) =>
            row.map((val) => (val === "" ? 0 : parseInt(val.toString(), 10))),
        ) as Board;

        // Check for odd numbers
        const oddNumbers: number[] = [];
        for (const row of newBoard) {
            for (const val of row) {
                if (val > 0 && val % 2 !== 0) {
                    oddNumbers.push(val);
                }
            }
        }

        if (oddNumbers.length > 0) {
            const uniqueOddNumbers = [...new Set(oddNumbers)];
            setError(
                `Invalid board: odd number(s) detected (${uniqueOddNumbers.join(", ")}). All tiles must be even.`,
            );
            return;
        }

        setError(null);
        onOverride(newBoard);
    }, [inputValues, onOverride]);

    const handleResetToCurrentBoard = useCallback(() => {
        setInputValues(board.map((row) => row.map((val) => (val === 0 ? "" : val))));
        setError(null);
    }, [board]);

    const handleClearBoard = useCallback(() => {
        setInputValues(board.map(() => ["", "", "", ""]));
        setError(null);
    }, [board]);

    const handleCopyBoard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(board));
            setCopyStatus("Board copied");
            setError(null);
        } catch {
            setCopyStatus(null);
            setError("Failed to copy board state to clipboard.");
        }
    }, [board]);

    const handlePasteBoard = useCallback(async () => {
        try {
            const rawClipboardText = await navigator.clipboard.readText();
            const parsedInputValues = parseBoardFromClipboard(rawClipboardText);
            setInputValues(parsedInputValues);
            setCopyStatus("Board pasted");
            setError(null);
        } catch (e) {
            setCopyStatus(null);
            if (e instanceof Error) {
                setError(`Failed to paste board: ${e.message}`);
                return;
            }
            setError("Failed to paste board from clipboard.");
        }
    }, [parseBoardFromClipboard]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: By design, only want to reset on re-open
    useEffect(() => {
        // Reset debug board inputs to current board whenever debug mode is toggled on
        if (isDebugMode) {
            handleResetToCurrentBoard();
        } else {
            setError(null);
            setCopyStatus(null);
        }
    }, [isDebugMode]);

    useEffect(() => {
        if (!copyStatus) {
            return;
        }

        const timer = window.setTimeout(() => {
            setCopyStatus(null);
        }, 2500);

        return () => window.clearTimeout(timer);
    }, [copyStatus]);

    if (!isDebugMode) {
        return (
            <DebugToggleButton onClick={onToggleDebugMode}>🐛 Open Debug Mode</DebugToggleButton>
        );
    }

    return (
        <DebugPanelContainer id="debug-board-override">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <DebugPanelTitle>🐛 Debug Mode - Board Override</DebugPanelTitle>
                <DebugToggleButton onClick={onToggleDebugMode}>Close</DebugToggleButton>
            </div>

            <DebugHintText>
                Press Ctrl+Shift+D (or Cmd+Shift+D on Mac) to toggle debug mode anytime
            </DebugHintText>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <BoardInputContainer>
                {inputValues.map((row, rowIdx) =>
                    row.map((_, colIdx) => (
                        <CellInput
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation> only possible key
                            key={`${rowIdx}-${colIdx}`}
                            type="number"
                            min="0"
                            value={inputValues[rowIdx][colIdx]}
                            onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                            inputMode="numeric"
                        />
                    )),
                )}
            </BoardInputContainer>

            <DebugButtonContainer>
                <DebugButton onClick={handleApplyBoard}>✓ Apply Board</DebugButton>
                <DebugButton onClick={handleResetToCurrentBoard}>↻ Reset</DebugButton>
                <DebugButton onClick={handleClearBoard}>✕ Clear</DebugButton>
                <DebugButton onClick={handleCopyBoard}>⧉ Copy Board</DebugButton>
                <DebugButton onClick={handlePasteBoard}>⎘ Paste Board</DebugButton>
            </DebugButtonContainer>

            {copyStatus && <DebugHintText>{copyStatus}</DebugHintText>}
        </DebugPanelContainer>
    );
};
