import type { Board } from "@2048/game-logic";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getRemoteAIMove } from "./game-ai-remote";

const board: Board = [
    [2, 4, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];

afterEach(() => {
    vi.restoreAllMocks();
});

describe("getRemoteAIMove", () => {
    it("returns parsed move and reason when remote response is valid", async () => {
        const resp = {
            choices: [
                {
                    message: {
                        content: JSON.stringify({
                            move: "left",
                            reason: "merge tiles",
                            leftChange: "",
                            rightChange: "",
                            upChange: "",
                            downChange: "",
                        }),
                    },
                },
            ],
        };
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        const result = await getRemoteAIMove(board, {
            apiEndpoint: "https://example.com/chat/completions",
            apiSecret: "test-secret",
            selectedRemoteModel: "gpt-test",
        });

        expect(result).toEqual({ move: "left", thinking: "merge tiles" });
    });

    it("throws a clear error when remote endpoint returns non-JSON", async () => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => {
                throw new Error("invalid json");
            },
            text: async () => "invalid json",
        } as unknown as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI returned a non-JSON response (200).");
    });

    it("throws provider error details when request fails", async () => {
        const resp = {
            error: {
                message: "Invalid API key",
            },
        };

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 401,
            statusText: "Unauthorized",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI request failed (401): Invalid API key");
    });

    it("uses top-level message when error payload has no nested object", async () => {
        const resp = {
            message: "Rate limit exceeded",
        };

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI request failed (429): Rate limit exceeded");
    });

    it("falls back to status text when payload has no message", async () => {
        const resp = {};
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            status: 503,
            statusText: "Service Unavailable",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI request failed (503): Service Unavailable");
    });

    it("throws when success response has missing message content", async () => {
        const resp = {
            choices: [],
        };
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI response did not contain message content.");
    });

    it("throws when message content is not valid JSON", async () => {
        const resp = {
            choices: [
                {
                    message: {
                        content: "this is not json",
                    },
                },
            ],
        };
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI returned invalid JSON in message content.");
    });

    it("throws when parsed content does not match expected schema", async () => {
        const resp = {
            choices: [
                {
                    message: {
                        content: JSON.stringify({ move: "diagonal", reason: "bad move" }),
                    },
                },
            ],
        };

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            status: 200,
            statusText: "OK",
            json: async () => resp,
            text: async () => JSON.stringify(resp),
        } as Response);

        await expect(
            getRemoteAIMove(board, {
                apiEndpoint: "https://example.com/chat/completions",
            }),
        ).rejects.toThrow("Remote AI response schema validation failed:");
    });
});
