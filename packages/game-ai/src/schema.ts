import * as z from "zod";

export const gameAiSchema = z.object({
    move: z.enum(["up", "down", "left", "right", "invalid"]),
    reason: z.string().nullable(),
});

export type GameAiSchema = z.infer<typeof gameAiSchema>;
