import * as z from "zod";

export const gameAiSchema = z.object({
    move: z.enum(["up", "down", "left", "right"]),
    reason: z.string().optional(),
});

export type GameAiSchema = z.infer<typeof gameAiSchema>;
