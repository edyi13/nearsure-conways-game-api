"use client";

import { useState, useCallback } from "react";
import type { Cells, BoardStateResponse } from "@/lib/uiTypes";

const DEFAULT_ROWS = 10;
const DEFAULT_COLUMNS = 10;
const MAX_ROWS = 50;
const MAX_COLUMNS = 50;

function createGrid(rows: number, columns: number): Cells {
    return Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => 0),
    );
}

export function useBoardSimulation(
    initialRows: number = DEFAULT_ROWS,
    initialColumns: number = DEFAULT_COLUMNS
) {
    const [rows, setRows] = useState(initialRows);
    const [columns, setColumns] = useState(initialColumns);
    const [cells, setCells] = useState<Cells>(() =>
        createGrid(initialRows, initialColumns)
    );

    const [boardId, setBoardId] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<BoardStateResponse | null>(null);

    const [stepsToAdvance, setStepsToAdvance] = useState<number>(5);
    const [maxStepsFinal, setMaxStepsFinal] = useState<number>(100);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const markDirty = useCallback(() => {
        setHasUnsavedChanges(true);
    }, []);

    const clearDirty = useCallback(() => {
        setHasUnsavedChanges(false);
    }, []);

    const resetBoard = useCallback(() => {
        setCells((prev) => createGrid(prev.length || rows, prev[0]?.length || columns));
        setBoardId(null);
        setLastResponse(null);
        setErrorMessage(null);
        markDirty();
    }, [columns, rows, markDirty]);

    const resizeGrid = useCallback((newRows: number, newColumns: number) => {
            const safeRows = Math.max(1, Math.min(newRows, MAX_ROWS));
            const safeColumns = Math.max(1, Math.min(newColumns, MAX_COLUMNS));

            setRows(safeRows);
            setColumns(safeColumns);
            setCells(createGrid(safeRows, safeColumns));
            setBoardId(null);
            setLastResponse(null);
            setErrorMessage(null);
            markDirty();
        },
        [markDirty]
    );

    const toggleCell = useCallback(
        (r: number, c: number) => {
            setCells((prev) => {
                const next = prev.map((row) => [...row]);
                next[r][c] = next[r][c] === 1 ? 0 : 1;
                return next;
            });
            markDirty();
        },
        [markDirty]
    );

    const parseResponse = useCallback(
        async (res: Response, defaultError: string): Promise<BoardStateResponse> => {
            const json = (await res.json()) as BoardStateResponse;

            if (!res.ok) {
                throw new Error(json?.error?.message ?? defaultError);
            }

            return json;
        },
        []
    );

    const ensureCanSimulate = useCallback((): boolean => {
        if (!boardId) {
            setErrorMessage("Please create a board before simulating.");
            return false;
        }
        if (hasUnsavedChanges) {
            setErrorMessage(
                "Board has local changes. Click 'Create board' to sync before simulating."
            );
            return false;
        }
        return true;
    }, [boardId, hasUnsavedChanges]);

    const createBoard = useCallback(async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch("/api/boards", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows, columns, cells }),
            });

            const json = await parseResponse(res, "Failed to create board.");

            setBoardId(json.boardId ?? null);

            if (json.state?.cells) {
                setCells(json.state.cells);
            }

            setLastResponse(json);
            clearDirty();
        } catch (err: any) {
            console.error("useBoardSimulation:createBoard", err);
            setErrorMessage(err?.message ?? "Unexpected error creating board.");
        } finally {
            setLoading(false);
        }
    }, [rows, columns, cells, parseResponse, clearDirty]);

    const nextState = useCallback(async () => {
        if (!ensureCanSimulate()) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/boards/${boardId}/next`, {
                method: "POST",
            });

            const json = await parseResponse(res, "Failed to get next state.");

            if (json.state?.cells) {
                setCells(json.state.cells);
            }

            setLastResponse(json);
            clearDirty();
        } catch (err: any) {
            console.error("useBoardSimulation:nextState", err);
            setErrorMessage(err?.message ?? "Unexpected error computing next state.");
        } finally {
            setLoading(false);
        }
    }, [boardId, ensureCanSimulate, parseResponse, clearDirty]);

    const advance = useCallback(async () => {
        if (!ensureCanSimulate()) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/boards/${boardId}/advance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ steps: stepsToAdvance }),
            });

            const json = await parseResponse(res, "Failed to advance board.");

            if (json.state?.cells) {
                setCells(json.state.cells);
            }

            setLastResponse(json);
            clearDirty();
        } catch (err: any) {
            console.error("useBoardSimulation:advance", err);
            setErrorMessage(err?.message ?? "Unexpected error advancing board.");
        } finally {
            setLoading(false);
        }
    }, [boardId, stepsToAdvance, ensureCanSimulate, parseResponse, clearDirty]);

    const finalState = useCallback(async () => {
        if (!ensureCanSimulate()) return;

        setLoading(true);
        setErrorMessage(null);

        try {
            const res = await fetch(`/api/boards/${boardId}/final`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ maxSteps: maxStepsFinal }),
            });

            const json = await parseResponse(res, "Failed to compute final state.");

            if (json.state?.cells) {
                setCells(json.state.cells);
            }

            setLastResponse(json);
            clearDirty();
        } catch (err: any) {
            console.error("useBoardSimulation:finalState", err);
            setErrorMessage(err?.message ?? "Unexpected error computing final state.");
        } finally {
            setLoading(false);
        }
    }, [boardId, maxStepsFinal, ensureCanSimulate, parseResponse, clearDirty]);

    return {
        rows,
        columns,
        cells,
        boardId,
        lastResponse,
        stepsToAdvance,
        maxStepsFinal,
        loading,
        errorMessage,
        hasUnsavedChanges,

        resizeGrid,
        toggleCell,
        resetBoard,
        setStepsToAdvance,
        setMaxStepsFinal,

        createBoard,
        nextState,
        advance,
        finalState,
    };
}