import { NextRequest, NextResponse } from "next/server";
import { boardStateSchema } from "@/lib/schemas";
import { handleApiError } from "@/lib/errors";
import { hashBoardState } from "@/lib/hash";
import type { BoardState, Cell } from "@/core/gameOfLife";
import { createBoardWithInitialState } from "@/infrastructure/boardRepository";

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();

        const parsed = boardStateSchema.parse(json);

        // mapping to domain board state
        const initialState: BoardState = {
        rows: parsed.rows,
        columns: parsed.columns,
        cells: parsed.cells as Cell[][],
        };

        // hashing the initial state
        const initialHash = hashBoardState(initialState);

        // persisting the board and its initial state
        const persisted = await createBoardWithInitialState({
            initialState,
            initialHash,
        });

        return NextResponse.json(
        {
            boardId: persisted.boardId,
            initialState: {
                rows: persisted.state.rows,
                columns: persisted.state.columns,
                cells: persisted.state.cells,
            },
            step: persisted.step, // debería ser 0
            hash: persisted.hash,
            createdAt: persisted.createdAt.toISOString(),
        },
        { status: 201 },
        );
    } catch (error) {
        // delegating any error to our common handler
        return handleApiError(error);
    }
}