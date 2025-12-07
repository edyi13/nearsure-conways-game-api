"use client";

import { useState } from "react";
import type { Cells, BoardStateResponse } from "@/lib/uiTypes";

const MAX_ROWS = 50;
const MAX_COLUMNS = 50;

function createGrid(rows: number, columns: number): Cells {
    return Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => 0),
    );
}

export function useBoardSimulation(
    initialRows: number = MAX_ROWS,
    initialCols: number = MAX_COLUMNS
) {
    const [rows, setRows] = useState(initialRows);
    const [columns, setColumns] = useState(initialCols);
    const [cells, setCells] = useState<Cells>(() =>
        createGrid(initialRows, initialCols)
    );

    const [boardId, setBoardId] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<BoardStateResponse | null>(
        null
    );

    const [stepsToAdvance, setStepsToAdvance] = useState<number>(5);
    const [maxStepsFinal, setMaxStepsFinal] = useState<number>(100);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 🔹 Flag para saber si el grid tiene cambios locales no sincronizados con el backend
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    function markDirty() {
        setHasUnsavedChanges(true);
    }

    function clearDirty() {
        setHasUnsavedChanges(false);
    }

    function resetBoard() {
        setCells(createGrid(rows, columns));
        setBoardId(null);
        setLastResponse(null);
        setErrorMessage(null);
        markDirty();
    }

    function resizeGrid(newRows: number, newCols: number) {
        const safeRows = Math.max(1, Math.min(newRows, MAX_ROWS));
        const safeCols = Math.max(1, Math.min(newCols, MAX_COLUMNS));

        setRows(safeRows);
        setColumns(safeCols);
        setCells(createGrid(safeRows, safeCols));
        setBoardId(null);
        setLastResponse(null);
        setErrorMessage(null);
        markDirty();
    }

    function toggleCell(r: number, c: number) {
        setCells((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = next[r][c] === 1 ? 0 : 1;
        return next;
        });
        markDirty();
    }

    async function parseResponse(res: Response, defaultError: string) {
        const json = (await res.json()) as BoardStateResponse;

        if (!res.ok) {
        throw new Error(json?.error?.message ?? defaultError);
        }

        return json;
    }

    function ensureCanSimulate(): boolean {
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
    }

    async function createBoard() {
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

        // Opcional: si el backend normaliza el board, usamos su versión
        if (json.state?.cells) {
            setCells(json.state.cells);
        }

        setLastResponse(json);
        clearDirty(); // 🔹 ya estamos en sync con el backend
        } catch (err: any) {
        setErrorMessage(err?.message ?? "Unexpected error creating board.");
        } finally {
        setLoading(false);
        }
    }

    async function nextState() {
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
        // 🔹 A partir de aquí el estado local SIEMPRE viene del backend
        clearDirty();
        } catch (err: any) {
        setErrorMessage(err?.message ?? "Unexpected error computing next state.");
        } finally {
        setLoading(false);
        }
    }

    async function advance() {
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
        setErrorMessage(err?.message ?? "Unexpected error advancing board.");
        } finally {
        setLoading(false);
        }
    }

    async function finalState() {
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
        setErrorMessage(err?.message ?? "Unexpected error computing final state.");
        } finally {
        setLoading(false);
        }
    }

    return {
        // state
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

        // setters-helpers
        resizeGrid,
        toggleCell,
        resetBoard,
        setStepsToAdvance,
        setMaxStepsFinal,

        // actions
        createBoard,
        nextState,
        advance,
        finalState,
    };
}