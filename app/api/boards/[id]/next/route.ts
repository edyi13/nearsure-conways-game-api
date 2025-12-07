import { NextRequest, NextResponse } from "next/server";
import { boardIdSchema } from "@/lib/schemas";
import { handleApiError, NotFoundError } from "@/lib/errors";
import { hashBoardState } from "@/lib/hash";
import { getNextBoardState } from "@/core/gameOfLife";
import {
    getLatestBoardState,
    saveBoardState,
} from "@/infrastructure/boardRepository";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } ,
) {
    try {
        // getting the id from the route params
        const { id } = await context.params;
        // validating the id to be valid
        const boardId = boardIdSchema.parse(id);

        const latest = await getLatestBoardState(boardId);
        if (!latest) {
            throw new NotFoundError(
                `The board with id '${boardId}' was not found or has no states`,
            );
        }

        const nextState = getNextBoardState(latest.state);

        const nextHash = hashBoardState(nextState);

        const nextPersisted = await saveBoardState({
            boardId,
            step: latest.step + 1,
            state: nextState,
            hash: nextHash,
        });

        return NextResponse.json(
        {
            boardId: nextPersisted.boardId,
            step: nextPersisted.step,
            state: {
                rows: nextPersisted.state.rows,
                columns: nextPersisted.state.columns,
                cells: nextPersisted.state.cells,
            },
            hash: nextPersisted.hash,
            createdAt: nextPersisted.createdAt.toISOString(),
        },
        { status: 200 },
        );
    } catch (error) {
        return handleApiError(error);
    }
}