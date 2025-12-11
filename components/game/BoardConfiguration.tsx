//  use client directive is necessary for React components that use hooks or other client-side features
// and is required in Next.js 13+ with the app directory structure.
"use client";
import React, { memo } from "react";
import styles from "@/styles/game.module.css";

type Props = {
    rows: number;
    columns: number;
    onResize: (rows: number, columns: number) => void;
    onReset: () => void;
};

export const BoardConfiguration = memo(function BoardConfiguration({
    rows,
    columns,
    onResize,
    onReset,
}: Props) {
    const handleRowsChange = (value: string) => {
        const num = Number(value);
        if (Number.isNaN(num)) return;
        onResize(Math.max(1, num), columns);
    };

    const handleColsChange = (value: string) => {
        const num = Number(value);
        if (Number.isNaN(num)) return;
        onResize(rows, Math.max(1, num));
    };

    return (
        <section className={styles.section}>
        <div className={styles.formRow}>
            <label className={styles.label}>
                Rows:
                <input
                    type="number"
                    className={styles.inputNumber}
                    min={1}
                    max={50}
                    value={rows}
                    onChange={(e) => handleRowsChange(e.target.value)}
                />
            </label>

            <label className={styles.label}>
                Columns:
                <input
                    type="number"
                    className={styles.inputNumber}
                    min={1}
                    max={50}
                    value={columns}
                    onChange={(e) => handleColsChange(e.target.value)}
                />
            </label>

            <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={onReset}
            >
            Reset board
            </button>
        </div>
        <p className={styles.muted}>
            Edit the dimensions and then update the board. You can toggle individual
            cells directly in the grid.
        </p>
        </section>
    );
});
