import { NextRequest, NextResponse } from "next/server";
import { boardIdSchema, advanceStepsSchema } from "@/lib/schemas";
import { handleApiError, NotFoundError } from "@/lib/errors";
import { hashBoardState } from "@/lib/hash";
import { getNextBoardState } from "@/core/gameOfLife";
import {
    getLatestBoardState,
    getBoardStateAtStep,
    saveBoardState,
} from "@/infrastructure/boardRepository";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    try {
        const { id } = await params;
        const boardId = boardIdSchema.parse(id);

        const body = await req.json();
        const { steps } = advanceStepsSchema.parse(body);

        const latest = await getLatestBoardState(boardId);
        if (!latest) {
        throw new NotFoundError(
            `the board with id '${boardId}' was not found or has no states`,
        );
        }

        let current = latest;
        const fromStep = latest.step;
        const targetStep = latest.step + steps;

        // going through each step until reaching targetStep
        for (let step = fromStep + 1; step <= targetStep; step++) {
        // if the state at 'step' already exist, we reuse it
        const existing = await getBoardStateAtStep({ boardId, step });
        if (existing) {
            current = existing;
            continue;
        }

        const nextState = getNextBoardState(current.state);
        const nextHash = hashBoardState(nextState);

        const persisted = await saveBoardState({
            boardId,
            step,
            state: nextState,
            hash: nextHash,
        });

        current = persisted;
        }

        return NextResponse.json(
        {
            boardId,
            fromStep,
            toStep: targetStep,
            state: {
            rows: current.state.rows,
            columns: current.state.columns,
            cells: current.state.cells,
            },
            hash: current.hash,
            createdAt: current.createdAt.toISOString(),
        },
        { status: 200 },
        );
    } catch (error) {
        return handleApiError(error);
    }
}