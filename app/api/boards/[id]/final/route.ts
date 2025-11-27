import { NextRequest, NextResponse } from "next/server";
import { boardIdSchema, finalStepsSchema } from "@/lib/schemas";
import { handleApiError, NotFoundError, DomainError } from "@/lib/errors";
import { hashBoardState } from "@/lib/hash";
import { getNextBoardState } from "@/core/gameOfLife";
import {
  getAllBoardStates,
  getLatestBoardState,
  saveBoardState,
} from "@/infrastructure/boardRepository";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id: rawId } = await params;
        const boardId = boardIdSchema.parse(rawId);

        const body = await req.json();
        const { maxSteps } = finalStepsSchema.parse(body);

        const allStates = await getAllBoardStates(boardId);
        if (allStates.length === 0) {
            throw new NotFoundError(
                `Board with id '${boardId}' not found or has no states`,
            );
        }

        const latest = await getLatestBoardState(boardId);
        if (!latest) {
            throw new NotFoundError(
                `Board with id '${boardId}' not found or has no states`,
            );
        }

        let current = latest;
        const fromStep = current.step;

        // hash that we have seen so far
        const seenHashes = new Map<string, number>();
        for (const s of allStates) {
            seenHashes.set(s.hash, s.step);
        }

        // loop to advance up to maxSteps or until stable/loop detected
        for (let i = 1; i <= maxSteps; i++) {
            const nextState = getNextBoardState(current.state);
            const nextHash = hashBoardState(nextState);

            //if the next state is equal to the current, we have reached a stable state
            if (nextHash === current.hash) {
                const finalStep = current.step + 1;
                const finalPersisted = await saveBoardState({
                boardId,
                step: finalStep,
                state: nextState,
                hash: nextHash,
                });

                return NextResponse.json(
                {
                    boardId,
                    fromStep,
                    finalStep,
                    state: {
                    rows: finalPersisted.state.rows,
                    columns: finalPersisted.state.columns,
                    cells: finalPersisted.state.cells,
                    },
                    hash: finalPersisted.hash,
                    status: "STABLE",
                    createdAt: finalPersisted.createdAt.toISOString(),
                },
                { status: 200 },
                );
            }

            // hash seen before => loop detected
            if (seenHashes.has(nextHash)) {
                const firstStep = seenHashes.get(nextHash);
                    throw new DomainError(
                    `The board is oscillating, no final stable state (hash repeated, first seen at step ${firstStep})`,
                );
            }

            // otherwise, save the new state and continue
            const newStep = current.step + 1;
            const persisted = await saveBoardState({
                boardId,
                step: newStep,
                state: nextState,
                hash: nextHash,
            });

            seenHashes.set(nextHash, newStep);
            current = persisted;
        }

        // if we reach here, we have exceeded maxSteps without conclusion
        throw new DomainError(
        "No conclusion reached within maxSteps iterations (neither stable state nor loop detected)",
        );
    } catch (error) {
        return handleApiError(error);
    }
}