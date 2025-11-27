import { describe, it, beforeEach, expect } from "vitest";
import { resetDatabase } from "./dbTestUtils";
import {
    createBoardWithInitialState,
    getLatestBoardState,
    getBoardStateAtStep,
    getAllBoardStates,
    saveBoardState,
} from "@/infrastructure/boardRepository";
import { getNextBoardState, type BoardState } from "@/core/gameOfLife";
import { hashBoardState } from "@/lib/hash";

describe("Board repository + engine integration", () => {
    beforeEach(async () => {
        await resetDatabase();
    });

    it("creates a board with initial state at step 0", async () => {
        const initial: BoardState = {
            rows: 2,
            columns: 2,
            cells: [
                [1, 0],
                [0, 1],
            ],
        };

        const initialHash = hashBoardState(initial);

        const persisted = await createBoardWithInitialState({
            initialState: initial,
            initialHash,
        });

        expect(persisted.boardId).toBeDefined();
        expect(persisted.step).toBe(0);
        expect(persisted.state.rows).toBe(2);
        expect(persisted.state.columns).toBe(2);
        expect(persisted.state.cells).toEqual(initial.cells);

        const latest = await getLatestBoardState(persisted.boardId);
        expect(latest).not.toBeNull();
        expect(latest!.step).toBe(0);
    });

    it("saves and retrieves next state correctly", async () => {
        // Board con blinker vertical
        const initial: BoardState = {
            rows: 3,
            columns: 3,
            cells: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        };
        const initialHash = hashBoardState(initial);

        const persistedInitial = await createBoardWithInitialState({
        initialState: initial,
        initialHash,
        });

        const nextState = getNextBoardState(persistedInitial.state);
        const nextHash = hashBoardState(nextState);

        const persistedNext = await saveBoardState({
            boardId: persistedInitial.boardId,
            step: 1,
            state: nextState,
            hash: nextHash,
        });

        expect(persistedNext.step).toBe(1);

        const fromRepo = await getBoardStateAtStep({
            boardId: persistedInitial.boardId,
            step: 1,
        });

        expect(fromRepo).not.toBeNull();
        expect(fromRepo!.state.cells).toEqual(nextState.cells);

        const all = await getAllBoardStates(persistedInitial.boardId);
        expect(all.map((s) => s.step)).toEqual([0, 1]);
    });

    it("latest state advances as new steps are saved", async () => {
        const initial: BoardState = {
            rows: 3,
            columns: 3,
            cells: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        };
        const initialHash = hashBoardState(initial);

        const persistedInitial = await createBoardWithInitialState({
            initialState: initial,
            initialHash,
        });

        const step1State = getNextBoardState(persistedInitial.state);
        const step1Hash = hashBoardState(step1State);

        await saveBoardState({
            boardId: persistedInitial.boardId,
            step: 1,
            state: step1State,
            hash: step1Hash,
        });

        const step2State = getNextBoardState(step1State);
        const step2Hash = hashBoardState(step2State);

        await saveBoardState({
            boardId: persistedInitial.boardId,
            step: 2,
            state: step2State,
            hash: step2Hash,
        });

        const latest = await getLatestBoardState(persistedInitial.boardId);
        expect(latest).not.toBeNull();
        expect(latest!.step).toBe(2);
        expect(latest!.state.cells).toEqual(step2State.cells);
    });
});