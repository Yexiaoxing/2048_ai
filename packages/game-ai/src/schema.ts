import * as z from "zod";

export const gameAiSchema = z.object({
    leftChange: z
        .string()
        .describe("A description of how the board will change after moving left."),
    rightChange: z
        .string()
        .describe("A description of how the board will change after moving right."),
    upChange: z.string().describe("A description of how the board will change after moving up."),
    downChange: z
        .string()
        .describe("A description of how the board will change after moving down."),
    reason: z.string().nullable(),
    move: z.enum(["up", "down", "left", "right", "invalid"]),
});

export type GameAiSchema = z.infer<typeof gameAiSchema>;
