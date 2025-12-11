import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBoardSimulation } from "@/hooks/useBoardSimulation";

describe("useBoardSimulation", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // @ts-expect-error - global fetch mock reset
        global.fetch = undefined;
    });

    it("creates a board successfully", async () => {
        const mockResponse = {
            boardId: "test-board-id",
            step: 0,
            state: {
                rows: 2,
                cols: 2,
                cells: [
                [0, 1],
                [1, 0],
                ],
            },
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(() => useBoardSimulation(2, 2));

        await act(async () => {
            await result.current.createBoard();
        });

        expect(result.current.boardId).toBe("test-board-id");
        expect(result.current.cells).toEqual(mockResponse.state.cells);
        expect(result.current.hasUnsavedChanges).toBe(false);
    });

    it("marks board as dirty when toggling a cell", () => {
        const { result } = renderHook(() => useBoardSimulation(2, 2));

        expect(result.current.hasUnsavedChanges).toBe(false);

        act(() => {
            result.current.toggleCell(0, 0);
        });

        expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it("prevents nextState when there are unsaved changes", async () => {
        const mockResponse = {
            boardId: "test-board-id",
            step: 0,
            state: {
                rows: 2,
                cols: 2,
                cells: [
                [0, 0],
                [0, 0],
                ],
            },
        };

        // 1) Mock para createBoard
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(() => useBoardSimulation(2, 2));

        await act(async () => {
            await result.current.createBoard();
        });

        act(() => {
            result.current.toggleCell(0, 0);
        });

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);
        global.fetch = fetchMock;

        await act(async () => {
            await result.current.nextState();
        });

        expect(fetchMock).not.toHaveBeenCalled();
        expect(result.current.errorMessage).toContain("Board has local changes");
    });
});