import { createHash } from "crypto";
import type { BoardState } from "@/core/gameOfLife";

// hashing function for board state
export function hashBoardState(board: BoardState): string {
    const json = JSON.stringify(board.cells);
    const hash = createHash("sha256").update(json).digest("hex");
    return hash;
}