import type { GameAiSchema } from "./schema";

export interface IGameAiResponse {
    move: GameAiSchema["move"];
    thinking?: string | null;
}
