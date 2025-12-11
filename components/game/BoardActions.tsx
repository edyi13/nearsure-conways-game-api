"use client";
import React, { memo } from "react";
import styles from "@/styles/game.module.css";

type Props = {
    boardId: string | null;
    loading: boolean;
    stepsToAdvance: number;
    maxStepsFinal: number;
    onStepsChange: (value: number) => void;
    onMaxStepsChange: (value: number) => void;
    onCreateBoard: () => void;
    onNext: () => void;
    onAdvance: () => void;
    onFinal: () => void;
    errorMessage: string | null;
    hasUnsavedChanges: boolean;
};

export const BoardActions = memo(function BoardActions({
    boardId,
    loading,
    stepsToAdvance,
    maxStepsFinal,
    onStepsChange,
    onMaxStepsChange,
    onCreateBoard,
    onNext,
    onAdvance,
    onFinal,
    errorMessage,
    hasUnsavedChanges,
}: Props & { hasUnsavedChanges: boolean }) {
    const disabledSimulate = !boardId || loading || hasUnsavedChanges;

    return (
        <section className={styles.section}>
        <div className={styles.buttonRow}>
            <button
                type="button"
                className={styles.button}
                onClick={onCreateBoard}
                disabled={loading}
            >
                {boardId ? "Re-create board" : "Create board"}
            </button>

            <button
                type="button"
                className={`${styles.button} ${
                    disabledSimulate ? styles.buttonDisabled : ""
                }`}
                onClick={onNext}
                disabled={disabledSimulate}
            >
                Next
            </button>

            <button
                type="button"
                className={`${styles.button} ${
                    disabledSimulate ? styles.buttonDisabled : ""
                }`}
                onClick={onAdvance}
                disabled={disabledSimulate}
            >
                Advance
            </button>

            <button
                type="button"
                className={`${styles.button} ${
                    disabledSimulate ? styles.buttonDisabled : ""
                }`}
                onClick={onFinal}
                disabled={disabledSimulate}
            >
                Final
            </button>
        </div>

        <div className={styles.formRow}>
            <label className={styles.label}>
                Steps to advance:
                <input
                    type="number"
                    className={styles.inputNumber}
                    min={1}
                    max={500}
                    value={stepsToAdvance}
                    onChange={(e) =>
                    onStepsChange(Math.max(1, Number(e.target.value) || 1))
                    }
                />
            </label>

            <label className={styles.label}>
                Max steps for final:
                <input
                    type="number"
                    className={styles.inputNumber}
                    min={1}
                    max={2000}
                    value={maxStepsFinal}
                    onChange={(e) =>
                    onMaxStepsChange(Math.max(1, Number(e.target.value) || 1))
                    }
                />
            </label>
        </div>

        {
            boardId && hasUnsavedChanges && (
                <p className={styles.warning}>
                Board has local changes. Click &quot;Create board&quot; to sync before
                simulating.
                </p>
            )
        }

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {
            !errorMessage && !hasUnsavedChanges && boardId && (
                <p className={styles.muted}>
                    Board ID: <span>{boardId}</span>
                </p>
            )
        }
        </section>
    );
});