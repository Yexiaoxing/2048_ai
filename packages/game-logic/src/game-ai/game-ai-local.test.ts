import { afterEach, describe, expect, it, vi } from "vitest";
import type { Board } from "../game-types";
import { getAIMove, queryAvailableModels } from "./game-ai-local";

const { listMock, chatMock } = vi.hoisted(() => ({
    listMock: vi.fn(),
    chatMock: vi.fn(),
}));

vi.mock("ollama/browser", () => ({
    default: {
        list: listMock,
        chat: chatMock,
    },
}));

const board: Board = [
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

afterEach(() => {
    vi.clearAllMocks();
});

describe("game-ai-local", () => {
    it("returns model names from ollama list", async () => {
        listMock.mockResolvedValue({
            models: [{ name: "gemma3" }, { name: "qwen2.5" }],
        });

        await expect(queryAvailableModels()).resolves.toEqual(["gemma3", "qwen2.5"]);
    });

    it("parses valid AI move response", async () => {
        chatMock.mockResolvedValue({
            message: {
                content: JSON.stringify({ move: "left", reason: "merge now" }),
            },
        });

        await expect(getAIMove(board, "gemma3")).resolves.toEqual({
            move: "left",
            thinking: "merge now",
        });
    });

    it("throws a clear error for invalid JSON content", async () => {
        chatMock.mockResolvedValue({
            message: {
                content: "not-json",
            },
        });

        await expect(getAIMove(board, "gemma3")).rejects.toThrow(
            "Local AI returned invalid JSON in message content.",
        );
    });
});
