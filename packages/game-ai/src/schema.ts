import * as z from "zod";

export const gameAiSchema = z.object({
    reason: z.string().nullable(),
    move: z.enum(["up", "down", "left", "right", "invalid"]),
});

export type GameAiSchema = z.infer<typeof gameAiSchema>;
